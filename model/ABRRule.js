var mongoose = require('mongoose');

var abrRuleSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    createTime: Date,
});
abrRuleSchema.statics.findRuleById = function (id, callback) {
    return this.findOne({id : id}, callback);
};
var abrRuleModel = mongoose.model('ABRRule', abrRuleSchema);
module.exports = abrRuleModel;