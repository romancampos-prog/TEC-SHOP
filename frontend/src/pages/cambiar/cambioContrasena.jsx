import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/login.css";        
import "./cambioContrasena.css";   


export default function CambioContrasena({
  onSubmitPassword, 
  loginPath = "/", 
}) {
  const [active, setActive] = useState(false); // 
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // cuando cambiamos a modo éxito, enfocamos el botón "Ingresar"
  useEffect(() => {
    if (!active) return;
    requestAnimationFrame(() => {
      const wrapper = wrapperRef.current;
      const btn = wrapper?.querySelector(".signin .submit-btn");
      btn?.focus();
    });
  }, [active]);

  const irLogin = () => {
    navigate(loginPath);
  };

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return "Completa todos los campos.";
    }
    if (newPassword.length < 8) {
      return "La nueva contraseña debe tener mínimo 8 caracteres.";
    }
    if (newPassword !== confirmNewPassword) {
      return "La nueva contraseña y la confirmación no coinciden.";
    }
    return "";
  };

  const activarExito = () => {
    setActive(true);

    requestAnimationFrame(() => {
      const wrapper = wrapperRef.current;
      const btn = wrapper?.querySelector(".signin .submit-btn");
      btn?.focus();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);

      if (onSubmitPassword) {
        await onSubmitPassword({
          currentPassword,
          newPassword,
        });
      }

      activarExito();
    } catch (err) {
      setError(err?.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`wrapper ${active ? "active" : ""}`}
      ref={wrapperRef}
      style={{ width: "980px", maxWidth: "100%", minHeight: "560px" }}
    >
      {/* Cuadro izquierdo  */}
      <div className="form-container login">
        <h2>Cambio de contraseña</h2>

        <form onSubmit={handleSubmit}>
          <div className="cp-field">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="cp-eye"
              onClick={() => setShowCurrent((s) => !s)}
              aria-label={
                showCurrent ? "Ocultar contraseña actual" : "Mostrar contraseña actual"
              }
              title={showCurrent ? "Ocultar" : "Mostrar"}
            >
              {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="cp-field">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="cp-eye"
              onClick={() => setShowNew((s) => !s)}
              aria-label={showNew ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
              title={showNew ? "Ocultar" : "Mostrar"}
            >
              {showNew ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="cp-field">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="cp-eye"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={
                showConfirm ? "Ocultar confirmación de contraseña" : "Mostrar confirmación"
              }
              title={showConfirm ? "Ocultar" : "Mostrar"}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {error ? <div className="cp-alert cp-alert--error">{error}</div> : null}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>

          <div
            className="forgot-password"
            role="button"
            tabIndex={0}
            onClick={irLogin}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                irLogin();
              }
            }}
          >
            Volver al inicio
          </div>
        </form>
      </div>

      {/* Cuadro derecho  */}
      <div className="toggle-container">
        {!active ? (
          <>
            <h2>Seguridad primero</h2>
            <p> Mantén tu cuenta segura actualizando tu contraseña regularmente.</p>

            <ul className="cp-rules">
              <li>
                <span className="cp-check">✓</span> Mínimo 8 caracteres
              </li>
              <li>
                <span className="cp-check">✓</span> Incluye letras y números
              </li>
              <li>
                <span className="cp-check">✓</span> Usa caracteres especiales
              </li>
            </ul>
          </>
        ) : (
          <>
            <h2>¡Listo!</h2>
            <p>Tu contraseña se actualizó correctamente.</p>
            <button
              type="button"
              className="switch-btn"
              onClick={irLogin}
              style={{ marginTop: 14 }}
            >
              Ingresar
            </button>
          </>
        )}
      </div>

      {/* ======= ÉXITO (izquierda) ======= */}
      <div className="form-container signin">
        <h2>Cambio realizado</h2>
        <p className="cp-success-text">Ya puedes iniciar sesión con tu nueva contraseña.</p>

        <button type="button" className="submit-btn" onClick={irLogin}>
          Ingresar
        </button>

        <div
          className="forgot-password"
          role="button"
          tabIndex={0}
          onClick={irLogin}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              irLogin();
            }
          }}
        >
          Volver al inicio
        </div>
      </div>
    </div>
  );
}

/* OJITO */
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 5c-5.5 0-9.8 4.3-10.9 6 .9 1.7 5.4 8 10.9 8s10-6.3 10.9-8C21.8 9.3 17.5 5 12 5Zm0 12c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6Zm0-10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4.4 3 3 4.4l3 3C3.7 9 2.3 10.8 1.7 12c.9 1.7 5.4 8 10.9 8 2 0 3.9-.6 5.5-1.5l2 2L21 19.6 4.4 3Zm7.6 15c-3.3 0-6-2.7-6-6 0-.7.1-1.4.4-2l2 2a4 4 0 0 0 5.6 5.6l2 2c-.6.2-1.3.4-2 .4Zm10.3-6c-.6 1.1-2.2 3.3-4.5 5l-1.7-1.7c1.1-1 1.9-2.3 1.9-3.3 0-3.3-2.7-6-6-6-1 0-2.3.8-3.3 1.9L7 6.2C8.7 4.9 10.4 4 12 4c5.5 0 10 4.3 11 6-.1.2-.3.7-.7 1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
