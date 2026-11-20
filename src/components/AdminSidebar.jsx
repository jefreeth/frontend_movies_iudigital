const navigationItems = [
  { key: "generos", label: "Géneros", icon: "G" },
  { key: "tipos", label: "Tipos", icon: "T" },
  { key: "productoras", label: "Productoras", icon: "P" },
  { key: "directores", label: "Directores", icon: "D" },
  { key: "medias", label: "Medias", icon: "M" },
  { key: "catalogo", label: "Catálogo", icon: "C" },
];

function AdminSidebar({ activeKey, onSelect }) {
  return (
    <aside className="admin-sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">I</span>
        <div>
          <strong>IUDigital</strong>
          <span>Catálogo central</span>
        </div>
      </div>

      <div className="sidebar-section-label">Administración</div>
      <nav className="resource-nav" aria-label="Secciones del catálogo">
        {navigationItems.map((item) => (
          <button
            className={activeKey === item.key ? "nav-item is-active" : "nav-item"}
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" aria-hidden="true" />
        <div>
          <strong>Modo administrador</strong>
          <span>Sesión activa</span>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
