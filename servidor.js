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
  usr_id: String,
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

const connectionSchemaWMS = new mongoose.Schema({
  id: String,
  tep: String,
  sap: String,
  service: String,
});

const connectionSchemaSAP = new mongoose.Schema({
  id: String,
  tep: String,
  wms: String,
  service: String,
});

app.post("/db/connections", async (req, res) => {
  const { dbName, connectionId } = req.body;

  await mongoose.disconnect();
  await mongoose
    .connect(
      `mongodb://${properties.database.host}:${properties.database.port}/${dbName}`
    )
    .then(async () => {
      if (mongoose.connection.models["connections"]) {
        delete mongoose.connection.models["connections"];
      }

      const connectionModel = mongoose.model(
        "connections",
        connectionId == "wms" ? connectionSchemaWMS : connectionSchemaSAP,
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
});

const connectionSchemaAll = new mongoose.Schema({
  id: String,
  service: String,
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
        const connectionModel = mongoose.model(
          "connections",
          connectionSchemaAll,
          "connections"
        );

        try {
          const connections = await connectionModel.find();
          if (!connections) {
            return res.status(404).json({ message: "No data found" });
          }

          enableConn = connections.map((conn) => {
            return { id: conn.id, service: conn.service };
          });

          res.status(200).json(enableConn);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error interno del servidor" });
        }
      });
  });
});

app.put("/db/updateConnections", async (req, res) => {
  const { solId, field1, field2, serviceVal, field1Val, field2Val } = req.body;

  updatedFields = {};

  if (field1Val) {
    updatedFields[field1] = field1Val;
  }
  if (field2Val) {
    updatedFields[field2] = field2Val;
  }
  if (serviceVal) {
    updatedFields.service = serviceVal;
  }

  const connectionModel = mongoose.model(
    "connections",
    solId == "wms" ? connectionSchemaWMS : connectionSchemaSAP,
    "connections"
  );

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
