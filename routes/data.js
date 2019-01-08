var express = require('express');
var router = express.Router();
var db = require('../model/db');
var fileOperator = require('../utils/utils.file-operator');

router.get('/videos/:type', function (req, res) {
    db.findVideoByType(req.params.type, function (err, docs) {
        res.send(docs);
    })
});

router.get('/videos/delete/:id', function (req, res) {
    db.deleteVideoById(req.params.id,function (err) {
        if(err){
            console.log(err);
            res.send();
        }else{
            fileOperator.rmdir('./public/media/vod/'+ req.params.id, function (err) {
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
});



module.exports = router;