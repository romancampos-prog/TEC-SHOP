import express from "express";
import healthRoutes from "./routes/healt-route/healt-route.js"

const app = express();

app.use(express.json());

// Rutas
app.use("/", healthRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
