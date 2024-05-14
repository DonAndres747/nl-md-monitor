const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  id: String,
  url: Object,
  login: String,
  tenantId: String,
  service: String,
});

module.exports = mongoose.model("Connection", connectionSchema);
