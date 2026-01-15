import { io } from "socket.io-client";

let socket = null;

export async function conectarSocket() {
  if (socket) return socket;

  socket = io("https://tec-shop-production.up.railway.app", {
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}
