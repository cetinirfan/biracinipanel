const express = require('express')
const router = express.Router();
const ReadyFortunes = require('../services/modals/ReadyFortunes');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');

router.get('/saveFortune',verifyToken,(req,res) => {
    res.render('saveFortune.ejs');
  });

router.post('/saveFortune', (req,res) => {
    const { readyFortune , readyFortuneDescription} = req.body;
    const newReadyFortune = new ReadyFortunes({
        readyFortune:readyFortune,
        readyFortuneDescription:readyFortuneDescription,
    });
    newReadyFortune.save ((err,find_readyFortune) => {
        if(err){
            res.render('error.ejs');
        }
        return res.send("<script> alert('Fal cevabı başarıyla eklendi'); window.location = '../../../readyFortune/saveFortune/'; </script>");
    });
  });

router.get('/readyFortunes',verifyToken,(req,res)=>{
    ReadyFortunes.find({},(err,find_readyFortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('readyFortunes.ejs',{
            find_readyFortune,
            moment,
            title:'Hazır Fal Cevapları'
        })
    });
});

router.get('/deleteReadyFortune/:_id',verifyToken,(req,res)=>{
    ReadyFortunes.findByIdAndRemove({_id:req.params._id},(err,find_readyFortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Fal Cevabı Başarıyla Silindi'); window.location = '../../readyFortune/readyFortunes/'; </script>")
    });
});

router.get('/updateReadyFortune/:_id',verifyToken,(req,res)=>{
    ReadyFortunes.findOne({_id:req.params._id},(err,find_readyFortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('updateFortune.ejs',{
            find_readyFortune,
            moment,
        })
    });
});

router.post('/updateReadyFortune/:_id',verifyToken,(req,res)=>{
    const { readyFortune, readyFortuneDescription} = req.body;
    const _id = req.params._id;
    if(! readyFortune || !readyFortuneDescription || !_id){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/readyFortune/updateReadyFortune/"+_id+"'; </script>")
    }
    ReadyFortunes.updateOne({_id:req.params._id},{$set:{
        readyFortune,
        readyFortuneDescription,
    }},(err,find_readyFortune)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Güncelleme işlemi başarılı.'); window.location = '/readyFortune/readyFortunes/'; </script>")
    });

});

module.exports = router;
