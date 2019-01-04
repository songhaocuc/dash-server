var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('create/create', {
        label: 'create',
        type: 'live'
    });
});

router.get('/:type', function (req, res) {
    res.render('create/create', {
        label: 'create',
        type: req.params.type
    });
});

router.post('/:type', function (req, res) {
    console.log(req.body);
    //todo
    res.send('success');
});


module.exports = router;