var mediaOperator = require('./utils.media-operator');

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
    mediaOperator.rtmp2dash(StreamPath);
});

nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

//nms.run();

module.exports = nms;
