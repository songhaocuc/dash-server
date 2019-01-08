var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var db = require('../model/db');
var idGenernator = require('../utils/utils.id-generator');

var mediaOperator = require('../utils/utils.media-operator');

router.get('/', function (req, res) {
    res.render('create/create', {
        label: 'create',
        type: 'live'
    });
});

router.get('/:type', function (req, res) {
    res.render('create/create', {
        label: 'create',
        type: req.params.type
    });
});

router.post('/:type', function (req, res) {
    console.log(req.body);
    let id = idGenernator.createVideoId();
    let type = req.params.type;
    //确保id唯一
    function uniqueId(videoId, callback){
        db.findVideoById(videoId, function (err, docs) {
            if(err){
                console.log(err);
                return;
            }
            if(docs !== null){
                uniqueId(idGenernator.createVideoId());
            }else{
                callback(videoId);
            }
        })
    }
    uniqueId(id, function (id) {
        //todo
        if ( type === 'vod'){
            mediaOperator.video2dash(req.body.filename, id);
            mediaOperator.getVideoThumbnail(req.body.filename, id);
            mediaOperator.videoInfo(req.body.filename, function (info) {
                db.createNewVideo({
                    name: req.body.name,
                    id: id,
                    type: 'vod',
                    createTime : new Date(),
                    duration: info.duration
                }, function (err, object) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    res.render('create/create-res.ejs', {
                        type: 'vod',
                        label: 'create',
                        resMessage: 'create vod success ' + id
                    });
                });
            })
        }else if (type === 'live'){

        }else if (type === 'cloud'){

        }else {
            res.render('create/create-res.ejs', {
                resMessage: 'error type'
            });
        }
    });

    //res.send('success');
});


module.exports = router;