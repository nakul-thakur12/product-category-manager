const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
const db = mongoose.connection;

db.on('connected', function() {
    console.log('database is connected successfully');
});

module.exports = db;