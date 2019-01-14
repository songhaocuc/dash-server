var create = require('./create');
var upload = require('./upload');
var data = require('./data');
var config = require('./config');
var router = {
    create : create,
    upload : upload,
    data :data,
    config: config
};

module.exports = router;