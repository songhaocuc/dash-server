var mediaOperator = require('./utils.media-operator');
var db = require('../model/db');
var fileOperator = require('./utils.file-operator');

const { NodeMediaServer } = require('node-media-server');
const config = {
    logType : 0,
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    }
};

var nms = new NodeMediaServer(config);
nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // mediaOperator.rtmp2dash(StreamPath);
    mediaOperator.generateLiveDashByConfig(StreamPath);
    let vid = /\/(av\d{13})/.exec(StreamPath)[1];
    mediaOperator.getRtmpThumbnail('rtmp://localhost/live/'+vid, 2, vid);
    db.updateVideoById(vid, {
        liveon: true
    }, (err, doc) => {
        if(err){
            console.log(err);
        }
        console.log(doc);
    })
});

nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    let vid = /\/(av\d{13})/.exec(StreamPath)[1];
    console.log(vid);
    db.updateVideoById(vid, {
        liveon: false
    }, (err, doc) => {
        if(err){
            console.log(err);
        }
        fileOperator.rmdir('./public/media/live/'+id);
    })
});

//nms.run();

module.exports = nms;
