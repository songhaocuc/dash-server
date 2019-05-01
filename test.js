var mo = require('./utils/utils.media-operator');
var db = require('./model/db')
var fs = require('fs')
var path = require('path')
var config = require('./config/config')
// mo.videoInfo('01.mp4', function (stdout) {
//     console.log(1)
//     console.log(stdout)
// })
//
// db.findVideoByType('vod', function (err, docs) {
//     console.log(err)
//     console.log(docs)
// })

// mo.getVideoThumbnail('01.mp4', '123')
// rmdir('./public/media/vod/av2019010808756', function (error) {
//     if(error)
//         console.log(error);
//     console.log(1)
// })

function rmdir (dir, callback) {
    fs.readdir(dir, (err, files) => {
        /**
         * @desc 内部循环遍历使用的工具函数
         * @param {Number} index 表示读取files的下标
         */
        function next(index) {
            // 如果index 等于当前files的时候说明循环遍历已经完毕，可以删除dir，并且调用callback
            if (index == files.length) return fs.rmdir(dir, callback)
            // 如果文件还没有遍历结束的话，继续拼接新路径，使用fs.stat读取该路径
            let newPath = path.join(dir, files[index])
            // 读取文件，判断是文件还是文件目录

            fs.stat(newPath, (err, stat) => {
                if (stat.isDirectory() ) {
                    // 因为我们这里是深度循环，也就是说遍历玩files[index]的目录以后，才会去遍历files[index+1]
                    // 所以在这里直接继续调用rmdir，然后把循环下一个文件的调用放在当前调用的callback中
                    rmdir(newPath, () => next(index+1))
                } else {
                    // 如果是文件，则直接删除该文件，然后在回调函数中调用遍历nextf方法，并且index+1传进去
                    fs.unlink(newPath, () => next(index+1))
                }
            })
        }
        next(0)
    })
}

// db.findVideoById('av2019010842633',function (err, doc) {
//     console.log(doc)
// })

// config.updateConfigWith((config)=>{
//     console.log(config);
// })

var dor = require('./utils/dash-operator');

// dor.getMpd2();
const mediaOperator = require('./utils/utils.media-operator');

let _url = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
let _url3 = 'http://wowzaec2demo.streamlock.net/live/bigbuckbunny/manifest_mvlist.mpd'
let _url2 = 'https://dash.akamaized.net/dash264/TestCases/1a/sony/SNE_DASH_SD_CASE1A_REVISED.mpd'
mediaOperator.getThumbnailByMPD(_url2, '22234');