function DashboardHeader({ activeResource, recordCount }) {
  return (
    <header className="dashboard-header">
      <div>
        <span className="header-date">CENTRO DE CONTROL / 2026</span>
        <h1>Hola, administrador.</h1>
        <p>Todo lo que tu catálogo necesita, en un solo lugar.</p>
      </div>
      <div className="header-status">
        <span className="live-indicator" aria-hidden="true" />
        <div>
          <strong>{recordCount} registros</strong>
          <span>{activeResource.label} seleccionados</span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
