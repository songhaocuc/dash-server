var create = require('./create');
var upload = require('./upload');
var data = require('./data');
var router = {
    create : create,
    upload : upload,
    data :data
};

module.exports = router;