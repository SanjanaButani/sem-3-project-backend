const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = { };
            const secret = process.env.ACCESS_TOKEN_KEY;
            const options = { audience: userId };
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err);
                    reject(createError.InternalServerError("Something went wrong!"));
                }
                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const token = req.headers['authorization'].split(" ")[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_KEY,(err, payload) => {
            if(err){
                const message = err.name === "JsonWebTokenError" ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
    },
    getUserIdFromToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const token = req.headers['authorization'].split(" ")[1]; 
        JWT.verify(token, process.env.ACCESS_TOKEN_KEY,(err, payload) => {
            if(err){
                const message = err.name === "JsonWebTokenError" ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            return payload;
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = { };
            const secret = process.env.REFRESH_TOKEN_KEY;
            const options = { expiresIn: '1y', audience: userId };
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err);
                    reject(createError.InternalServerError("Something went wrong!"));
                }
                resolve(token);
            });
        });
    },
    verifyRefreshToken: (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.REFRESH_TOKEN_KEY, (err, payload) => {
                if(err) return reject(createError.Unauthorized());
                const userId = payload.aud;
                resolve(userId);
            });
        });
    }
};