import React, { useEffect, useRef, useState } from "react";
import "./chat.css";



export default function Chat() {
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviar = () => {
    const t = texto.trim();
    if (!t) return;

    const hora = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMensajes((prev) => [
      ...prev,
      {
        id: Date.now(),
        lado: "buyer", // "yo"
        titulo: "Tú",
        texto: t,
        hora,
      },
    ]);

    setTexto("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") enviar();
  };

  return (
    <div className="chat-page">
      <div className="chat-phone">
        <div className="chat-header">
          <div className="chat-headerLabel">Chat con:</div>
          {/* Poner funcion para agarrar usuario de a quien le mandamos mensaje */}
        </div>

        {/* mensajes */}
        <div className="chat-area" ref={scrollRef}>
          {mensajes.length === 0 ? (
            <div className="chat-empty">Aún no hay mensajes.</div>
          ) : (
            mensajes.map((m) => {
              const esBuyer = m.lado === "buyer";
              return (
                <div
                  key={m.id}
                  className={`chat-msgRow ${esBuyer ? "chat-right" : "chat-left"}`}
                >
                  <div className={esBuyer ? "chat-bubbleBuyer" : "chat-bubbleSeller"}>
                    <div className="chat-bubbleTitle">{m.titulo}</div>
                    <div className="chat-bubbleText">{m.texto}</div>
                    <div className="chat-bubbleTime">{m.hora}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* boton enviar */}
        <div className="chat-inputBar">
          <input
            className="chat-input"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe un mensaje"
          />
          <button className="chat-btnSend" onClick={enviar}>
            Enviar
          </button>
        </div>

        <button className="chat-btnValorar">Valorar Usuario</button>
      </div>
    </div>
  );
}