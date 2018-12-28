var exec = require('child_process').exec;

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

module.exports.pythongo = pythongo;