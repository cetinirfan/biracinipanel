const express = require('express')
const router = express.Router();
const Fortune = require('../services/modals/Fortune');
const ReadyFortunes = require('../services/modals/ReadyFortunes');
const Users = require('../services/modals/Users');
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

router.get('/fortuneComment',verifyToken,(req,res)=>{
    Fortune.find({fortuneType:1},(err,find_fortune)=>{
            if(find_fortune.fortuneComment != ''){
                if(err){
                    return res.render('error.ejs');
                }
                res.render('fortuneComment.ejs',{
                    find_fortune,
                    moment,
                    title:'Yorumlanan Fallar'
                })
            }else{
                console.log(err)
            }
        });
});

router.get('/fortune_profile/:_id',verifyToken,(req,res)=>{
    Fortune.findOne({ _id: req.params._id },(err,find_fortune)=>{
        if(find_fortune){
            ReadyFortunes.find({},(err,find_readyFortune)=>{
                if(err){
                    return res.render('error.ejs');
                }
                res.render('fortuneProfile.ejs',{
                    find_readyFortune,
                    find_fortune,
                    moment,
                })
            });
        }
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
    Fortune.findByIdAndUpdate({_id:req.params._id},{$set:{
        fortuneAnswer,
        fortuneType:1
    }},(err,find_fortune)=>{
        const fortuneUser = find_fortune.fortuneUser;
        if(find_fortune){
            Users.findOne({_id:fortuneUser},(err,find_user)=>{
                const oneSignal = find_user.oneSignal;
                console.log(find_user)
                var sendNotification = function(data) {
                    var headers = {
                    "Content-Type": "application/json; charset=utf-8"
                    };
                    
                    var options = {
                    host: "onesignal.com",
                    port: 443,
                    path: "/api/v1/notifications", 
                    method: "POST",
                    headers: headers
                    };
                    
                    var https = require('https');
                    var req = https.request(options, function(res) {
                    res.on('data', function(data) {
                    console.log("Response:");
                    console.log(JSON.parse(data));
                    });
                    });
                    
                    req.on('error', function(e) {
                    console.log("ERROR:");
                    console.log(e);
                    });
                    
                    req.write(JSON.stringify(data));
                    req.end();
                    };
                    
                    var message = {
                    app_id: "18f2b792-2640-4124-8d79-975d609d8589",
                    contents: {"en": 'Gönderdiğiniz falı cevaplayıcı cinimiz inceledi ve cevapladı.'},
                    include_player_ids: [oneSignal]
                    };
                    
                    sendNotification(message); 
                     return res.send("<script> alert('Fal gönderim işlemi başarılı.'); window.location = '/fortunes/fortunes/'; </script>")
            });
        }else{
            return res.render('error.ejs');
        }
        
    });
});


module.exports = router;
