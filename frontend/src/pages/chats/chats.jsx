import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { conectarSocket } from "../../services/socket/socket";
import { obtenerConversaciones } from "../../services/socket/chat/obtenerConversaciones";
import { obtenerMensajes } from "../../services/socket/chat/obtenerMensajes";
import { obtenerUidActual } from "../../services/firebase/autenticacion/obtenerUIDActual";
import "./chats.css";

/* =======================
   Helpers (NO TOCAR)
======================= */
function obtenerHora(fecha) {
  return new Date(fecha).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obtenerIniciales(nombre) {
  const partes = String(nombre || "").trim().split(/\s+/).filter(Boolean);
  const a = partes[0]?.[0] ?? "?";
  const b = partes[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

/* =======================
   COMPONENTE
======================= */
export default function Chats() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const uidActual = obtenerUidActual();

  /* ===== SOCKET ===== */
  const [socket, setSocket] = useState(null);

  /* ===== CONVERSACIONES ===== */
  const [conversaciones, setConversaciones] = useState([]);
  const [idConversacionActiva, setIdConversacionActiva] = useState(null);

  /* ===== MENSAJES ===== */
  const [mensajes, setMensajes] = useState([]);
  const [textoMensaje, setTextoMensaje] = useState("");

  const refScroll = useRef(null);

  /* =======================
     CONECTAR SOCKET
  ======================= */
  useEffect(() => {
    let s;

    (async () => {
      s = await conectarSocket();
      setSocket(s);

      s.on("connect", () => {
        console.log("🟢 Socket conectado:", s.id);
      });

      s.on("disconnect", () => {
        console.log("🔴 Socket desconectado");
      });
    })();

    return () => {
      s?.disconnect();
    };
  }, []);

  /* =======================
     CARGAR CONVERSACIONES
  ======================= */
  useEffect(() => {
    async function cargar() {
      const data = await obtenerConversaciones();

      const normalizadas = data.map((c) => ({
        id: c.id_chat,
        nombre: c.nombre_contacto,
        ultimo: c.ultimo_msj,
      }));

      setConversaciones(normalizadas);

      const idChatURL = params.get("idChat");
      if (idChatURL) {
        setIdConversacionActiva(Number(idChatURL));
      } else if (normalizadas.length > 0) {
        setIdConversacionActiva(normalizadas[0].id);
      }
    }

    cargar();
  }, []);

  /* =======================
     CARGAR MENSAJES
  ======================= */
  useEffect(() => {
    if (!idConversacionActiva) return;

    async function cargarMensajes() {
      const data = await obtenerMensajes(idConversacionActiva);

      const normalizados = data.map((m) => ({
        id: m.id_mensaje,
        lado: m.id_emisor === uidActual ? "buyer" : "seller",
        titulo: m.id_emisor === uidActual ? "Tú" : "Vendedor",
        texto: m.contenido,
        hora: obtenerHora(m.fecha_envio),
      }));

      setMensajes(normalizados);
    }

    cargarMensajes();
  }, [idConversacionActiva]);

  /* =======================
     JOIN CHAT
  ======================= */
  useEffect(() => {
    if (!socket || !idConversacionActiva) return;

    socket.emit("join_chat", idConversacionActiva);
  }, [socket, idConversacionActiva]);

  /* =======================
     RECIBIR MENSAJES
  ======================= */
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (msg) => {
      setMensajes((prev) => [
        ...prev,
        {
          id: msg.id_mensaje,
          lado: msg.id_emisor === uidActual ? "buyer" : "seller",
          titulo: msg.id_emisor === uidActual ? "Tú" : "Vendedor",
          texto: msg.contenido,
          hora: obtenerHora(msg.fecha_envio),
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  /* =======================
     SCROLL
  ======================= */
  useEffect(() => {
    if (refScroll.current) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight;
    }
  }, [mensajes]);

  const conversacionActiva = useMemo(
    () => conversaciones.find((c) => c.id === idConversacionActiva),
    [conversaciones, idConversacionActiva]
  );

  /* =======================
     ENVIAR MENSAJE
  ======================= */
  const enviarMensaje = () => {
    if (!textoMensaje.trim() || !socket) return;

    socket.emit("send_message", {
      id_chat: idConversacionActiva,
      id_emisor: uidActual,
      contenido: textoMensaje.trim(),
    });

    setTextoMensaje("");
  };

  /* =======================
     UI (NO CAMBIA)
  ======================= */
  return (
    <div className="pagina-chat">
      <div className="contenedor-chat">
        <aside className="barra-lateral-chat">
          <div className="barra-lateral-top">
            <div className="barra-lateral-titulo">Chats</div>
          </div>

          <div className="lista-chat">
            {conversaciones.map((c) => (
              <button
                key={c.id}
                className={`item-chat ${
                  c.id === idConversacionActiva ? "item-chat-activo" : ""
                }`}
                onClick={() => setIdConversacionActiva(c.id)}
              >
                <div className="avatar-chat">
                  {obtenerIniciales(c.nombre)}
                </div>
                <div className="item-cuerpo-chat">
                  <div className="item-nombre-chat">{c.nombre}</div>
                  <div className="item-preview-chat">
                    {c.ultimo || "Aún no hay mensajes"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="principal-chat">
          <div className="encabezado-chat">
            Chat con: <strong>{conversacionActiva?.nombre || "—"}</strong>
          </div>

          <div className="area-chat" ref={refScroll}>
            {mensajes.map((m) => (
              <div
                key={m.id}
                className={`fila-mensaje-chat ${
                  m.lado === "buyer" ? "chat-derecha" : "chat-izquierda"
                }`}
              >
                <div
                  className={
                    m.lado === "buyer"
                      ? "burbuja-comprador"
                      : "burbuja-vendedor"
                  }
                >
                  <div className="burbuja-titulo">{m.titulo}</div>
                  <div className="burbuja-texto">{m.texto}</div>
                  <div className="burbuja-hora">{m.hora}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="barra-input-chat">
            <input
              className="input-chat"
              value={textoMensaje}
              onChange={(e) => setTextoMensaje(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
              placeholder="Escribe un mensaje"
            />
            <button className="boton-enviar-chat" onClick={enviarMensaje}>
              Enviar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
