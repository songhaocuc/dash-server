var mongoose = require('mongoose');

var abrRuleSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    createTime: Date,
    description: String
});
abrRuleSchema.statics.findRuleById = function (id, callback) {
    return this.findOne({id : id}, callback);
};
// err docs
abrRuleSchema.statics.findAllRules = function (callback) {
    return this.find({}, callback);
};
var abrRuleModel = mongoose.model('ABRRule', abrRuleSchema);
module.exports = abrRuleModel;