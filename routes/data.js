var express = require('express');
var router = express.Router();
var db = require('../model/db');
var fileOperator = require('../utils/utils.file-operator');

router.get('/videos/:type', function (req, res) {
    db.findVideoByType(req.params.type, function (err, docs) {
        res.send(docs);
    });
});

router.get('/abr-rules', function (req, res) {
    db.findAllRules(function (err, docs) {
       res.send(docs);
    });
});

router.get('/abr-rules/delete/:id', function (req, res) {
    db.deleteRuleById(req.params.id, (err)=>{
        if(err){
            console.log(err);
            res.send();
        }else {
            res.send('1');
            fileOperator.rmdir('./public/python/'+req.params.id, (err)=>{
                if(err){
                    console.log(err);
                }
            });
        }
    });
});

router.get('/videos/delete/:id', function (req, res) {
    db.deleteVideoById(req.params.id,function (err) {
        if(err){
            console.log(err);
            res.send();
        }else{
            db.findVideoById(req.params.id, (err, doc) => {
                let type = doc.type;
                if(type === 'vod' && type === 'live'){
                    fileOperator.rmdir('./public/media/'+ type +'/'+ req.params.id, function (err) {
                        if(err){
                            res.send();
                            return;
                        }
                        res.send('1');
                    });
                    fileOperator.rmfile('./public/image/thumbnail/'+ req.params.id + '.jpg', function (err) {
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
});



module.exports = router;