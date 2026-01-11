import "./menu_barra.css";
import BotonMenu from "./boton-menu"
import { useAuth } from "../../contexto/user.Context";
import { useNavigate } from "react-router-dom";
import { cerrarSesionFirebase } from "../../services/firebase/cerrarSesion/cerrarSesionFire";

export default function Menu_Barra ({abierto, onClose}) {
    const navigate = useNavigate(); 
    const {user} = useAuth(); //traer infromqacion del usuario 
    
    const cerrarSesion = async () => {
        try {
            await cerrarSesionFirebase();
            navigate("/", {replace: true})
            console.log("sesion cerrada correctamente")
        } catch (error) {
            console.error("Error al cerrar sesion: ", error)
        }
    }


    return (
        <>
            <div className={`contenedor-Padre ${abierto ? "abierto" : ""}`}>
                <div className="contenedor-perfil">
                    <h2>Mi Perfil</h2>
                    <button className="btn-cerrar-menu" aria-label="Cerar menu" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className="contenedor-usuario">
                    <div className="avatar-usuario">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div className="info-Usuario">
                        <h3>{user ? user.nombre : "Sin sesión"}</h3>
                        <p>{user ? user.email : "No hay correo"}</p>
                    </div>
                </div>
                <div className="contenedor-opciones">
                    <BotonMenu text = "Mi perfil" 
                        icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"stroke="currentColor"strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        }
                    />
                
                    <BotonMenu text = "Mis Chats"
                        icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>

                        }
                    />
                    
                    <BotonMenu text = "Subir Producto"
                        onClick={() => {
                                navigate("/subirProducto");
                                onClose(); // opcional: cerrar el menú
                            }}
                            icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M7 9l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        }
                    />
                </div>
                <div className="contenedor-cerrar">
                    <BotonMenu text = "Cerrar Sesión" danger 
                        icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M10 17l5-5-5-5" stroke="currentColor"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M21 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        }

                        onClick={cerrarSesion}
                    />
                </div>
            </div>  
        </>
    )
}