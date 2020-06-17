const express = require('express')
const router = express.Router();
const Promotion = require('../services/modals/Promotion');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');
const gnp = require('generate-password');

router.get('/addPromotion',verifyToken,(req,res) => {
    res.render('addPromotion.ejs');
  });

router.post('/addPromotion', (req,res) => {
    const { promotionCode,promotionCount,promotionRights} = req.body;
    const newPromotion = new Promotion({
        promotionCode:promotionCode,
        promotionCount:promotionCount,
        promotionRights:promotionRights,
    });
    newPromotion.save ((err,find_promotion) => {
        if(err){
            res.render('error.ejs');
        }
        return res.send("<script> alert('Promosyon kodu başarıyla eklendi'); window.location = '../../promotion/promotion/'; </script>");
    });
  });

router.get('/promotion',verifyToken,(req,res)=>{
    Promotion.find({promotionCount:{ $gte: 1 }},(err,find_promotion)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('promotion.ejs',{
            find_promotion,
            title:'Promosyon Kodları',
            moment

        })
    });
});

router.get('/deletePromotion/:_id',verifyToken,(req,res)=>{
    Promotion.findByIdAndRemove({_id:req.params._id},(err,find_promotion)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Promosyon Kodu Başarıyla Silindi'); window.location = '../../promotion/promotion/'; </script>")
    });
});


module.exports = router;
