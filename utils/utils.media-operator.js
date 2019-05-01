var exec = require('child_process').exec;
var fs = require('fs');
const dashOperator = require('./dash-operator');
var db = require('../model/db');

function video2dash(filename, id) {
    var cmd = 'ffmpeg -re -y -i ' + '\"./upload/' + filename + '\" '
            + ' -c:a aac -c:v libx264 '
            + ' -map 0:v -map 0:v -map 0:v '
            + ' -b:v:0 800k -b:v:1 300k -b:v:2 2500k '
            + '-bf 1 -keyint_min 120 -g 120 '
            + ' -use_timeline 1 -use_template 1 '
            + ' -init_seg_name init-$RepresentationID$.m4s -media_seg_name chunk-$RepresentationID$-$Number$.m4s '
            + '-window_size 5 -adaptation_sets "id=0,streams=v " '
            + '-f dash ./public/media/vod/' + id + '/index.mpd' ;
    fs.mkdir('./public/media/vod/'+id, function (err) {
        if(err){
            console.log(err);
        }
        exec(cmd , function (err, stdout, stderr) {
            if(err){
                console.log(err);
            }
        })
    });
}
// filepath
function videoInfo(filename, callback){
    let cmd = 'ffmpeg -i ' + '\"./upload/' + filename +'\"';
    exec(cmd, function (err, stdout, stderr) {
        if(err){
            if(/At\sleast\sone\soutput\sfile\smust\sbe\sspecified/.test(err)){
                console.log('no output');
            }else
                console.log(err);
        }
        let duration = /Duration:\s(.{8})/i.exec(stderr)[1];
        let info = {
            duration: duration
        };
        callback(info);
    })
}

function getVideoThumbnail(filename, id){
    let cmd = 'ffmpeg -i ' + '\"./upload/' + filename + '\" -y -f image2 -t 0.001 -s 320x200 ./public/image/thumbnail/'+ id + '.jpg';
    exec(cmd, function (err, stdout, stderr) {
        if(err){
            console.log(err);
        }
    })
}

function getRtmpThumbnail(url, delay, id){
    let cmd = 'ffmpeg -i \"' + url + '\" -y -f image2 -ss ' + delay + ' -s 320x200 ./public/image/thumbnail/'+ id + '.jpg';
    exec(cmd, function (err, stdout, stderr) {
        if(err){
            console.log(err);
        }
    })
}

function rtmp2dash(stream){
    let id = /\/(av\d{13})/.exec(stream)[1];
    var cmd = 'ffmpeg -re -i rtmp://localhost/live/' + id + ' '
        + ' -c:a aac -c:v libx264 '
        + ' -map 0:v -map 0:v -map 0:v '
        + ' -b:v:0 800k -b:v:1 300k -b:v:2 2500k '
        + '-bf 1 -keyint_min 0 -g 100 '
        + ' -use_timeline 1 -use_template 1 '
        + ' -init_seg_name init-$RepresentationID$.m4s -media_seg_name chunk-$RepresentationID$-$Number$.m4s '
        + '-window_size 5 -adaptation_sets "id=0,streams=v " '
        + '-f dash ./public/media/live/' + id + '/index.mpd' ;
    fs.mkdir('./public/media/live/'+id, function (err) {
        if(err){
            console.log(err);
        }
        exec(cmd , function (err, stdout, stderr) {
            if(err){
                console.log(err);
            }
        })
    });
}

function getThumbnailByMPD(_url, id) {
    dashOperator.getVideoByMPD(_url, id, (filepath)=>{
        let cmd = 'ffmpeg -i ' + '\"' + filepath + '\" -y -f image2 -t 0.001 -ss 3 -s 320x200 ./public/image/thumbnail/'+ id + '.jpg';
        exec(cmd, function (err, stdout, stderr) {
            if(err){
                console.log(err);
            }
            console.log('[MPD Thumbnail] OK');
        })
    })
}

function generateLiveDashByConfig(stream){
    let id = /\/(av\d{13})/.exec(stream)[1];
    db.findVideoById(id, (err, doc)=>{
        let bitrateStr = doc.bitrateList;
        // let resolutionStr = doc.resolutionList;
        let bitrates = bitrateStr.split(',');
        // let resolutions = resolutionStr.split(',');
        let mapCmd = "";
        for (let i in bitrates){
            mapCmd += " -map 0:v -b:v:"+i+" "+ bitrates[i]+"k ";// -s:v:"+i+" "+resolutions[i]+" ";
        }
        console.log('[map] '+ mapCmd);
        let command = 'ffmpeg -re -y -i rtmp://localhost/live/' + id + ' '
            + ' -c:a aac -c:v libx264 '
            + mapCmd
            + ' -bf 1 -keyint_min 120 -g 120 '
            + ' -use_timeline 1 -use_template 1 '
            + ' -min_seg_duration 500 '
            // + ' -init_seg_name init-$RepresentationID$.m4s -media_seg_name chunk-$RepresentationID$-$Number$.m4s '
            + ' -window_size 5 -adaptation_sets "id=0,streams=v " '
            + ' -f dash ./public/media/live/' + id + '/index.mpd' ;
        console.log("[command]"+command);
        fs.mkdir('./public/media/live/'+id, function (err) {
            if(err){
                console.log(err);
            }
            exec(command , function (err, stdout, stderr) {
                if(err){
                    console.log(err);
                }
                console.log('1111111111');
            })
        });
    })
}

function generateVodDashByConfig(id){
    db.findVideoById(id, (err, doc)=>{
        let bitrateStr = doc.bitrateList;

        let bitrates = bitrateStr.split(',');

        let mapCmd = "";
        for (let i in bitrates){
            mapCmd += " -map 0:v -b:v:"+i+" "+ bitrates[i]+"k "; //-s:v:"+i+" "+resolutions[i]+" ";
        }
        var command = 'ffmpeg -re -i  ' + '\"./upload/' + doc.filename + '\" '
            + '-y -c:a aac -c:v libx264 '
            + mapCmd
            + ' -bf 1 -keyint_min 0 -g 120 '
            + ' -use_timeline 1 -use_template 1 '
            + ' -min_seg_duration 1000 '
            // + ' -init_seg_name init-$RepresentationID$.m4s -media_seg_name chunk-$RepresentationID$-$Number$.m4s '
            + ' -window_size 5 -adaptation_sets "id=0,streams=v " '
            + ' -f dash ./public/media/vod/' + id + '/index.mpd' ;
        fs.mkdir('./public/media/vod/'+id, function (err) {
            if(err){
                console.log(err);
            }
            exec(command , function (err, stdout, stderr) {
                if(err){
                    console.log(err);
                }
                console.log('[转码完成]');
            })
        });
    })
}

mediaOperator = {
    video2dash: video2dash,
    videoInfo:videoInfo,
    getVideoThumbnail:getVideoThumbnail,
    getRtmpThumbnail: getRtmpThumbnail,
    rtmp2dash:rtmp2dash,
    getThumbnailByMPD:getThumbnailByMPD,
    generateLiveDashByConfig:generateLiveDashByConfig,
    generateVodDashByConfig:generateVodDashByConfig
};

module.exports = mediaOperator;