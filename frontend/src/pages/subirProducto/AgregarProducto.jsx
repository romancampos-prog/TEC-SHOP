import { useState } from "react";
import "../styles/agregar.css";
import galeriaImg from "../assets/galeria.jpg";

export default function AgregarProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    estado: "",
    foto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, foto: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto:", form);
  };

  return (
    <div className="form-container">
      <h2>Agregar Producto</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          required
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          required
          value={form.descripcion}
          onChange={handleChange}
        />

        <input
          type="text"
          name="precio"
          placeholder="Precio"
          required
          inputMode="decimal"
          value={form.precio}
          onChange={handleChange}
        />

        <select
          id="categoria"
          name="categoria"
          required
          value={form.categoria}
          onChange={handleChange}
        >
          <option value="" disabled hidden>
            Categoría
          </option>
          <option value="tecnologia">Tecnología y Electrónica</option>
          <option value="materialA">Libros/Material Académico</option>
          <option value="ropa">Ropa y Calzado</option>
          <option value="accesorios">Accesorios y Moda</option>
          <option value="belleza">Belleza y Cuidado Personal</option>
          <option value="hogar">Hogar y Dormitorio</option>
          <option value="deportes">Deportes</option>
          <option value="arte">Arte y Creatividad</option>
          <option value="transporte">Transporte y Movilidad</option>
          <option value="otros">Otros</option>
        </select>

        <input id="foto" type="file" accept="image/*" hidden onChange={handleFile} />
        <label htmlFor="foto" className="btn-foto">
          <img src={galeriaImg} alt="Subir foto" />
        </label>

        <select
          id="estado"
          name="estado"
          required
          value={form.estado}
          onChange={handleChange}
        >
          <option value="" disabled hidden>
            Estado
          </option>
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
        </select>

        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}
