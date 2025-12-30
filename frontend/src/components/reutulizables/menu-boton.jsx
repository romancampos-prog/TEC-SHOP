import "./menu-boton.css";

export default function Boton_Menu ({onClick}) {
    return(
        <button 
            onClick={onClick} 
            aria-label="Abrir menú"
            className="menu-btn"
        >
            ☰
        </button>
    )
}