/*****************************************************************************************
 *
 * Client Credentials Model
 *
 *****************************************************************************************/
const env = process.env.NODE_ENV;
const localConfig = require('../../config/env/'+env);
const format = require('util').format;
const jwt = require('jsonwebtoken');

const ePath                    = 'oauth2-server/lib/errors/',
    InvalidGrantError          = require(ePath + 'invalid-grant-error');

const RedisDataFormat = {
    CLIENT: `${localConfig.serviceId}_oauth_clients:%s`,
    TOKEN: `${localConfig.serviceId}_oauth_tokens:%s`,
    USER: `${localConfig.serviceId}_oauth_users:%s`
};
function OAuthRedisModel(options) {
    this.redis = options.cache;
    this.logger = options.logger;
    this.publicKey = options.publicKey;
    this.privateKey = options.privateKey;
}

OAuthRedisModel.prototype.getClient = async function(clientId, clientSecret){
    this.logger.debug(`OAuth : Get client, clientId is ${clientId}`)
    if(clientId+clientSecret === localConfig.oauth.clientId+localConfig.oauth.clientSecret){
        return await {
            id : clientId,
            grants:['implicit', 'refresh_token', 'password', 'authorization_code'],
            //redirectUris
        }
    }

    return null;

    let key = format(RedisDataFormat.CLIENT, clientId)
    // console.log(this.redis.get)
    // let data = await this.redis.get(key)

}

OAuthRedisModel.prototype.getUserFromClient = async function(client){
    this.logger.debug(`OAuth : Get user from client, user is `)
    return await {username: 'internal'}
}

OAuthRedisModel.prototype.getUser = async function(username, password){
    this.logger.debug(`OAuth : Get user, username is ${username}`)
    console.log(username);
    console.log(password)
    return await {username: '123123'}
}

OAuthRedisModel.prototype.generateAccessToken = async function(client, user, scope){
    this.logger.debug(`OAuth : Generate access token.`)
    const token = jwt.sign(user, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: localConfig.oauth.accessTokenExpiresIn //JWT expires time
    });
    return token;
}

OAuthRedisModel.prototype.generateRefreshToken = async function(client, user, scope){
    this.logger.debug(`OAuth : Generate refresh token.`)
    const token = jwt.sign(user, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: localConfig.oauth.refreshTokenExpiresIn //JWT expires time
    });
    return token;
}

OAuthRedisModel.prototype.saveToken = async function(token, client, user){
    this.logger.debug(`OAuth : Save tokens.`)
    const data = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client: client,
        user: user
    };
    await this.redis.set(format(RedisDataFormat.TOKEN, token.accessToken), JSON.stringify(data))
    await this.redis.set(format(RedisDataFormat.TOKEN, token.refreshToken), JSON.stringify(data))
    return data;
}

OAuthRedisModel.prototype.getAccessToken = async function(accessToken){
    this.logger.debug(`OAuth : Get access token.`)
    let value = await this.redis.get(format(RedisDataFormat.TOKEN, accessToken))
    let token = JSON.parse(value)
    return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
        scope: token.scope,
        client: token.client,
        user: token.user
    };
}

OAuthRedisModel.prototype.getRefreshToken = async function(refreshToken){
    this.logger.debug(`OAuth : Get refresh token.`)
    let value = await this.redis.get(format(RedisDataFormat.TOKEN, refreshToken))
    if(!value){
        throw new InvalidGrantError();
    }
    let token = JSON.parse(value)
    return {
        refreshToken: token.refreshToken || token.accessToken,
        refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt || token.accessTokenExpiresAt),
        scope: token.scope,
        client: token.client,
        user: token.user
    };
}

OAuthRedisModel.prototype.revokeToken = async function(token){
    this.logger.debug(`OAuth : Revoke token.`)
    let tokenKey = format(RedisDataFormat.TOKEN, token);
    try{
        await this.redis.set(tokenKey, null)
        return true;
    }catch (e) {
        return false;
    }
}

OAuthRedisModel.prototype.validateScope = async function(user, client, scope) {
    this.logger.debug(`OAuth : Validate scope, client is ${client.id}`)
    console.log(user)
    console.log(client)
    console.log(scope)
    return scope
}


module.exports = OAuthRedisModel

// module.exports = {
//
// //     validateScope(user, client, scope, callback){
// //         return new Promise()
// //     },
// //
// }
