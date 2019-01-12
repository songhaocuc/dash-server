var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    createTime: Date,
    bitrateList: Array,
    url: String,
    duration: String,
    liveon: Boolean
});

videoSchema.statics.countByType = function (type, callback) {
    return this.countDocuments({type: type}, callback);
};

videoSchema.statics.findByType = function (type, callback) {
    return this.find({type : type}, callback);
};

videoSchema.statics.findByVideoId = function (id, callback) {
    return this.findOne({id : id}, callback);
};

//callback (err, docs)
videoSchema.statics.findByTypeWithScope = function (options, callback) {
    let type = options.type || "cloud";
    let begin = options.begin || 0;
    let number = options.number || 20;
    return this.find({type: type}, null, {skip: begin, limit: number}, callback);
};

var videoModel = mongoose.model('Video', videoSchema);
// console.log(videoModel);
module.exports = videoModel;