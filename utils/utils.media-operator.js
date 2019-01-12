var exec = require('child_process').exec;
var fs = require('fs');

function video2dash(filename, id) {
    var cmd = 'ffmpeg -re -i ' + './upload/' + filename + ' '
            + ' -c:a aac -c:v libx264 '
            + ' -map 0:v -map 0:v -map 0:v '
            + ' -b:v:0 800k -b:v:1 300k -b:v:2 2500k '
            + '-bf 1 -keyint_min 0 -g 100 '
            + ' -use_timeline 0 -use_template 1 '
            + ' -init_seg_name init-$RepresentationID$.mp4 -media_seg_name chunk-$RepresentationID$-$Number$.mp4 '
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
    let cmd = 'ffmpeg -i ' + './upload/' + filename;
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
    let cmd = 'ffmpeg -i ' + './upload/' + filename + ' -y -f image2 -t 0.001 -s 320x200 ./public/image/thumbnail/'+ id + '.jpg';
    exec(cmd, function (err, stdout, stderr) {
        if(err){
            console.log(err);
        }
    })
}

function getRtmpThumbnail(url, delay, id){
    let cmd = 'ffmpeg -i ' + url + ' -y -f image2 -ss ' + delay + ' -s 320x200 ./public/image/thumbnail/'+ id + '.jpg';
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

mediaOperator = {
    video2dash: video2dash,
    videoInfo:videoInfo,
    getVideoThumbnail:getVideoThumbnail,
    getRtmpThumbnail: getRtmpThumbnail,
    rtmp2dash:rtmp2dash
};

module.exports = mediaOperator;