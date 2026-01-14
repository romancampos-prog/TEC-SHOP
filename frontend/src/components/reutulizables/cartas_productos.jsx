import "./cartas_productos.css";

export default function Carta_producto({ nombre, imagenUrl, categoria, precio }) {
  return (
    <div className="contedor_padre_carta">
      <img
        className="img_producto"
        src={imagenUrl}
        alt={nombre}
      />

      <div className="cotendor_informacion">
        <p>{categoria}</p>
        <h2>{nombre}</h2>
        <p>$ {precio}</p>
      </div>
    </div>
  );
}
