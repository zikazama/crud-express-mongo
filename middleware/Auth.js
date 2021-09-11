const jwt = require("jsonwebtoken");

function authAccessUser(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        res.json({ message: 'Invalid access token'});
    }
	else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,payload) => {
            if(err){
                res.json({ message: 'Token kadarluasa' });
            }
            if(payload.role != 'user'){
                res.json({ message: 'Kredensial Ditolak' });
            }
            else{
                req.payload = payload;
                next();
            }
        });
    }
}

function authAccessAdmin(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        res.json({ message: 'Invalid access token'});
    }
	else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,payload) => {
            if(err){
                res.json({ message: 'Token kadarluasa' });
            }
            if(payload.role != 'admin'){
                res.json({ message: 'Kredensial Ditolak' });
            }
            else{
                req.payload = payload;
                next();
            }
        });
    }
}

function authRefresh(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        res.json({ message: 'Invalid refresh token'});
    }
	else{
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err,payload) => {
            if(err){
                res.json({ message: 'Token kadarluasa' });
            }
            else{
                req.payload = payload;
                next();
            }
        });
    }
}

module.exports = {authAccessUser, authAccessAdmin,authRefresh}