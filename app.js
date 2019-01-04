var express = require("express");
var app = express();
var router = require('./routes/router');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// // 引入json解析中间件
// var bodyParser = require('body-parser');
// // 添加json解析
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    console.log('get /');
   res.render('index',{label:"home"});
});

app.get('/vod', function (req, res) {
   res.render('videos',{label:"vod"});
});

app.use('/create', router.create);

// app.get('/player', function (req, res) {
//    res.render('player');
// });
//
// app.get('/abr-test/:rule', function (req, res) {
//    res.render('abr-test',{
//        rule : req.params.rule
//    });
// });


// var pythonUtils = require('./utils/run_python');

// app.post('/ab', function (req, res) {
//    console.log(req.body);
//     pythonUtils.pythongo('./public/python/abrwheel.py', req.body.data, function (error,stdout,stderr) {
//        res.send(stdout);
//     });
// });
app.use('/upload', router.upload);


app.listen(3000);