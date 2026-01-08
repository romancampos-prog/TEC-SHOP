import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../recuperar/recuperaC.css";

export default function RecuperaC() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const okBtnRef = useRef(null);

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!modalOpen) return;

    requestAnimationFrame(() => okBtnRef.current?.focus());

    // cerrar con ESC (solo cierra)
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const enviar = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    try {
      setSending(true);

      // Aquí Firebase 
     

      console.log("Recuperar contraseña para:", cleanEmail);

      setModalMsg(
        `Si el correo ${cleanEmail} está registrado, te enviamos un enlace de recuperación.`
      );
      setModalOpen(true);
    } catch (err) {
      setModalMsg("No se pudo enviar el enlace. Intenta de nuevo.");
      setModalOpen(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rc-body">
      <div className="rc-wrapper">
        {/* CUADRO IZQUIERDO */}
        <section className="rc-left">
          <h2 className="rc-title">Recuperar Contraseña</h2>

          <p className="rc-sub">
            Ingresa tu email y te enviaremos un <br />
            enlace para restablecer tu contraseña.
          </p>

          <form className="rc-form" onSubmit={enviar}>
            <label className="rc-label" htmlFor="email">
              Email
            </label>

            <div className="rc-inputWrap">
              <span className="rc-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
                    fill="currentColor"
                  />
                </svg>
              </span>

              <input
                id="email"
                type="email"
                className="rc-input"
                placeholder="@leon.tecnm.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="rc-btn" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>

            <button
              type="button"
              className="rc-back"
              onClick={() => window.history.back()}
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        </section>

        {/* CUADRO DERECHO */}
        <aside className="rc-right">
          <h2 className="rc-helpTitle">¿Necesitas ayuda?</h2>

          <p className="rc-helpText">
            Si tienes problemas para recuperar tu contraseña, contáctanos y te
            ayudaremos.
          </p>

          <div className="rc-helpGrid">
            <div className="rc-helpBox">
              <div className="rc-helpIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="rc-helpMeta">
                <div className="rc-helpSmall">Envíanos un email</div>
                <div className="rc-helpBig">soporteM@gmail.com</div>
              </div>
            </div>

            
          </div>
        </aside>
      </div>

      {/* Cuadro de enlace enviado */}
      {modalOpen && (
        <div className="rc-modalOverlay" onClick={closeModal}>
          <div
            className="rc-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Enlace enviado"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rc-modalIcon" aria-hidden="true">
              ✓
            </div>
            <h3 className="rc-modalTitle">Enlace enviado</h3>
            <p className="rc-modalText">{modalMsg}</p>

            <button
              ref={okBtnRef}
              className="rc-modalBtn"
              type="button"
              onClick={() => navigate("/cambioContrasena")}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
