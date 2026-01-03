import { useState } from "react";
import "./agregar.css";
import { validarInformacion } from "../../services/firebase/subirProducto/subirProducto";
import { reducirImagen } from "../../services/firebase/subirProducto/reducirImagen";
import { subirFotoFirebase } from "../../services/firebase/fotoFirebase";
import ProductoSubido from "./subidoCorrecto";
import Menu_Barra from "../../components/reutulizables/menu_barra";
import Boton_Menu from "../../components/reutulizables/menu-boton";

export default function AgregarProducto() {
  const [mostrarExito, setMostrarExito] = useState(false);


  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    estado: "",
    foto: null,
  });

  const FORM_INICIAL = {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      estado: "",
      foto: null,
    };


  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, foto: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

 const subirProductoRecat = async (e) => {
  e.preventDefault();

  try {
    validarInformacion(form);
    const imagenOptimizada = await reducirImagen(form.foto);
    const URL_foto =  await subirFotoFirebase(imagenOptimizada);

    const productoFinal = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      categoria: form.categoria,
      estado: form.estado,
      fotoUrl: URL_foto, 
    };

    console.log("producto final: ", productoFinal)
    //await subirProductoBack(productoFinal);

    setMostrarExito(true);

    setForm(FORM_INICIAL);
    setPreview(null);


    setTimeout(() => setMostrarExito(false), 3000);

  
  } catch (error) {
    alert(error.message);
  }
};


  return (
    <div className="add-product-page">
      <Boton_Menu></Boton_Menu>
      <div className="add-product-card">
        {/* HEADER */}
        <div className="add-product-header">
          <div className="icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Agregar Producto</h2>
          <p>Completa la información de tu producto</p>
        </div>

        {/* FORM */}
        <form className="add-product-form" onSubmit={subirProductoRecat}>
          <label>
            <span className="label-icon">🏷️ Nombre del producto</span>
            <input type="text" name="nombre" placeholder="Ej: MacBook Pro 2023" required value={form.nombre} onChange={handleChange}/>
          </label>

          <label>
            <span className="label-icon">📄 Descripción</span>
            <textarea name="descripcion" placeholder="Describe las características principales..." required value={form.descripcion} onChange={handleChange}/>
          </label>

          <label>
            <span className="label-icon">💲 Precio</span>
            <input type="number" name="precio" placeholder="0.00" required value={form.precio} onChange={handleChange}/>
          </label>

          <div className="row-2">
            <label>
              Categoría
              <select name="categoria" required value={form.categoria} onChange={handleChange}>
                <option value="">Selecciona</option>
                <option value="tecnologia">Tecnología</option>
                <option value="libros">Libros</option>
                <option value="ropa">Ropa</option>
                <option value="hogar">Hogar</option>
                <option value="otros">Otros</option>
              </select>
            </label>

            <label>
              Estado
              <select name="estado" required value={form.estado} onChange={handleChange}>
                <option value="">Selecciona</option>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </label>
          </div>

          <span className="label-icon">📷 Foto del producto</span>

          <label className="upload-box">
            <input type="file" accept="image/*" hidden onChange={handleFile} />
            {preview ? (
              <img src={preview} alt="preview" className="preview-img" />
            ) : (
              <div className="upload-content">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V4" stroke="#67959e" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 9l5-5 5 5" stroke="#67959e" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 20h16" stroke="#67959e" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <strong>Haz clic para subir una imagen</strong>
                <span>PNG o JPG hasta 10MB</span>
              </div>
            )}
          </label>

          <button className="btn-submit" type="submit">
            ✨ Publicar Producto
          </button>
        </form>
      </div>
      {mostrarExito && <ProductoSubido />}

    </div>
  );
}

