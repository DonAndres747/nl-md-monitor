const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const unrar = require("node-unrar-js");
const rimraf = require("rimraf");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/modificar-archivo", (req, res) => {
  const { ruta, newContent, solNum } = req.body;

  if (!fs.existsSync(ruta)) {
    return res
      .status(404)
      .json({ success: false, message: "El archivo no existe" });
  }

  fs.readFile(ruta, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al leer el archivo" });
    }
    let lineas = data.split("\n");
    lineas[solNum] = newContent;
    let nuevoContenido = lineas.join("\n");
    fs.writeFile(ruta, nuevoContenido, (err) => {
      if (err) {
        console.error("Error al escribir en el archivo:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error al escribir en el archivo" });
      }
      res
        .status(200)
        .json({ success: true, message: "Archivo modificado correctamente" });
    });
  });
});

app.post("/archivo-war", (req, res) => {
  const { filePath, newContent, contentLine } = req.body;
  const rarFilePath = filePath.replace(".war", ".rar");
  fs.renameSync(filePath, rarFilePath);

  modificarArchivoEnRAR(rarFilePath, newContent, contentLine);
});

async function modificarArchivoEnRAR(rarFilePath, newContent, contentLine) {
  try {
    const directorio = "temp";
    const buf = Uint8Array.from(fs.readFileSync(rarFilePath)).buffer;
    const extractor = await unrar.createExtractorFromData({ data: buf });
    const extracted = extractor.extract();

    const files = [...extracted.files];

    if (!fs.existsSync(directorio)) {
      fs.mkdirSync(directorio);
    }

    const promises = files.map(async (file) => {
      try {
        const intento = Buffer.from(file.extraction.buffer);
        let cadena = file.fileHeader.name;
        let indiceUltimaBarra = cadena.lastIndexOf("/");
        let nuevaCadena = cadena.substring(0, indiceUltimaBarra + 1);
        fs.mkdirSync("temp/" + nuevaCadena, { recursive: true });
        fs.writeFileSync("temp/" + file.fileHeader.name, intento, "utf8");
      } catch (error) {}
    });

    Promise.all(promises)
      .then(() => {
        fs.readFile("temp/prueba.txt", "utf8", (err, data) => {
          if (err) {
            console.error("Error al leer el archivo:", err);
          }
          let lineas = data.split("\n");
          lineas[contentLine] = newContent;
          let nuevoContenido = lineas.join("\n");
          fs.writeFile("temp/prueba.txt", nuevoContenido, (err) => {
            if (err) {
              console.error("Error al escribir en el archivo:", err);
            } else {
              // const comando = '"C:\\Program Files\\WinRAR\\WinRAR.exe" a -r -ep1 prueba.rar temp/*'; -> comando para no tener winrar en el server

              const comando = "winrar a -r -ep1 prueba.rar temp/*";

              exec(comando, (error, stdout, stderr) => {
                if (error) {
                  console.error(
                    `Error al comprimir la carpeta: ${error.message}`
                  );
                  return;
                }
                if (stderr) {
                  console.error(`Error de WinRAR: ${stderr}`);
                  return;
                }
                rimraf.sync(directorio);
                console.log(`Carpeta comprimida exitosamente: ${stdout}`);

                const filePath = rarFilePath.replace(".rar", ".war");
                fs.renameSync(rarFilePath, filePath);
                console.log(
                  "El archivo dentro del RAR ha sido modificado exitosamente."
                );
              });
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error al modificar archivos:", error);
      });
  } catch (error) {
    const filePath = rarFilePath.replace(".rar", ".war");
    fs.renameSync(rarFilePath, filePath);
    console.error("Error al modificar el archivo dentro del RAR:", error);
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
