var exec = require('child_process').exec;
var fs = require('fs');

function video2dash(filename, id) {
    var cmd = 'ffmpeg -re -i ' + './upload/' + filename + ' '
            + ' -c:a aac -c:v libx264 '
            + ' -map 0 -map 0 '
            + ' -b:v:0 800k -b:v:1 300k '
            + '-bf 1 -keyint_min 120 -g 120 -sc_threshold 0 '
            + '-b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 '
            + '-window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a" '
            + '-f dash ./public/media/vod/' + id + '/index.mpd' ;
    fs.mkdir('./public/media/vod/'+id, function (err) {
        console.log('mkdir')
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
mediaOperator = {
    video2dash: video2dash,
    videoInfo:videoInfo,
    getVideoThumbnail:getVideoThumbnail
};

module.exports = mediaOperator;