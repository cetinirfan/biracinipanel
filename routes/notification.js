const express = require('express')
const router = express.Router();
const Fortune = require('../services/modals/Fortune');
const Users = require('../services/modals/Users');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');

router.get('/usersNot',verifyToken,(req,res)=>{
    Users.find({userBanType:0},(err,find_user)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('usersNot.ejs',{
            find_user,
            moment, 
            title:'Tüm Kullanıcılar'          
        })
    });

});

router.get('/singleNotification/:_id',verifyToken,(req,res)=>{
    Users.findOne({ _id: req.params._id },(err,find_user)=>{
        if(find_user){
            if(err){
                return res.render('error.ejs');
            }
            res.render('sendSingleNotification.ejs',{
                find_user,
                moment,
            })
        }
    });
});

router.post('/singleNotification/:_id',verifyToken,(req,res)=>{
    const { notificationMessage } = req.body;
    const _id = req.params._id;
    if(! notificationMessage || !_id){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/notification/fortuneProfile/"+_id+"'; </script>")
    }
            Users.findOne({_id:req.params._id},(err,find_user)=>{
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
                    contents: {"en": notificationMessage },
                    include_player_ids: [oneSignal]
                    };
                    
                    sendNotification(message); 
                     return res.send("<script> alert('Bildirim gönderim işlemi başarılı.'); window.location = '/notification/usersNot/'; </script>")
            });        
});
 
router.get('/multipleNotification', (req, res, next) => {
    res.render('multipleNot.ejs');
  });

router.post('/multipleNotification',(req,res)=>{
    const { notificationMessage } = req.body;
    if(! notificationMessage){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/notification/multipleNotification'; </script>")
    }
            Users.find({userBanType:0},(err,find_user)=>{
                const oneSignalList = []; 
                for (let index = 0; index < find_user.length; index++) {
                    const element = find_user[index].oneSignal;
                    if(element!="a"){
                        oneSignalList.push(element)
                    }
                }
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
                    contents: {"en": notificationMessage },
                    include_player_ids: oneSignalList
                    };
                    
                    sendNotification(message); 
                     return res.send("<script> alert('Bildirim gönderim işlemi başarılı.'); window.location = '/notification/multipleNotification/'; </script>")
            });        
});



module.exports = router;