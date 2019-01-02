var exec = require('child_process').exec;
var fs = require('fs');

function video2dash(filename) {
    var cmd = 'ffmpeg -re -i ' + './upload/' + filename + ' '
            + ' -c:a aac -c:v libx264 '
            + ' -map 0 -map 0 '
            + ' -b:v:0 800k -b:v:1 300k '
            + '-bf 1 -keyint_min 120 -g 120 -sc_threshold 0 '
            + '-b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 '
            + '-window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a" '
            + '-f dash ./public/media/vod/' + filename.replace(/.\w+$/, '') + '/index.mpd' ;
    fs.mkdir('./public/media/vod/'+filename.replace(/.\w+$/, ''), function (err) {
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
    video2dash: video2dash
};

module.exports = mediaOperator;