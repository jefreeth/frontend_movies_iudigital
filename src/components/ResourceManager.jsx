import { useEffect, useState } from "react";

function getRecordId(record) {
  return record.id ?? record._id ?? record.Id ?? record.ID;
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    "No fue posible completar la operación."
  );
}

function normalizeRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getFormFields(fields) {
  return fields.filter((field) => field.form !== false);
}

function getTableFields(fields) {
  return fields.filter((field) => field.table !== false);
}

function getRecordFieldValue(record, field) {
  const value = record[field.name];
  if (field.type === "relation" && value && typeof value === "object") {
    return getRecordId(value);
  }
  return value ?? "";
}

function formatFieldValue(field, value) {
  if (!value) return "—";
  if (field.type === "relation" && typeof value === "object") {
    return value[field.optionLabel] ?? value.nombre ?? value.nombres ?? getRecordId(value);
  }
  if (field.type !== "datetime") return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function ResourceManager({ resource, onCountChange }) {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [relationOptions, setRelationOptions] = useState({});

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const payload = await resource.service.getAll();
      const nextRecords = normalizeRecords(payload);
      setRecords(nextRecords);
      onCountChange(nextRecords.length);
      setFeedback({ type: "", message: "" });
    } catch (error) {
      setRecords([]);
      onCountChange(0);
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setEditingId(null);
    setFormData({});
    setRelationOptions({});
    loadRecords();

    const relationFields = getFormFields(resource.fields).filter((field) => field.optionsFrom);
    Promise.all(
      relationFields.map(async (field) => {
        const payload = await field.optionsFrom.getAll();
        const options = normalizeRecords(payload).map((record) => ({
          value: getRecordId(record),
          label: record[field.optionLabel] ?? record.nombre ?? record.nombres ?? getRecordId(record),
        }));
        return [field.name, options];
      }),
    )
      .then((entries) => setRelationOptions(Object.fromEntries(entries)))
      .catch(() => setFeedback({ type: "error", message: "No se pudieron cargar las relaciones." }));
  }, [resource.key]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setFeedback({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      if (editingId !== null) {
        await resource.service.update(editingId, formData);
      } else {
        await resource.service.create(formData);
      }
      await loadRecords();
      resetForm();
      setFeedback({
        type: "success",
        message: editingId !== null ? "Registro actualizado." : "Registro creado.",
      });
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (record) => {
    setEditingId(getRecordId(record));
    setFormData(
      getFormFields(resource.fields).reduce(
        (values, field) => ({ ...values, [field.name]: getRecordFieldValue(record, field) }),
        {},
      ),
    );
    setFeedback({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (record) => {
    const recordId = getRecordId(record);
    if (recordId === undefined || !window.confirm("¿Eliminar este registro?")) return;

    try {
      await resource.service.delete(recordId);
      await loadRecords();
      if (editingId === recordId) resetForm();
      setFeedback({ type: "success", message: "Registro eliminado." });
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    }
  };

  return (
    <section className="resource-manager" aria-labelledby="resource-title">
      <div className="resource-heading">
        <div>
          <span className="eyebrow">Catálogo / {resource.label}</span>
          <h2 id="resource-title">Gestiona {resource.label.toLowerCase()}</h2>
          <p>Administra los registros disponibles para tu catálogo audiovisual.</p>
        </div>
        <button className="button button-quiet" type="button" onClick={loadRecords} disabled={isLoading}>
          <span aria-hidden="true">↻</span> Actualizar
        </button>
      </div>

      {feedback.message && (
        <div className={`feedback feedback-${feedback.type}`} role="status">
          <span aria-hidden="true">{feedback.type === "error" ? "!" : "✓"}</span>
          {feedback.message}
        </div>
      )}

      <div className="manager-grid">
        <form className="editor-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">{editingId !== null ? "Edición" : "Nuevo registro"}</span>
              <h3>{editingId !== null ? "Editar registro" : `Añadir ${resource.singular}`}</h3>
            </div>
            <span className="panel-number">{editingId !== null ? "02" : "01"}</span>
          </div>

          <div className="form-fields">
            {getFormFields(resource.fields).map((field) => (
              <label className="field" key={field.name}>
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleFieldChange}
                    placeholder={field.placeholder}
                    required={field.required !== false}
                    rows="4"
                  />
                ) : field.type === "select" || field.type === "relation" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleFieldChange}
                    required={field.required !== false}
                  >
                    <option value="">Selecciona una opción</option>
                    {(field.type === "relation" ? relationOptions[field.name] ?? [] : field.options).map((option) => {
                      const value = typeof option === "object" ? option.value : option;
                      const label = typeof option === "object" ? option.label : option;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleFieldChange}
                    placeholder={field.placeholder}
                    required={field.required !== false}
                    min={field.min}
                    max={field.max}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : editingId !== null ? "Guardar cambios" : "Crear registro"}
            </button>
            {editingId !== null && (
              <button className="button button-ghost" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="table-panel">
          <div className="panel-heading table-heading">
            <div>
              <span className="panel-kicker">Registros activos</span>
              <h3>Listado de {resource.label.toLowerCase()}</h3>
            </div>
            <span className="record-count">{records.length}</span>
          </div>

          {isLoading ? (
            <div className="empty-state"><span className="loader" /> Cargando registros...</div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <span className="empty-mark">—</span>
              <strong>No hay registros todavía</strong>
              <span>Crea el primero usando el formulario.</span>
            </div>
          ) : (
            <div className="table-wrap">
              {(() => {
                const tableFields = getTableFields(resource.fields);
                return (
              <table>
                <thead>
                  <tr>
                    {tableFields.map((field) => <th key={field.name}>{field.label}</th>)}
                    <th><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={getRecordId(record)}>
                      {tableFields.map((field, index) => (
                        <td key={field.name}>
                          {index === 0 ? <strong>{formatFieldValue(field, record[field.name])}</strong> : formatFieldValue(field, record[field.name])}
                        </td>
                      ))}
                      <td className="row-actions">
                        <button className="icon-button" type="button" onClick={() => startEditing(record)} aria-label="Editar registro" title="Editar">✎</button>
                        <button className="icon-button danger" type="button" onClick={() => handleDelete(record)} aria-label="Eliminar registro" title="Eliminar">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResourceManager;
