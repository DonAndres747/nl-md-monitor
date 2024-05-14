const properties = require("../properties.json");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const clientsModel = require("./models/clientModel");

app.post("/api/login", async (req, res) => {
  const { usr_id, password } = req.body;

  await mongoose.disconnect();

  await mongoose.connect(
    `mongodb://${properties.database.host}:${properties.database.port}/${properties.database.dbName}`
  );

  try {
    const client = await clientsModel.findOne({ usr_id });
    if (!client) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // const validatePass = await bcrypt.compare(password, client.password);

    const validatePass = password === client.password;
    if (!validatePass) {
      await mongoose.disconnect();
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.status(200).json({
      clientId: client.id,
      user: client.usr_id,
      dbName: client.dbname,
      connectionUrl: client.connectionurl,
      userName: client.name,
    });

    await mongoose.disconnect();
  } catch (error) {
    await mongoose.disconnect();
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const transactionSchema = new mongoose.Schema({
  id: String,
  sequence: String,
  interface: String,
  fromJson: String,
  toJson: Object,
  status: String,
  recordDate: String,
  fromHost: String,
  toHost: String,
  message: String,
});

app.post("/db/in", async (req, res) => {
  const { dbName, sol } = req.body;

  await mongoose.disconnect();
  await mongoose
    .connect(
      `mongodb://${properties.database.host}:${properties.database.port}/${dbName}`
    )
    .then(async () => {
      const transactionModel = mongoose.model(sol, transactionSchema, sol);

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
        result.reverse();
        res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
      }
    });
});

const connectionModel = require("./models/connectionModel");

app.post("/db/connections", async (req, res) => {
  const { dbName, connectionId } = req.body;

  await mongoose.disconnect();

  await mongoose
    .connect(
      `mongodb://${properties.database.host}:${properties.database.port}/${dbName}`
    )
    .then(async () => {
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
});

app.put("/db/updateConnections", async (req, res) => {
  const { solId, urls, serviceVal } = req.body;

  updatedFields = {};

  if (urls) {
    updatedFields.url = { ...urls };
  }

  if (serviceVal && solId != "tep") {
    updatedFields.service = serviceVal;
  } else if (serviceVal) {
    updatedFields.login = serviceVal;
  }

  console.log(updatedFields, solId);

  try {
    const result = await connectionModel.updateOne(
      { id: solId },
      { $set: { ...updatedFields } }
    );

    if (!result.acknowledged) {
      return res.status(404).json({ message: "No data found" });
    } else if (result.modifiedCount <= 0) {
      return res.status(200).json({ message: "No rows afected" });
    }

    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post("/db/connectionsAll", async (req, res) => {
  const { dbName } = req.body;

  await mongoose.disconnect().then(async () => {
    await mongoose
      .connect(
        `mongodb://${properties.database.host}:${properties.database.port}/${dbName}`
      )
      .then(async () => {
        delete mongoose.connection.models["connections"];

        try {
          const connections = await connectionModel.find();
          if (!connections) {
            return res.status(404).json({ message: "No data found" });
          }

          enableConn = connections.map((conn) => {
            return {
              id: conn.id,
              service: conn.id == "tep" ? conn.login : conn.service,
            };
          });

          res.status(200).json(enableConn);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error interno del servidor" });
        }
      });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
