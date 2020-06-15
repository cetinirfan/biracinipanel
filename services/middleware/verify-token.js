var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = "%rasfa%&&&!sd79h9dsh98h689ds9*s)=qweqw312";

function verifyToken(req, res, next){
    var {token} = req.cookies;
    jwt.verify(token,SECRET, function(err, decoded) {
        if (err) {
            return res.redirect('/login/login');
        } else {


            res.locals.adminFullName = decoded.adminFullName
            res.locals.profilePhoto = decoded.profilePhoto
            res.locals._id = decoded._id


            req.adminFullName = decoded.adminFullName
            req.profilePhoto = decoded.profilePhoto
            req._id = decoded._id
            next()
        }
    });
}

module.exports = verifyToken;