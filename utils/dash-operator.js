const fs = require('fs');
const download = require('download');
var convert = require('xml-js');
const url = require('url');

function getVideoByMPD(_url, id, callback) {
    // let _urlT = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    let urlObj = url.parse(_url);
    download(_url).then((data) => {
        var mpdObj = convert.xml2js(data.toString(), {compact: true});
        var mpd = mpdObj.MPD;
        var period = mpd.Period;
        var adaptionSet = period.AdaptationSet;
        let i;
        let videoSet;
        for(i in adaptionSet){
            if(adaptionSet[i]._attributes.contentType === 'video' ||
                /video/.test(adaptionSet[i]._attributes.mimeType)){
                videoSet = adaptionSet[i];
            }
        }
        let representation;
        if(Array.isArray(videoSet.Representation)){
            let representations = videoSet.Representation;
            representation = representations[0];
            for(let i in representations){
                if(representations[i]._attributes.bandwidth < representation._attributes.bandwidth){
                    representation = representations[i];
                }
            }
        }else {
            representation = videoSet.Representation;
        }
        let initUrl,
            mediaUrl;
        if(videoSet.hasOwnProperty('SegmentTemplate')){
            let template = {
                media: videoSet.SegmentTemplate._attributes.media,
                initialization: videoSet.SegmentTemplate._attributes.initialization
            };
            let initPath = template.initialization.replace(/\$RepresentationID\$/g, representation._attributes.id);
            let mediaPath = template.media.replace(/\$RepresentationID\$/g, representation._attributes.id);
            mediaPath = mediaPath.replace('$Number$', videoSet.SegmentTemplate._attributes.startNumber);
            let basePath = mpd.BaseURL._text;
            initUrl = url.resolve(_url , basePath + initPath);
            mediaUrl = url.resolve(_url , basePath + mediaPath);
            download(initUrl).then((data)=>{
                fs.writeFile('dist/' + id + '.mp4', data, (err)=>{
                    if(err){
                        console.log('[download init]:'+err);
                    }
                    download(mediaUrl).then((data)=>{
                        fs.appendFile('dist/' + id + '.mp4', data, (err)=>{
                            if(err){
                                console.log('[download media]:'+err);
                            }
                            callback('dist/' + id +'.mp4');
                        })
                    })
                })
            });
        }else if(representation.hasOwnProperty('SegmentList'))
        {
            let initPath = representation.SegmentList.Initialization._attributes.sourceURL;
            initUrl = url.resolve(_url, initPath);
            let mediaPath = representation.SegmentList.SegmentURL[0]._attributes.media;
            console.log(representation.SegmentList.SegmentURL[0]._attributes)
            console.log(mediaPath)
            mediaUrl = url.resolve(_url, mediaPath);
            console.log(representation)
            console.log(initUrl);
            console.log(mediaUrl);
            download(initUrl).then((data)=>{
                fs.writeFile('dist/' + id + '.mp4', data, (err)=>{
                    if(err){
                        console.log('[download init]:'+err);
                    }
                    download(mediaUrl).then((data)=>{
                        fs.appendFile('dist/' + id + '.mp4', data, (err)=>{
                            if(err){
                                console.log('[download media]:'+err);
                            }
                            callback('dist/' + id +'.mp4');
                        })
                    })
                })
            });
        }
        else
        {
            mediaUrl = url.resolve(_url, representation.BaseURL._text);
            console.log(mediaUrl);
            download(mediaUrl).then((data)=>{
                console.log('[download mpd video] data');
                fs.writeFile('dist/' + id + '.mp4', data, (err)=>{
                    if(err){
                        console.log('[download init]:'+err);
                    }
                    console.log('[download mpd video] OK');
                    callback('dist/' + id +'.mp4');
                })
            });
        }
    });
}

var dashOperator = {
    getVideoByMPD:getVideoByMPD
};
module.exports = dashOperator;
