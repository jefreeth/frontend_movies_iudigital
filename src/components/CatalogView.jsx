import { useEffect, useMemo, useState } from "react";
import { mediaService } from "../api/services/mediaService";

function getRelationName(value, fallback = "Sin definir") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.nombre ?? value.nombres ?? value.titulo ?? value.serial ?? fallback;
}

function normalizeRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function CatalogView() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const payload = await mediaService.getAll();
      setItems(normalizeRecords(payload));
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      [item.titulo, item.serial, item.anioEstreno, getRelationName(item.generoPrincipal), getRelationName(item.tipo)]
        .some((value) => String(value ?? "").toLowerCase().includes(query)),
    );
  }, [items, search]);

  return (
    <section className="catalog-view" aria-label="Catálogo audiovisual">
      <div className="catalog-toolbar">
        <div>
          <span className="eyebrow">Biblioteca audiovisual</span>
          <h2>Catálogo</h2>
        </div>
        <div className="catalog-actions">
          <label className="catalog-search">
            <span className="sr-only">Buscar en el catálogo</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar título, serial o género"
            />
          </label>
          <button className="button button-quiet" type="button" onClick={loadCatalog} disabled={isLoading}>↻ Actualizar</button>
        </div>
      </div>

      {isLoading ? (
        <div className="catalog-state"><span className="loader" /> Cargando catálogo...</div>
      ) : filteredItems.length === 0 ? (
        <div className="catalog-state">
          <strong>No hay títulos para mostrar</strong>
          <span>{search ? "Prueba con otra búsqueda." : "Añade una media desde el módulo Medias."}</span>
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredItems.map((item) => (
            <article className="catalog-card" key={item.id ?? item._id ?? item.serial ?? item.titulo}>
              <button
                className="catalog-card-button"
                type="button"
                onClick={() => setSelectedItem(item)}
                aria-label={`Ver detalles de ${item.titulo}`}
              >
                <div className="catalog-cover">
                  {item.imagenPortada ? (
                    <img src={item.imagenPortada} alt={`Portada de ${item.titulo}`} />
                  ) : (
                    <div className="cover-placeholder"><span>I</span></div>
                  )}
                  <span className="catalog-year">{item.anioEstreno || "Sin año"}</span>
                </div>
                <div className="catalog-card-body">
                  <div className="catalog-card-heading">
                    <h3>{item.titulo || "Sin título"}</h3>
                    <span>{getRelationName(item.tipo)}</span>
                  </div>
                  <p>{item.sipnosis || "Sin sinopsis disponible."}</p>
                  <div className="catalog-meta">
                    <span>{getRelationName(item.generoPrincipal)}</span>
                    <span>{getRelationName(item.director)}</span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="catalog-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedItem(null);
        }}>
          <article className="catalog-modal" role="dialog" aria-modal="true" aria-label={`Detalles de ${selectedItem.titulo}`}>
            <button className="catalog-modal-close" type="button" onClick={() => setSelectedItem(null)} aria-label="Cerrar">×</button>
            {selectedItem.imagenPortada && <img className="catalog-modal-cover" src={selectedItem.imagenPortada} alt={`Portada de ${selectedItem.titulo}`} />}
            <div className="catalog-modal-content">
              <span className="eyebrow">{selectedItem.serial || "Sin serial"}</span>
              <h2>{selectedItem.titulo || "Sin título"}</h2>
              <p className="catalog-modal-synopsis">{selectedItem.sipnosis || "Sin sinopsis disponible."}</p>
              <dl className="catalog-details">
                <div><dt>Año</dt><dd>{selectedItem.anioEstreno || "—"}</dd></div>
                <div><dt>Tipo</dt><dd>{getRelationName(selectedItem.tipo)}</dd></div>
                <div><dt>Género</dt><dd>{getRelationName(selectedItem.generoPrincipal)}</dd></div>
                <div><dt>Director</dt><dd>{getRelationName(selectedItem.director)}</dd></div>
                <div><dt>Productora</dt><dd>{getRelationName(selectedItem.productora)}</dd></div>
                <div><dt>URL</dt><dd>{selectedItem.urlPelicula ? <a href={selectedItem.urlPelicula} target="_blank" rel="noreferrer">Abrir película</a> : "—"}</dd></div>
              </dl>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

export default CatalogView;
