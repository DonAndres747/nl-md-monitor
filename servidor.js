const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const unrar = require("node-unrar-js");
const rimraf = require("rimraf");
const { exec } = require("child_process");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer();
app.post("/update-prop", upload.single("warData"), async (req, res) => {
  const { newContent, contentLine } = req.body;
  const warData = req.file.buffer;

  const warFilePath = "temp.war";
  fs.writeFileSync(warFilePath, Buffer.from(warData, "base64"));

  const rarFilePath = warFilePath.replace(".war", ".rar");
  fs.renameSync(warFilePath, rarFilePath);

  try {
    const result = await updateWar(rarFilePath, newContent, contentLine);
    console.log(result);

    const warFilePath = rarFilePath.replace(".rar", ".war");
    fs.renameSync(rarFilePath, warFilePath);

    const modifiedWarData = fs.readFileSync(warFilePath);

    res.status(result.status).json({
      message: result.message,
      success: result.success,
      modifiedWarData:
        result.status == 200 ? modifiedWarData.toString("base64") : null,
    });
  } catch (error) {
    console.log(error);
    if (fs.existsSync(rarFilePath)) {
      fs.renameSync(rarFilePath, rarFilePath.replace(".rar", ".war"));
    }

    res.status(500).json({
      message: "Error interno del servidor",
      success: false,
    });
  } finally {
    if (fs.existsSync(warFilePath)) {
      fs.unlinkSync(warFilePath);
    }
    if (fs.existsSync(rarFilePath)) {
      fs.unlinkSync(rarFilePath);
    }
    if (fs.existsSync(rarFilePath)) {
      fs.unlinkSync(rarFilePath);
    }
  }
});

async function updateWar(rarFilePath, newContent, contentLine) {
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
    } catch (error) {
      return {
        status: 500,
        message: "error al leer el archivo",
        success: false,
      };
    }
  });

  Promise.all(promises);

  return new Promise((resolve, reject) => {
    fs.readFile("temp/prueba.txt", "utf8", (err, data) => {
      let lineas = data.split("\n");
      lineas[contentLine] = newContent;
      let nuevoContenido = lineas.join("\n");
      fs.writeFile("temp/prueba.txt", nuevoContenido, (err, data) => {
        if (err) {
          rimraf.sync(directorio);
          fs.renameSync(rarFilePath, rarFilePath.replace(".rar", ".war"));
          reject({
            status: 500,
            message: `Error al leer la carpeta: ${error.message}`,
            success: false,
          });
        }
        // const comando = '"C:\\Program Files\\WinRAR\\WinRAR.exe" a -r -ep1 prueba.rar temp/*'; -> comando para no tener winrar en el server

        const comando = "winrar a -r -ep1 temp2.rar temp/*";

        exec(comando, (error, stdout, stderr) => {
          if (error) {
            rimraf.sync(directorio);
            console.log(
              "ERRORHP___________________________________________________________________________________________"
            );
            console.log(error);
            fs.renameSync(rarFilePath, rarFilePath.replace(".rar", ".war"));
            reject({
              status: 500,
              message: `Error al comprimir la carpeta: ${error.message}`,
              success: false,
            });
          }
          if (stderr) {
            rimraf.sync(directorio);
            console.log(
              "ERRORHP2___________________________________________________________________________________________"
            );
            console.log(stderr);
            fs.renameSync(rarFilePath, rarFilePath.replace(".rar", ".war"));
            reject({
              status: 500,
              message: `Error de procesamiento: ${stderr}`,
              success: false,
            });
          }

          fs.renameSync("temp2.rar", "temp.rar");

          rimraf.sync(directorio);
          resolve({
            status: 200,
            message: "Datos actualizados correctamente",
            success: true,
          });
        });
      });
    });
  });
}
app.post("/get-war", (req, res) => {
  leerArchivo();

  const { filePath } = req.body;
  console.log(filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404);
      res.end("Archivo no encontrado");
      return;
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// async function leerArchivo() {
//   try {
//     // Solicitar al usuario que seleccione un archivo
//     const [handle] = await window.showOpenFilePicker();
//     const file = await handle.getFile();

//     // Leer el contenido del archivo como texto
//     const contenido = await file.text();

//     // Hacer algo con el contenido del archivo
//     console.log(contenido);
//   } catch (error) {
//     console.error("Error al leer el archivo:", error);
//   }
// }

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
