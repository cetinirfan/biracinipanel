const express = require('express');
const router = express.Router();
const Admin = require('../services/modals/Admin');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
var SECRET = "%rasfa%&&&!sd79h9dsh98h689ds9*s)=qweqw312";

router.get('/login',(req,res) => {
    res.render('login.ejs'),{
    };
});

router.post("/login", (req,res) => {
    var telephone = req.body.telephone;
    var password = md5(req.body.password);
    Admin.findOne({telephone:telephone,password:password},(err,find_giris)=>{
        if(err){
            return res.render('error.ejs');
        }
        if(find_giris){
            var token = jwt.sign({ _id:find_giris._id ,adminFullName: find_giris.adminFullName,profilePhoto: find_giris.profilePhoto }, SECRET);
            res.cookie('token', token)
            return res.send("<script> alert('Başarıyla girildi'); window.location = '/'; </script>");

        }else{
            return res.status(400).send({"result":400,"status":"FAIL","message":"Telefon numarası veya şifre hatalı!!"});
        }
    });
});



module.exports = router;