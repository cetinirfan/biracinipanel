const express = require('express');
const router = express.Router();
const Application = require('../services/modals/Application');
const verifyToken = require('../services/middleware/verify-token');
var multer  = require('multer')
const fs =require('fs');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/app/"); // here we specify the destination . in this case i specified the current directory
    },
    filename: function(req, file, cb) {
      console.log(file); 
      cb(null, file.originalname);// here we specify the file saving name . in this case i specified the original file name
    }
  });
  
  var uploadDisk = multer({ storage: storage });
  router.get('/uploadFortune',verifyToken,(req,res) => {
    res.render('application.ejs');
  });

  router.post('/uploadFortune',uploadDisk.single("image"),(req,res)=>{
      const appId = "5eea5f10c2ab1908e98b8a41";
    Application.findOne({_id:appId})
    .exec()
    .then(data=>{
      fs.unlink('./uploads/app/'+data.fortunePhoto, (err)=> {
        if(err){
            console.log(err)
        }
      })
      Application.findByIdAndUpdate({_id:appId}, { $set: {fortunePhoto:'/uploads/app/'+req.file.filename} },{new: true},(err,data)=>{
        if(err){
            return res.render('error.ejs');
        }

        return res.send("<script> alert('Güncelleme işlemi başarılı.'); window.location = '/application/uploadFortune/'; </script>")
      });
    })
  });

  router.post('/uploadSpeed',uploadDisk.single("image"),(req,res)=>{
      const appId = "5eea5f10c2ab1908e98b8a41";
    Application.findOne({_id:appId})
    .exec()
    .then(data=>{
      fs.unlink('./uploads/app/'+data.speedPhoto, (err)=> {
        if(err){
            console.log(err)
        }
      })
      Application.findByIdAndUpdate({_id:appId}, { $set: {speedPhoto:'/uploads/app/'+req.file.filename} },{new: true},(err,data)=>{
        if(err){
            return res.render('error.ejs');
        }

        return res.send("<script> alert('Güncelleme işlemi başarılı.'); window.location = '/application/uploadFortune/'; </script>")
      });
    })
  });

  router.post('/uploadBarley',uploadDisk.single("image"),(req,res)=>{
      const appId = "5eea5f10c2ab1908e98b8a41";
    Application.findOne({_id:appId})
    .exec()
    .then(data=>{
      fs.unlink('./uploads/app/'+data.barleyPhoto, (err)=> {
        if(err){
            console.log(err)
        }
      })
      Application.findByIdAndUpdate({_id:appId}, { $set: {barleyPhoto:'/uploads/app/'+req.file.filename} },{new: true},(err,data)=>{
        if(err){
            return res.render('error.ejs');
        }

        return res.send("<script> alert('Güncelleme işlemi başarılı.'); window.location = '/application/uploadFortune/'; </script>")
      });
    })
  });

/*   router.get('/sendFortune',verifyToken,(req,res) => {
    const appId = "5eea5f10c2ab1908e98b8a41";
    Application.find({_id:appId},(err,find_app)=>{
        if(err){
            res.render('error.ejs');
        }
        res.render('applicationText.ejs',{
            find_app,
        })
    });
  }); */

  router.post('/sendFortune',(req,res)=>{
    const appId = "5eea5f10c2ab1908e98b8a41";
    const {sendFortune}=req.body;
    Application.findByIdAndUpdate({_id:appId}, { $set: {sendFortune:sendFortune} },{new: true},(err,data)=>{
      if(err){
          return res.render('error.ejs');
      }
      return res.send("<script> alert('Güncelleme işlemi başarılı.'); window.location = '/application/sendFortune/'; </script>")
    });
});


router.get('/sendFortune/5eea5f10c2ab1908e98b8a41',verifyToken,(req,res)=>{
    Application.findOne({_id: '5eea5f10c2ab1908e98b8a41'},(err,find_app)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('applicationText.ejs',{
            find_app,
        })

    });
});
  

module.exports = router;