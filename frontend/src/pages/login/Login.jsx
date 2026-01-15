import "./login.css";
import { useRef, useState } from "react";
import { registroUsuario, loginUsuario } from "../../services/firebase/autenticacion/autenticacionUsuario";
import RegistroCompletado from "../../components/login-componente/registroCompletado";
import { enviarRegistroABackend } from "../../services/api/registro/registro";
import { mapearErrorFirebase } from "../../services/firebase/autenticacion/errores.firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [active, setActive] = useState(false);
  const wrapperRef = useRef(null);

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmContra, setConfirmContra] = useState("");
  const [usuario, setUsuario] = useState("");
  const [errorMsj, setErrorMsj] = useState("");
  const [loading, setLoading] = useState(false);
  const [registroExitoso, setResgistroExitoso] = useState(false);

  const RegistroReact = async (e) => {
    e.preventDefault();
    setErrorMsj("");

    try {
      setLoading(true);

      await registroUsuario({ usuario, correo, contrasena, confirmContra });
      await enviarRegistroABackend({ usuario, correo });

      setResgistroExitoso(true);
      setCorreo("");
      setConfirmContra("");
      setContrasena("");
      setUsuario("");
    } catch (error) {
      if (error.code) {
        setErrorMsj(mapearErrorFirebase(error));
      } else {
        setErrorMsj(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const LoginRect = async (e) => {
    e.preventDefault();
    setErrorMsj("");

    try {
      await loginUsuario({ correo, contrasena });
      navigate("/inicio");
    } catch (error) {
      if (error.code) {
        setErrorMsj(mapearErrorFirebase(error));
      } else {
        setErrorMsj(error.message);
      }
    }
  };

  function toggleActive() {
    setActive((v) => !v);

    requestAnimationFrame(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const target = !active
        ? wrapper.querySelector(".signin input")
        : wrapper.querySelector(".login input");

      target?.focus();
    });
  }

  const irRecuperar = () => {
    navigate("/recuperaC");
  };

    const onForgotKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      irRecuperar();
    }
  };

  return (
    <div
      className={`wrapper ${active ? "active" : ""}`}
      id="formWrapper"
      ref={wrapperRef}
    >
      <div className="form-container login">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={LoginRect}>
          <input
            type="email"
            placeholder="Email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {errorMsj && <p className="errorMensaje">{errorMsj}</p>}

          <div
            className="forgot-password"
            role="button"
            tabIndex={0}
            onClick={irRecuperar}
            onKeyDown={onForgotKeyDown}
          >
            ¿Olvidaste la contraseña?
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>

      {/* Panel derecho */}
      <div className="toggle-container">
        <h2>¿Eres nuevo aquí?</h2>
        <p>Compra y vende en un solo clic.</p>
        <button
          type="button"
          className="switch-btn"
          id="registerSwitch"
          onClick={toggleActive}
        >
          Registrarse
        </button>
      </div>

      {/* registro */}
      <div className="form-container signin">
        <h2>Crear Cuenta</h2>

        <form onSubmit={RegistroReact}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmContra}
            onChange={(e) => setConfirmContra(e.target.value)}
            required
          />

          {errorMsj && <p className="errorMensaje">{errorMsj}</p>}

          <button type="submit" className="submit-btn">
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>
      </div>

      {registroExitoso && (
        <RegistroCompletado
          onContinuar={() => {
            setResgistroExitoso(false);
            setActive(false);
          }}
        />
      )}
    </div>
  );
}
