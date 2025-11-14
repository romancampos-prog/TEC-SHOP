// Importamos dependencias necesarias
import express from "express";
import dotenv from "dotenv";
import { db } from "./src/config/db.js"; // tu conexión a Clever Cloud

// Carga las variables de entorno (.env)
dotenv.config();

// Crea una instancia de Express
const app = express();

// Permite que el servidor interprete JSON en las peticiones
app.use(express.json());

// 🧪 Ruta de prueba para verificar la conexión con la base de datos
app.get("/test-db", (req, res) => {
  db.query("SELECT NOW() AS fecha_actual", (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      res.status(500).json({ error: "Error en la base de datos" });
    } else {
      res.json({
        mensaje: "Conexión exitosa 🎉",
        resultado: results,
      });
    }
  });
});

// 📦 Ruta raíz para confirmar que el backend está vivo
app.get("/", (req, res) => {
  res.send("🚀 Backend Campus Market ITL está en ejecución correctamente.");
});

// Arranca el servidor en el puerto definido en el .env (ej: 3000)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
