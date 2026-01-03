import "./cartas_productos.css";

export default function Carta_producto ({nombre, imagen, categoria, precio}) {
    return (
        <>
            <div className="contedor_padre_carta">
                <img className="img_producto" src="/imagen_prueba/porsche.jpg"/>
                <div className="cotendor_informacion">
                    <p>Categoria</p>
                    <h2>Nombre Producto</h2>
                    <p>$ 20 000 </p>
                </div>
            </div>
        </>
    )
}