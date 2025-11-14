import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config(); // lee el archivo .env para usar las variables para la bd


export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err.message);
  } else {
    console.log("✅ Conectado correctamente a la base de datos de Clever Cloud");
  }
});