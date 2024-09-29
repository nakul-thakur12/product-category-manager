const db = require('./dbConfig');
class AdminDao
{
  checkAdmin = function()
  {
    console.log("DataBase Object is : "+JSON.stringify(db));
  }
}

module.exports = new AdminDao();