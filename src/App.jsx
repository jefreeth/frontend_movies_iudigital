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
    fields: [{ name: "nombre", label: "Nombre del género", placeholder: "Ej. Ciencia ficción" }],
  },
  tipos: {
    key: "tipos",
    label: "Tipos",
    singular: "tipo",
    service: tipoService,
    fields: [{ name: "nombre", label: "Nombre del tipo", placeholder: "Ej. Película" }],
  },
  productoras: {
    key: "productoras",
    label: "Productoras",
    singular: "productora",
    service: productoraService,
    fields: [{ name: "nombre", label: "Nombre de la productora", placeholder: "Ej. A24" }],
  },
  directores: {
    key: "directores",
    label: "Directores",
    singular: "director",
    service: directorService,
    fields: [{ name: "nombre", label: "Nombre del director", placeholder: "Ej. Sofia Coppola" }],
  },
  medias: {
    key: "medias",
    label: "Medias",
    singular: "media",
    service: mediaService,
    fields: [
      { name: "nombre", label: "Nombre del media", placeholder: "Ej. Trailer principal" },
      { name: "descripcion", label: "Descripción", placeholder: "Añade una breve descripción", type: "textarea", required: false },
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
