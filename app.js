var express = require("express");
var app = express();

// 引入json解析中间件
var bodyParser = require('body-parser');
// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
   res.render('index');
});

app.get('/player', function (req, res) {
   res.render('player');
});

app.get('/abr-test', function (req, res) {
   res.render('abr-test');
});

app.get('/post-test', function (req, res) {
    res.render('post-test');
});

var pythonUtils = require('./utils/run_python');

app.post('/ab', function (req, res) {
   console.log(req.body);
    pythonUtils.pythongo('./public/python/abrwheel.py', req.body.data, function (error,stdout,stderr) {
       res.send(stdout);
    });
});


app.listen(3000);