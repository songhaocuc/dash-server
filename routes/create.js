var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var db = require('../model/db');
var idGenernator = require('../utils/utils.id-generator');
var pyUtils = require('../utils/run_python');

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
            // mediaOperator.video2dash(req.body.filename, id);
            mediaOperator.getVideoThumbnail(req.body.filename, id);
            mediaOperator.videoInfo(req.body.filename, function (info) {
                db.createNewVideo({
                    name: req.body.name,
                    id: id,
                    type: 'vod',
                    createTime : new Date(),
                    duration: info.duration,
                    filename: req.body.filename,
                    description: req.body.description,
                    bitrateList: req.body.bitrateList,
                    resolutionList: req.body.resolutionList
                }, function (err, object) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    mediaOperator.generateVodDashByConfig(id);
                    res.render('create/create-res.ejs', {
                        type: 'vod',
                        label: 'create',
                        resMessage: 'create vod success: ' + id
                    });
                });
            })
        }else if (type === 'live'){
            db.createNewVideo({
                name: req.body.name,
                id: id,
                type: 'live',
                createTime : new Date(),
                liveon: false,
                description: req.body.description,
                bitrateList: req.body.bitrateList,
                resolutionList: req.body.resolutionList
            }, function (err, object) {
                if(err){
                    console.log(err);
                    return;
                }
                res.render('create/create-res.ejs', {
                    type: 'live',
                    label: 'create',
                    resMessage: 'create live success , live url: rtmp://localhost/live/' + id
                });
            });
        }else if (type === 'cloud'){
            db.createNewVideo({
                name: req.body.name,
                id: id,
                type: 'cloud',
                createTime : new Date(),
                url: req.body.url,
                description: req.body.description
            }, function (err, object) {
                mediaOperator.getThumbnailByMPD(req.body.url, id);
                if(err){
                    console.log(err);
                    return;
                }
                res.render('create/create-res.ejs', {
                    type: 'cloud',
                    label: 'create',
                    resMessage: 'create cloud success , video id: ' + id
                });
            });
        }else if(type === 'abr'){
            db.createNewRule({
                name: req.body.name,
                id: id,
                type: 'abr',
                createTime : new Date(),
                description:req.body.description
            }, function (obj, err) {
                pyUtils.unzipAbrRule(req.body.filename, id);
                res.render('create/create-res.ejs', {
                    type: 'abr',
                    label: 'create',
                    resMessage: 'create ABRRule success , id: ' + id
                });
            })
        }
        else {
            res.render('create/create-res.ejs', {
                type: type,
                label: 'create',
                resMessage: 'error type'
            });
        }
    });

    //res.send('success');
});


module.exports = router;