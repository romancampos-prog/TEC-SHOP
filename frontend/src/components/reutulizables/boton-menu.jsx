import "./boton_menu.css"

export default function BotonMenu ({icon, text, onClick, danger = false}) {
    return(
        <>
            <button 
                className = {`menu-item ${danger ? "menu-item--danger" : ""}`}
                onClick={onClick}
            >
                <span className="menu_item_icon">{icon}</span>
                <span className="menu_item_text">{text}</span>
            </button>
        </>
    )
}