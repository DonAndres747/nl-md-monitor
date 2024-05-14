const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  id: String,
  usr_id: String,
  password: String,
  connectionurl: String,
  dbname: String,
  name: String,
});

module.exports = mongoose.model("Credentials", clientSchema);
