const properties = require("./properties.json");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

const clientsModel = mongoose.model("credentials", {
  id: String,
  user: String,
  password: String,
  connectionurl: String,
  dbname: String,
  name: String,
});

app.post("/api/login", async (req, res) => {
  const { usr_id, password } = req.body;

  await mongoose.disconnect();

  await mongoose.connect(
    `mongodb://${properties.database.host}:${properties.database.port}/${properties.database.dbName}`
  );

  try {
    const client = await clientsModel.findOne({ user: usr_id });
    if (!client) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // const validatePass = await bcrypt.compare(password, client.password);

    const validatePass = password === client.password;
    if (!validatePass) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.status(200).json({
      clientId: client.id,
      user: client.user,
      dbName: client.dbname,
      connectionUrl: client.connectionurl,
      userName: client.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const transactionSchema = new mongoose.Schema({
  id: String,
  sequence: String,
  interface: String,
  fromJson: String,
  toJson: String,
  status: String,
  recordDate: String,
  fromHost: String,
  toHost: String,
  message: String,
});

app.post("/db/wms_in", async (req, res) => {
  const { dbName } = req.body;

  await mongoose.disconnect();
  await mongoose.connect(
    `mongodb://${properties.database.host}:${properties.database.port}/${dbName}`
  );

  const transactionModel = mongoose.model(
    "wms_in",
    transactionSchema,
    "wms_in"
  );

  try {
    const transactions = await transactionModel.find();
    if (!transactions) {
      return res.status(404).json({ message: "No data found" });
    }

    const result = [];

    transactions.forEach((transaction) => {
      result.push({
        id: transaction.id,
        sequence: transaction.sequence,
        interface: transaction.interface,
        fromJson: transaction.fromJson,
        toJson: transaction.toJson,
        status: transaction.status,
        recordDate: transaction.recordDate,
        fromHost: transaction.fromHost,
        toHost: transaction.toHost,
        message: transaction.message,
      });
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const connectionSchema = new mongoose.Schema({
  id: String,
  tep: String,
  sap: String,
  login: String,
});

app.post("/db/connections", async (req, res) => {
  const { dbName, connectionId } = req.body;

  if (mongoose.connection.name != dbName) {
    await mongoose.disconnect();
    await mongoose.connect(
      `mongodb://${properties.database.host}:${properties.database.port}/${dbName}`
    );
  }

  const connectionModel = mongoose.model(
    "connections",
    connectionSchema,
    "connections"
  );

  try {
    const connections = await connectionModel.find({ id: connectionId });
    if (!connections) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json(connections[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
