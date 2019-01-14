var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dashserver',
    {useNewUrlParser:true});

var video = require('./Video');
var abrRule = require('./ABRRule');

var db;

/////////////////////
// video
/////////////////////
//callback(err, count)
function countVideoByType(type, callback) {
    video.countByType(type, callback);
}
//callback(err, docs)
function findVideoByType(type, callback){
    video.findByType(type, callback);
}
//callback(err, docs)
function findVideoByTypeWithScope(options, callback){
    video.findByTypeWithScope(options, callback);
}
//callback(err, doc)
function findVideoById(id, callback){
    video.findByVideoId(id, callback);
}
//callback(err, object)
function createNewVideo(object, callback){
    video.create(object, callback);
}
//callback(err, doc)
function updateVideoById(id, update, callback){
    video.updateOne({id: id}, update, callback);
}
//callback(err)
function deleteVideoById(id, callback){
    video.deleteOne({id: id}, callback);
}

///////////////////////
// abr rules
////////////////////////
function findRuleById(id, callback){
    abrRule.findRuleById(id, callback);
}

function createNewRule(object, callback){
    abrRule.create(object, callback);
}

function deleteRuleById(id, callback){
    abrRule.deleteOne({id: id}, callback);
}

function findAllRules(callback){
    abrRule.findAllRules(callback);
}
///////////////////////
// settings
///////////////////////

// db API
db = {
    countVideoByType: countVideoByType,
    findVideoByType: findVideoByType,
    findVideoByTypeWithScope: findVideoByTypeWithScope,
    findVideoById: findVideoById,
    createNewVideo: createNewVideo,
    updateVideoById: updateVideoById,
    deleteVideoById: deleteVideoById,
    findRuleById:findRuleById,
    createNewRule:createNewRule,
    deleteRuleById:deleteRuleById,
    findAllRules:findAllRules
};

module.exports = db;