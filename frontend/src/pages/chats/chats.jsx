import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./chats.css";

function obtenerHoraActual() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function obtenerIniciales(nombre) {
  const partes = String(nombre || "").trim().split(/\s+/).filter(Boolean);
  const a = partes[0]?.[0] ?? "?";
  const b = partes[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function Chats() {
  const navigate = useNavigate();

  const irA = (ruta) => {
    navigate(ruta);
  };

  // ====== conversaciones de prueba (sin BD) ======
  const [conversaciones, setConversaciones] = useState(() => [
    {
      id: "maria",
      nombre: "María García",
      mensajes: [
        { id: 1, lado: "seller", titulo: "María García", texto: "Hola, ¿cómo estás?", hora: "19:35" },
        { id: 2, lado: "buyer", titulo: "Tú", texto: "hola", hora: "19:36" },
      ],
      noLeidos: 2,
    },
    {
      id: "juan",
      nombre: "Juan Pérez",
      mensajes: [{ id: 3, lado: "seller", titulo: "Juan Pérez", texto: "Nos vemos mañana", hora: "18:20" }],
      noLeidos: 0,
    },
    {
      id: "ana",
      nombre: "Ana Martínez",
      mensajes: [{ id: 4, lado: "seller", titulo: "Ana Martínez", texto: "Gracias por tu ayuda", hora: "17:45" }],
      noLeidos: 1,
    },
    {
      id: "carlos",
      nombre: "Carlos López",
      mensajes: [{ id: 5, lado: "seller", titulo: "Carlos López", texto: "Perfecto, entendido", hora: "15:30" }],
      noLeidos: 0,
    },
    {
      id: "laura",
      nombre: "Laura Sánchez",
      mensajes: [{ id: 6, lado: "seller", titulo: "Laura Sánchez", texto: "Te envío los documentos", hora: "Ayer" }],
      noLeidos: 0,
    },
  ]);

  const [idConversacionActiva, setIdConversacionActiva] = useState("maria");
  const [textoMensaje, setTextoMensaje] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const refScroll = useRef(null);

  const conversacionActiva = useMemo(
    () => conversaciones.find((c) => c.id === idConversacionActiva) || null,
    [conversaciones, idConversacionActiva]
  );

  const conversacionesFiltradas = useMemo(() => {
    const q = textoBusqueda.trim().toLowerCase();
    if (!q) return conversaciones;

    return conversaciones.filter((c) => {
      const nombre = (c.nombre || "").toLowerCase();
      const ultimo = (c.mensajes?.[c.mensajes.length - 1]?.texto || "").toLowerCase();
      return nombre.includes(q) || ultimo.includes(q);
    });
  }, [conversaciones, textoBusqueda]);

  useEffect(() => {
    if (refScroll.current) {
      refScroll.current.scrollTop = refScroll.current.scrollHeight;
    }
  }, [idConversacionActiva, conversacionActiva?.mensajes?.length]);

  const seleccionarConversacion = (id) => {
    setIdConversacionActiva(id);
    setConversaciones((prev) => prev.map((c) => (c.id === id ? { ...c, noLeidos: 0 } : c)));
  };

  const enviarMensaje = () => {
    const t = textoMensaje.trim();
    if (!t) return;
    if (!conversacionActiva) return;

    const hora = obtenerHoraActual();
    const nuevoMensaje = {
      id: Date.now() + Math.random(),
      lado: "buyer",
      titulo: "Tú",
      texto: t,
      hora,
    };

    setConversaciones((prev) =>
      prev.map((c) => {
        if (c.id !== conversacionActiva.id) return c;
        const nuevosMensajes = [...(c.mensajes || []), nuevoMensaje];
        return { ...c, mensajes: nuevosMensajes };
      })
    );

    setTextoMensaje("");
  };

  const alPresionarTecla = (e) => {
    if (e.key === "Enter") enviarMensaje();
  };

  const obtenerUltimoMensajeDe = (conversacion) => {
    const ultimo = conversacion.mensajes?.[conversacion.mensajes.length - 1];
    if (!ultimo) return { texto: "Aún no hay mensajes", hora: "" };
    return { texto: ultimo.texto, hora: ultimo.hora || "" };
  };

  const crearConversacionPrueba = () => {
    const nombre = prompt("Nombre del nuevo chat:");
    if (!nombre) return;

    const id = `${Date.now()}`;
    const nuevaConversacion = { id, nombre, mensajes: [], noLeidos: 0 };

    setConversaciones((prev) => [nuevaConversacion, ...prev]);
    setIdConversacionActiva(id);
  };

  return (
    <div className="pagina-chat">
      <div className="contenedor-chat">
        {/* PANEL IZQUIERDO */}
        <aside className="barra-lateral-chat">
          <div className="barra-lateral-top">
            <div className="barra-lateral-titulo">Chats</div>

            <div className="barra-lateral-botones">
              <button
                className="boton-icono-chat"
                type="button"
                onClick={crearConversacionPrueba}
                title="Nuevo chat"
              >
                +
              </button>
              <button className="boton-icono-chat" type="button" title="Opciones">
                ⋮
              </button>
            </div>
          </div>

          <div className="buscador-contenedor-chat">
            <input
              className="buscador-chat"
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              placeholder="Buscar chats..."
            />
          </div>

          <div className="lista-chat">
            {conversacionesFiltradas.length === 0 ? (
              <div className="lista-vacia-chat">No hay chats con ese criterio.</div>
            ) : (
              conversacionesFiltradas.map((c) => {
                const activo = c.id === idConversacionActiva;
                const { texto: preview, hora } = obtenerUltimoMensajeDe(c);

                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`item-chat ${activo ? "item-chat-activo" : ""}`}
                    onClick={() => seleccionarConversacion(c.id)}
                  >
                    <div className="avatar-chat">{obtenerIniciales(c.nombre)}</div>

                    <div className="item-cuerpo-chat">
                      <div className="item-fila1-chat">
                        <div className="item-nombre-chat">{c.nombre}</div>
                        <div className="item-hora-chat">{hora}</div>
                      </div>

                      <div className="item-fila2-chat">
                        <div className="item-preview-chat">{preview}</div>
                        {c.noLeidos > 0 && <div className="badge-chat">{c.noLeidos}</div>}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* PANEL DERECHO */}
        <section className="principal-chat">
          <div className="encabezado-chat">
            <div className="encabezado-izq-chat">
              <div className="avatar-chat avatar-encabezado-chat">
                {obtenerIniciales(conversacionActiva?.nombre || "??")}
              </div>

              <div className="encabezado-textos-chat">
                <div className="encabezado-titulo-chat">
                  Chat con: <span>{conversacionActiva?.nombre || "Sin chat"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* mensajes */}
          <div className="area-chat" ref={refScroll}>
            {!conversacionActiva || (conversacionActiva.mensajes || []).length === 0 ? (
              <div className="vacio-chat">Aún no hay mensajes.</div>
            ) : (
              conversacionActiva.mensajes.map((m) => {
                const esComprador = m.lado === "buyer";
                return (
                  <div
                    key={m.id}
                    className={`fila-mensaje-chat ${esComprador ? "chat-derecha" : "chat-izquierda"}`}
                  >
                    <div className={esComprador ? "burbuja-comprador" : "burbuja-vendedor"}>
                      <div className="burbuja-titulo">{m.titulo}</div>
                      <div className="burbuja-texto">{m.texto}</div>
                      <div className="burbuja-hora">{m.hora}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* input + enviar */}
          <div className="barra-input-chat">
            <input
              className="input-chat"
              value={textoMensaje}
              onChange={(e) => setTextoMensaje(e.target.value)}
              onKeyDown={alPresionarTecla}
              placeholder="Escribe un mensaje"
            />
            <button className="boton-enviar-chat" onClick={enviarMensaje} type="button">
              Enviar
            </button>
          </div>

          <button className="boton-valorar-chat" type="button" onClick={() => irA("/valoracion")}>
            Valorar Usuario
          </button>
        </section>
      </div>
    </div>
  );
}
