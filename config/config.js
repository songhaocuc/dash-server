var fs = require('fs');

function updateConfigWith(operator){
    //现将json文件读出来
    fs.readFile('./config/config.json',function(err,data){
        if(err){
            return console.error(err);
        }
        var config = data.toString();//将二进制的数据转换为字符串
        config = JSON.parse(config);//将字符串转换为json对象
        operator(config);
        console.log('[config: ]'+config);
        var str = JSON.stringify(config);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        console.log('[config str:] '+str);
        fs.writeFile('./config/config.json',str,function(err){
            if(err){
                console.error(err);
            }
        })
    })
}
function getConfig(callback) {
    updateConfigWith(callback);
}

function updateConfig(options) {
    updateConfigWith((config)=>{
        if(options.hasOwnProperty('abrId')){
            config.abrId = options.abrId;
        }
    })
}

var config = {
    updateConfigWith: updateConfigWith,
    getConfig: getConfig,
    updateConfig: updateConfig
};

module.exports = config;

