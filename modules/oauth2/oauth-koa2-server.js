'use strict';
const
    OAuthServer = require('oauth2-server'),
    Request     = OAuthServer.Request,
    Response    = OAuthServer.Response;

const ePath                  = 'oauth2-server/lib/errors/',
    OAuthError               = require(ePath + 'oauth-error'),
    InvalidScopeError        = require(ePath + 'invalid-scope-error'),
    InvalidArgumentError     = require(ePath + 'invalid-argument-error'),
    UnauthorizedRequestError = require(ePath + 'unauthorized-request-error');

const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV;
const localConfig = require('../../config/env/'+env)

class KoaOAuthServer {
    constructor(options) {
        this.options = options || {};
        this.options.accessTokenLifetime = localConfig.oauth.accessTokenExpiresIn
        this.options.refreshTokenLifetime = localConfig.oauth.refreshTokenExpiresIn

        if(!options.model) {
            throw new InvalidArgumentError('Missing parameter: `model`');
        }

        // If no `saveTokenMetadata` method is set via the model, we create
        // a simple passthrough mechanism instead
        this.saveTokenMetadata = options.model.saveTokenMetadata
            ? options.model.saveTokenMetadata
            : (token, data) => { return Promise.resolve(token); };

        // If no `checkScope` method is set via the model, we provide a default
        this.checkScope = options.model.checkScope
            ? options.model.checkScope
            : (scope, token) => { return token.scope.indexOf(scope) !== -1; }

        this.server = new OAuthServer(options);

        this.logger = options.logger;

    }

    // Returns token authentication middleware
    authenticate() {
        this.logger.debug('Creating authentication endpoint middleware');
        return async (ctx, next) => {
            this.logger.debug('Running authenticate endpoint middleware');
            const request  = new Request(ctx.request),
                response = new Response(ctx.response);

            await this.server
                .authenticate(request, response)
                .then(async (token) => {
                    ctx.state.oauth = { token: token };
                    await next();
                })
                .catch((err) => { this._handleError(err, ctx); });
        };
    }

    // Returns authorization endpoint middleware
    // Used by the client to obtain authorization from the resource owner
    authorize(options) {
        this.logger.debug('Creating authorization endpoint middleware');
        return async (ctx, next) => {
            this.logger.debug('Running authorize endpoint middleware');
            const request  = new Request(ctx.request),
                response = new Response(ctx.response);

            await this.server
                .authorize(request, response, options)
                .then(async (code) => {
                    ctx.state.oauth = { code: code };
                    this._handleResponse(ctx, response);
                    await next();
                })
                .catch((err) => { this._handleError(err, ctx); });
        };
    }

    tokenKey(publicKey){
        return async (ctx, next) => {
            ctx.body = {
                alg: 'SHA256withRSA',
                value: publicKey
            }
        }
    }

    checkToken(publicKey){
        return async (ctx, next) => {
            let token = ctx.getParam('token');
            try{
                let decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
                ctx.body = ""
            }catch (e) {
                ctx.throw(400, 'Bad token')
            }
        }
    }

    // Returns token endpoint middleware
    // Used by the client to exchange authorization grant for access token
    token() {
        this.logger.debug('Creating token endpoint middleware');
        return async (ctx, next) => {
            this.logger.debug('Running token endpoint middleware');
            const request  = new Request(ctx.request),
                response = new Response(ctx.response);

            await this.server
                .token(request, response)
                .then((token) => {
                    return this.saveTokenMetadata(token, ctx.request);
                })
                .then(async (token) => {
                    ctx.state.oauth = { token: token };
                    this._handleResponse(ctx, response);
                    await next();
                })
                .catch((err) => { this._handleError(err, ctx); });
        };
    }

    // Returns scope check middleware
    // Used to limit access to a route or router to carriers of a certain scope.
    scope(required) {
        this.logger.debug(`Creating scope check middleware (${required})`);
        return (ctx, next) => {
            const result = this.checkScope(required, ctx.state.oauth.token);
            if(result !== true) {
                const err = result === false
                    ? `Required scope: \`${required}\``
                    : result;

                this._handleError(new InvalidScopeError(err), ctx);
                return;
            }

            return next();
        };
    }

    _handleResponse(ctx, response) {
        this.logger.debug(`Preparing success response (${response.status})`);
        ctx.set(response.headers);
        ctx.status = response.status;
        ctx.body   = response.body;
    }

    _handleError(err, ctx) {
        this.logger.debug(`Preparing error response (${err.code || 500})`);

        const response = new Response(ctx.response);
        ctx.set(response.headers);

        ctx.status = err.code || 500;
        throw err;
    }
}

// Expose error classes
KoaOAuthServer.OAuthError               = OAuthError;
KoaOAuthServer.InvalidScopeError        = InvalidScopeError;
KoaOAuthServer.InvalidArgumentError     = InvalidArgumentError;
KoaOAuthServer.UnauthorizedRequestError = UnauthorizedRequestError;

module.exports = KoaOAuthServer;
