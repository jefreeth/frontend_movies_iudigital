import { useState } from "react";
import "./App.css";
import AdminSidebar from "./components/AdminSidebar";
import DashboardHeader from "./components/DashboardHeader";
import ResourceManager from "./components/ResourceManager";
import { directorService } from "./api/services/directorService";
import { generoService } from "./api/services/generoService";
import { mediaService } from "./api/services/mediaService";
import { productoraService } from "./api/services/productoraService";
import { tipoService } from "./api/services/tipoService";

const resources = {
  generos: {
    key: "generos",
    label: "Géneros",
    singular: "género",
    service: generoService,
    fields: [{ name: "nombre", label: "nombre del género", placeholder: "Ej. Ciencia ficción" }],
  },
  tipos: {
    key: "tipos",
    label: "Tipos",
    singular: "tipo",
    service: tipoService,
    fields: [
      { name: "nombre", label: "Nombre del tipo", placeholder: "Ej. Película" },
      { name: "descripcion", label: "Descripción", placeholder: "Describe este tipo", type: "textarea", required: false },
    ],
  },
  productoras: {
    key: "productoras",
    label: "Productoras",
    singular: "productora",
    service: productoraService,
    fields: [
      { name: "nombre", label: "nombre de la productora", placeholder: "Ej. A24" },
      { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
      { name: "slogan", label: "Slogan", placeholder: "Ej. Historias que permanecen", required: false },
      { name: "descripcion", label: "descripción", placeholder: "Describe la productora", type: "textarea", required: false },
      { name: "fechaCreacion", label: "Fecha de creación", type: "datetime", form: false },
      { name: "fechaActualizacion", label: "Fecha de actualización", type: "datetime", form: false },
    ],
  },
  directores: {
    key: "directores",
    label: "Directores",
    singular: "director",
    service: directorService,
    fields: [
      { name: "nombre", label: "nombre del director", placeholder: "Ej. Sofia Coppola" },
      { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"] },
      { name: "fechaCreacion", label: "Fecha de creación", type: "datetime", form: false },
      { name: "fechaActualizacion", label: "Fecha de actualización", type: "datetime", form: false },
    ],
  },
  medias: {
    key: "medias",
    label: "Medias",
    singular: "media",
    service: mediaService,
    fields: [
      { name: "serial", label: "serial unico", placeholder: "Ej. MED-0001" },
      { name: "titulo", label: "titulo", placeholder: "Ej. El padrino" },
      { name: "sipnosis", label: "sinopsis", placeholder: "Escribe la sinopsis", type: "textarea" },
      { name: "urlPelicula", label: "url", placeholder: "https://...", type: "url" },
      { name: "imagenPortada", label: "imagen de portada", placeholder: "https://...", type: "url" },
      { name: "anioEstreno", label: "anio de estreno", placeholder: "Ej. 2026", type: "number", min: 1888, max: 2100 },
      { name: "generoPrincipal", label: "genero principal", type: "relation", optionsFrom: generoService, optionLabel: "nombre" },
      { name: "director", label: "director", type: "relation", optionsFrom: directorService, optionLabel: "nombres" },
      { name: "productora", label: "productora", type: "relation", optionsFrom: productoraService, optionLabel: "nombre" },
      { name: "tipo", label: "tipo", type: "relation", optionsFrom: tipoService, optionLabel: "nombre" },
      { name: "fechaCreacion", label: "Fecha de creacion", type: "datetime", form: false },
      { name: "fechaActualizacion", label: "Fecha de actualización", type: "datetime", form: false },
    ],
  },
};

function App() {
  const [activeKey, setActiveKey] = useState("generos");
  const [recordCounts, setRecordCounts] = useState({});
  const activeResource = resources[activeKey];

  const handleCountChange = (count) => {
    setRecordCounts((current) => ({ ...current, [activeKey]: count }));
  };
0
  return (
    <div className="app-shell">
      <AdminSidebar activeKey={activeKey} onSelect={setActiveKey} />
      <main className="main-content">
        <DashboardHeader
          activeResource={activeResource}
          recordCount={recordCounts[activeKey] ?? 0}
        />
        <ResourceManager resource={activeResource} onCountChange={handleCountChange} />
        <footer className="app-footer">
          <span>IUDigital / Catálogo audiovisual</span>
          <span>Panel interno · v1.0</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
