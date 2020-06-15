const express = require('express');
const router = express.Router();
const Admin = require('../services/modals/Admin');
const Users = require('../services/modals/Users');
const moment = require('moment');
const md5 =require('md5');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads"); // here we specify the destination . in this case i specified the current directory
    },
    filename: function(req, file, cb) {
      console.log(file); 
      cb(null, file.originalname);// here we specify the file saving name . in this case i specified the original file name
    }
  });
  
  var uploadDisk = multer({ storage: storage });
  router.get('/register',verifyToken,(req,res) => {
    res.render('addAdmin.ejs');
  });
  
  router.post('/register',uploadDisk.single("image"), (req,res) => {
    const { adminFullName,mail,telephone,password,password2} = req.body;
    if(password != password2){
        return res.send("<script> alert('Şifreler uyuşmadı'); window.location = '/admins/register/'; </script>");
    }
    const newAdmin = new Admin({
      productPhoto:'uploads/'+req.file.originalname,
      adminFullName:adminFullName,
      telephone:telephone,
      mail:mail,
      password:md5(password)
    });
    newAdmin.save ((err,find_admin) => {
        if(err){
            res.render('error.ejs');
        }
        return res.send("<script> alert('Admin başarıyla eklendi'); window.location = '../../admins/admins/'; </script>");
    });
  });

router.get('/admins',verifyToken,(req,res)=>{
    Admin.find({},(err,find_admin)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('admins.ejs',{
            find_admin,
            moment,
            title:'Yöneticiler'
        })
    });

});

router.get('/adminProfile/:_id',verifyToken,(req,res)=>{
    Admin.findOne({_id:req.params._id},(err,find_admin)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('adminProfile.ejs',{
            find_admin,
            moment,
        })
    });
});

router.get('/updateProfile/:_id',verifyToken,(req,res)=>{
    Admin.findOne({_id: req.params._id},(err,find_admin)=>{
        if(err){
            return res.render('error.ejs');
        }
        
        res.render('updateAdmin.ejs',{
            find_admin,
            moment,
        })

    });
});

router.post('/updateProfile/:_id',verifyToken,(req,res)=>{

    const { telephone, mail } = req.body;
    const _id = req.params._id;

    if(! mail || !telephone || !_id){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/admins/updateProfile/"+_id+"'; </script>")
    }
    Admin.updateOne({_id:req.params._id},{$set:{
        mail,
        telephone,
    }},(err,find_admin)=>{
        if(err){
            return res.render('error.ejs');
        }

        return res.send("<script> alert('Güncelleme işlemi başarılı.'); window.location = '/admins/admins/'; </script>")
    });

});

router.get('/deleteAdmin/:_id',verifyToken,(req,res)=>{
    Admin.findOneAndDelete({_id:req.params._id},(err,find_admin)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Admin Başarıyla Silindi'); window.location = '/admins/admins/'; </script>")
    });
});






module.exports = router;