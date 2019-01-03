var mongoose = require('mongoose');

var abrRuleSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    createTime: Date,
});

var abrRuleModel = mongoose.model('ABRRule', videoSchema);
module.exports = abrRuleModel;