var MongoClient = require("mongodb").MongoClient;

function _connectDB(callback) {
    var url = 'mongodb://localhost:27017/dashserver';
    MongoClient.connect(url, function (err, db) {
        callback(err, db);
    })
}

exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, db) {
            callback(err, db);
        })
    })
};