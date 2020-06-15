const express = require('express');
const router = express.Router();
const Admin = require('../services/modals/Admin');
const Users = require('../services/modals/Users');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');

router.get('/users',verifyToken,(req,res)=>{
    Users.find({userBanType:0},(err,find_user)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('users.ejs',{
            find_user,
            moment, 
            title:'Tüm Kullanıcılar'          
        })
    });

});
router.get('/disabled_users',verifyToken,(req,res)=>{
    Users.find({userBanType:1},(err,find_user)=>{
        if(err){
            res.render('error.ejs');
        }
        res.render('bannedUser.ejs',{
            find_user,
            moment,
            title:'Engelli Kullanıcılar' 
        })
    });
});

router.get('/removeBannedUser/:_id',verifyToken,(req,res)=>{
    Users.updateOne({_id:req.params._id},{$set:{userBanType:0}},(err,find_user)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Kullanıcı Engeli Başarıyla Kaldırıldı'); window.location = '/users/disabled_users/'; </script>")
    });
});

router.get('/bannedUser/:_id',verifyToken,(req,res)=>{
    Users.updateOne({_id:req.params._id},{$set:{userBanType:1}},(err,find_user)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Kullanıcı Başarıyla Engellendi'); window.location = '/users/users/'; </script>")
    });
});

router.get('/deleteUser/:_id',verifyToken,(req,res)=>{
    Users.removeOne({_id:req.params._id},(err,find_user)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Kullanıcı Başarıyla Silindi'); window.location = '/users/users/'; </script>")
    });
});

router.get('/updatePhoto/:_id',verifyToken,(req,res)=>{
        Users.updateOne({_id:req.params._id},{$set:{userPhoto:'https://i.hizliresim.com/pJ7Oqd.png'}},(err,find_user)=>{
            if(err){
                return res.render('error.ejs');
            }
            return res.send("<script> alert('Resim Başarıyla Sıfırlandı'); window.location = '/users/users/'; </script>")
        });
});


module.exports = router;