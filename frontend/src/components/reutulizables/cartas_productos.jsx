import "./cartas_productos.css";

export default function Carta_producto({ nombre, imagenUrl, categoria, precio, onClick }) {
  return (
    <div className="contedor_padre_carta"
        onClick={onClick}
        role="button"
        tabIndex={0}
    >
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
