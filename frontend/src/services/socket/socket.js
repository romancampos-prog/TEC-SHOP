import { io } from "socket.io-client";

let socket = null;

export async function conectarSocket() {
  if (socket) return socket;

  socket = io("http://3.84.71.71:3001", {
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}
