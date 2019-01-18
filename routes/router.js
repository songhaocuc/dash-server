var create = require('./create');
var upload = require('./upload');
var data = require('./data');
var config = require('./config');
var change = require('./change');
var router = {
    create : create,
    upload : upload,
    data :data,
    config: config,
    change: change
};

module.exports = router;