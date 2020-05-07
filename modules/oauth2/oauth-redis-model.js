/*****************************************************************************************
 *
 * Client Credentials Model
 *
 *****************************************************************************************/
const env = process.env.NODE_ENV;
const localConfig = require('../../config/env/'+env);
const format = require('util').format;
const jwt = require('jsonwebtoken');
const RedisDataFormat = {
    CLIENT: 'oauth_clients:%s',
    TOKEN: 'oauth_tokens:%s',
    USER: 'oauth_users:%s'
};
const JWT_TOKEN_DELAY = 1000 * 15;

function OAuthRedisModel(options) {
    this.redis = options.cache;
    this.publicKey = options.publicKey;
    this.privateKey = options.privateKey;
}

OAuthRedisModel.prototype.getClient = async function(clientId, clientSecret){
    let key = format(RedisDataFormat.CLIENT, clientId)
    // console.log(this.redis.get)
    // let data = await this.redis.get(key)
    return await {
        id : localConfig.oauth.clientId,
        grants:['password', 'client_credentials'],
        //redirectUris
        //accessTokenLifetime
        //refreshTokenLifetime
    }
}

OAuthRedisModel.prototype.getUserFromClient = async function(client){
    return await {username: 'internal'}
}

OAuthRedisModel.prototype.getUser = async function(username, password){
    console.log(username);
    console.log(password)
    return await {username: '123123'}
}

OAuthRedisModel.prototype.generateAccessToken = async function(client, user, scope){
    const token = jwt.sign(user, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: localConfig.oauth.accessTokenExpiresIn + JWT_TOKEN_DELAY //JWT expires time
    });
    return token;
}

OAuthRedisModel.prototype.generateRefreshToken = async function(client, user, scope){
    const token = jwt.sign({timestamp : new Date().getTime()}, this.privateKey, {
        algorithm: 'RS256',
        expiresIn: localConfig.oauth.refreshTokenExpiresIn + JWT_TOKEN_DELAY //JWT expires time
    });
    return token;
}

OAuthRedisModel.prototype.saveToken = async function(token, client, user){
    const data = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client: client,
        user: user
    };
    await this.redis.set(format(RedisDataFormat.TOKEN, token.accessToken), data)
    await this.redis.set(format(RedisDataFormat.TOKEN, token.refreshToken), data)
    return data;
}

OAuthRedisModel.prototype.getAccessToken = async function(accessToken){
    let value = await this.redis.get(format(RedisDataFormat.TOKEN, accessToken))
    return {
        //accessToken: token.accessToken,
        //accessTokenExpiresAt
        //scope
        //client:
        //user:
    };
}

OAuthRedisModel.prototype.getRefreshToken = async function(refreshToken){
    let value = await this.redis.get(format(RedisDataFormat.TOKEN, refreshToken))
    return {
        //refreshToken: ,
        //refreshTokenExpiresAt
        //scope
        //client:
        //user:
    };
}

OAuthRedisModel.prototype.revokeToken = async function(token){


    return true || false;
}


module.exports = OAuthRedisModel

// module.exports = {
//
// //     validateScope(user, client, scope, callback){
// //         return new Promise()
// //     },
// //
// }
