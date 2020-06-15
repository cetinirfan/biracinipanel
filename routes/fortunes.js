const express = require('express')
const router = express.Router();
const Fortune = require('../services/modals/Fortune');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');

router.get('/fortunes',verifyToken,(req,res)=>{
    Fortune.find({fortuneType:1},(err,find_fortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('fortunes.ejs',{
            find_fortune,
            moment,
            title:'Cevaplanmış Fallar'
        })
    });
});

router.get('/fortune_profile/:_id',verifyToken,(req,res)=>{
    Fortune.findOne({ _id: req.params._id },(err,find_fortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('fortuneProfile.ejs',{
            find_fortune,
            moment,
        })
    });
});

router.get('/waiting_fortunes',verifyToken,(req,res)=>{
    Fortune.find({fortuneType:0},(err,find_fortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('waiting.ejs',{
            find_fortune,
            title:'Cevaplanmayı Bekleyen Fallar',
            moment

        })
    });
});

router.get('/deleteFortune/:_id',verifyToken,(req,res)=>{
    Fortune.findByIdAndRemove({_id:req.params._id},(err,find_fortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Fal Başarıyla Silindi'); window.location = '../../fortunes/waiting_fortunes/'; </script>")
    });
});

router.post('/answerFortune/:_id',verifyToken,(req,res)=>{
    const { fortuneAnswer } = req.body;
    const _id = req.params._id;
    if(! fortuneAnswer || !_id){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/fortunes/fortuneProfile/"+_id+"'; </script>")
    }
    Fortune.updateOne({_id:req.params._id},{$set:{
        fortuneAnswer,
        fortuneType:1
    }},(err,find_fortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Fal gönderim işlemi başarılı.'); window.location = '/fortunes/fortunes/'; </script>")
    });

});



module.exports = router;
