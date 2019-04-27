var express = require("express");
var app = express();
var router = require('./routes/router');

const liveServer = require('./utils/live-server');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// // 引入json解析中间件
// var bodyParser = require('body-parser');
// // 添加json解析
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public', {
    setHeaders: function (res, path ,stat) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
}));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
   res.render('index',{label:"home"});
});

app.get('/vod', function (req, res) {
   res.render('vod',{label:"vod"});
});

app.get('/live', function (req, res) {
    res.render('live', {label: "live"});
});

app.get('/cloud', function (req, res) {
    res.render('cloud', {label: "cloud"});
});

app.get('/abr-rules', function (req, res) {
    res.render('abr-rules', {
        label: "abrrules"
    });
});

app.use('/data', router.data);
app.use('/create', router.create);
app.use('/config', router.config);

var db = require('./model/db');

app.get('/player/test', function (req, res) {
   res.render('player-test', {
       label: ''
   }) ;
});
var config = require('./config/config');
app.get('/player/:id', function (req, res) {
    let id = req.params.id;
    console.log("[Debug]  "+ id);
    db.findVideoById(id , function (err, doc) {
        console.log("[Debug]  "+ doc);
        config.getConfig((config)=>{
            res.render('player', {
                label: doc.type,
                id: doc.id,
                abrId: config.abrId,
                name: doc.name,
                type: doc.type,
                createTime: doc.createTime,
                url: doc.url,
                description: doc.description
            });
        });
    });

});



var pythonUtils = require('./utils/run_python');

app.post('/abr', function (req, res) {
   console.log(req.body);
    // pythonUtils.pythongo('./public/python/abrwheel.py', req.body.data, function (error,stdout,stderr) {
    //    res.send(stdout);
    // });
    pythonUtils.runAbrRule(req.body.ABRId, req.body.data, function (error,stdout,stderr) {
       console.log('[python out] ' + stdout);
        res.send(stdout);
    })
});
app.use('/upload', router.upload);

app.use('/change', router.change);

app.get('/about', function (req, res) {
    res.render('about', {
        label: 'about'
    });
});

app.get('/settings', function (req, res) {
    res.render('settings', {
        label: 'settings'
    });
});

// app.get('/dashplayer', function (req, res) {
//     res.render('dashplayer',{
//         label: '0',
//         id: '0',
//         abrId: '0',
//         name: '0',
//         type: '0',
//         createTime: '0',
//         url: '0'
//     });
// });


app.listen(3000);
console.log("[APP]HTTP服务器开始侦听");
liveServer.run();
console.log("[APP]流媒体服务器启动");