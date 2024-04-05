const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

app.post("/modificar-archivo", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const { ruta, newContent, solNum } = JSON.parse(body);

    if (!fs.existsSync(ruta)) {
      res.status(404).json({ success: false, message: "El archivo no existe" });
      return;
    }

    fs.readFile(ruta, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        res
          .status(500)
          .json({ success: false, message: "Error al leer el archivo" });
        return;
      }
      let lineas = data.split("\n");
      lineas[solNum] = newContent;
      let nuevoContenido = lineas.join("\n");
      fs.writeFile(ruta, nuevoContenido, (err) => {
        if (err) {
          console.error("Error al escribir en el archivo:", err);
          res.status(500).json({
            success: false,
            message: "Error al escribir en el archivo",
          });
          return;
        }
        res
          .status(200)
          .json({ success: true, message: "Archivo modificado correctamente" });
      });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
