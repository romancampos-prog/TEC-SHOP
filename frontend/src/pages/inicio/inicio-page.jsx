import Cabecera_Inicio from "../../components/inicio-componentes/cabecera_inicio"
import Carta_producto from "../../components/reutulizables/cartas_productos"

//PAGINA DE INCIO
export default function Incio_page () {
    return (
        <>
            <Cabecera_Inicio></Cabecera_Inicio>
            <div className="Contendor_cartas_productos">
                <Carta_producto/>
            </div>
        </>
        
    )
}