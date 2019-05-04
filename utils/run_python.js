var exec = require('child_process').exec;
var fs = require('fs');
var unzip = require('unzip');

function pythongo(file, params, callback) {
    console.log('[pythongo]' + params);
    exec('python ' + file + ' ' + JSON.stringify(params),function(error,stdout,stderr){
        if(stdout.length >1){
            console.log('you offer args:',stdout);
        } else {
            console.log('you don\'t offer args');
        }
        if(error) {
            console.info('stderr : '+stderr);
        }
        callback(error, stdout, stderr);
    });
}

function unzipAbrRule(filename, id){
    fs.mkdir('./public/python/'+id, function (err) {
        if(err){
            console.log(err);
        }
        fs.createReadStream('./upload/'+filename).pipe(unzip.Extract({ path: './public/python/'+id }));
    })
}

function runAbrRule(id, params, callback) {
    // console.log('[pythongo]' + params);
    exec('python ' + './public/python/'+id+'/run.py' + ' ' + JSON.stringify(params),function(error,stdout,stderr){
        // if(stdout.length >1){
        //     console.log('you offer args:',stdout);
        // } else {
        //     console.log('you don\'t offer args');
        // }
        // console.log('[python err]'+ error);
        // console.log('[python out]'+stdout);
        if(error) {
            console.info('stderr : '+stderr);
        }
        callback(error, stdout, stderr);
    });
}

var pyutil = {
    pythongo:pythongo,
    unzipAbrRule:unzipAbrRule,
    runAbrRule:runAbrRule
};
module.exports = pyutil;