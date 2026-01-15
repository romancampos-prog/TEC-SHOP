// ================== IMPORTS ==================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");

// ================== APP ==================
const app = express();

// ================== CORS ==================
app.use(
  cors({
    origin: "*", // 🔥 para evitar problemas en producción
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== SERVER + SOCKET ==================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ================== FIREBASE ADMIN ==================
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  ),
});

// ================== MYSQL ==================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error MySQL:", err.message);
  } else {
    console.log("✅ MySQL conectado");
  }
});

// ================== SOCKET LOGIC ==================
io.on("connection", (socket) => {
  console.log("🟢 Socket conectado:", socket.id);

  socket.on("join_chat", (id_chat) => {
    socket.join(id_chat);
  });

  socket.on("leave_chat", (id_chat) => {
    socket.leave(id_chat);
  });

  socket.on("send_message", (data) => {
    const { id_chat, id_emisor, contenido } = data;

    const q =
      "INSERT INTO mensajes (id_chat, id_emisor, contenido) VALUES (?, ?, ?)";

    db.query(q, [id_chat, id_emisor, contenido], (err, result) => {
      if (err) return console.error(err);

      io.to(id_chat).emit("receive_message", {
        id_mensaje: result.insertId,
        id_chat,
        id_emisor,
        contenido,
        fecha_envio: new Date(),
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket desconectado");
  });
});

// ================== MIDDLEWARE AUTH ==================
async function verificarToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });

  try {
    const token = auth.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
}

// ================== CHAT ==================
app.post("/chat/crear-o-obtener", verificarToken, (req, res) => {
  const { id_producto } = req.body;
  const id_comprador = req.uid;

  const qProducto =
    "SELECT id_vendedor FROM productos WHERE id_producto = ?";

  db.query(qProducto, [id_producto], (err, prod) => {
    if (err || prod.length === 0)
      return res.status(404).json({ error: "Producto no existe" });

    const id_vendedor = prod[0].id_vendedor;

    const qChat = `
      SELECT id_chat FROM chats
      WHERE id_producto=? AND id_comprador=? AND id_vendedor=?
      LIMIT 1
    `;

    db.query(
      qChat,
      [id_producto, id_comprador, id_vendedor],
      (err, chat) => {
        if (chat.length > 0)
          return res.json({ id_chat: chat[0].id_chat });

        const qCrear =
          "INSERT INTO chats (id_comprador,id_vendedor,id_producto) VALUES (?,?,?)";

        db.query(
          qCrear,
          [id_comprador, id_vendedor, id_producto],
          (err, result) => {
            res.json({ id_chat: result.insertId });
          }
        );
      }
    );
  });
});

app.get("/chat/mensajes/:idChat", verificarToken, (req, res) => {
  const q =
    "SELECT * FROM mensajes WHERE id_chat=? ORDER BY fecha_envio ASC";
  db.query(q, [req.params.idChat], (err, rows) => res.json(rows));
});

// ================== USUARIOS ==================
app.post("/usuarios", verificarToken, (req, res) => {
  const { usuario, correo } = req.body;

  const q =
    "INSERT INTO usuarios (id_usuario,nombre_completo,correo_institucional) VALUES (?,?,?)";

  db.query(q, [req.uid, usuario, correo], () =>
    res.json({ ok: true })
  );
});

app.get("/usuarios", verificarToken, (req, res) => {
  const q = "SELECT nombre_completo FROM usuarios WHERE id_usuario=?";
  db.query(q, [req.uid], (err, r) =>
    res.json({ nombre: r[0]?.nombre_completo })
  );
});

// ================== PRODUCTOS ==================
app.get("/productos", verificarToken, (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  const busqueda = req.query.q ? `%${req.query.q}%` : null;

  let where = `WHERE estado="Disponible" AND id_vendedor != ?`;
  let params = [req.uid];

  if (busqueda) {
    where += " AND (nombre LIKE ? OR descripcion LIKE ?)";
    params.push(busqueda, busqueda);
  }

  const qTotal = `SELECT COUNT(*) total FROM productos ${where}`;
  const qProd = `
    SELECT * FROM productos ${where}
    ORDER BY fecha_publicacion DESC
    LIMIT ? OFFSET ?
  `;

  db.query(qTotal, params, (e, t) => {
    db.query(qProd, [...params, limit, offset], (e, p) =>
      res.json({ productos: p, total: t[0].total })
    );
  });
});

// ================== SERVER START ==================
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
