var config = require('./dbConfig.json');
// const MongoClient = require('mongodb').MongoClient;
function connect(){
    let db_url = config["DB_URL"];

    var mongoose = require('mongoose');
    mongoose.connect(db_url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("数据库连接成功");
    });
  
}

// exports.MongoClient = MongoClient;
exports.connect = connect;

