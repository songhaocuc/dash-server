var express = require('express');
var router = express.Router();
var config = require('../config/config');

router.get('/current', function (req, res) {
    config.getConfig((config)=>{
        res.send(config);
    });
});

router.post('/update', function (req, res) {
    let option = {
        abrId: req.body.abrId
    };
    config.updateConfig(option);
    res.send('1');
});

module.exports = router;