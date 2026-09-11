import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ConfigContext } from '../context/ConfigContext'
import { defaultConfig } from '../config/defaultConfig'

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="settings-field">
      <label>{label}</label>
      <div className="color-input-wrapper">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} maxLength={7} />
      </div>
    </div>
  )
}

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

function SettingsPanel({ onClose }) {
  const { config, updateConfig, selectAndCopyImage, deleteImage, imagesPath } =
    useContext(ConfigContext)
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(config)))

  const updateTheme = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value }
    }))
  }

  const updateDecade = (index, color) => {
    setDraft((prev) => {
      const newDecades = [...prev.decades]
      newDecades[index] = { ...newDecades[index], color }
      return { ...prev, decades: newDecades }
    })
  }

  const handleSave = async () => {
    await updateConfig(draft)
    onClose()
  }

  const handleRestore = () => {
    setDraft(JSON.parse(JSON.stringify(defaultConfig)))
  }

  const handleSelectBackground = async () => {
    const fileName = await selectAndCopyImage('background')
    if (fileName) {
      setDraft((prev) => ({ ...prev, backgroundImage: fileName }))
    }
  }

  const handleRemoveBackground = async () => {
    await deleteImage('background')
    setDraft((prev) => ({ ...prev, backgroundImage: null }))
  }

  const getPreviewUrl = (fileName) => {
    if (!fileName) return null
    return `bingo-images://${fileName}`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Configuracion del Evento</h2>
          <button className="btn-close" onClick={onClose}>
            X
          </button>
        </div>

        <div className="settings-body">
          <section className="settings-section">
            <h3>Identidad</h3>
            <div className="settings-field">
              <label>Nombre del evento</label>
              <input
                type="text"
                value={draft.eventName}
                onChange={(e) => setDraft((prev) => ({ ...prev, eventName: e.target.value }))}
              />
            </div>
            <div className="settings-field">
              <label>Subtitulo</label>
              <input
                type="text"
                value={draft.subtitle}
                onChange={(e) => setDraft((prev) => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>
          </section>

          <section className="settings-section">
            <h3>Colores principales</h3>
            <div className="color-grid">
              <ColorPicker
                label="Primario"
                value={draft.theme.primary}
                onChange={(v) => updateTheme('primary', v)}
              />
              <ColorPicker
                label="Primario oscuro"
                value={draft.theme.primaryDark}
                onChange={(v) => updateTheme('primaryDark', v)}
              />
              <ColorPicker
                label="Primario claro"
                value={draft.theme.primaryLight}
                onChange={(v) => updateTheme('primaryLight', v)}
              />
              <ColorPicker
                label="Secundario"
                value={draft.theme.secondary}
                onChange={(v) => updateTheme('secondary', v)}
              />
              <ColorPicker
                label="Secundario oscuro"
                value={draft.theme.secondaryDark}
                onChange={(v) => updateTheme('secondaryDark', v)}
              />
              <ColorPicker
                label="Acento"
                value={draft.theme.accent}
                onChange={(v) => updateTheme('accent', v)}
              />
              <ColorPicker
                label="Fondo"
                value={draft.theme.background}
                onChange={(v) => updateTheme('background', v)}
              />
              <ColorPicker
                label="Paneles"
                value={draft.theme.surface}
                onChange={(v) => updateTheme('surface', v)}
              />
              <ColorPicker
                label="Texto"
                value={draft.theme.text}
                onChange={(v) => updateTheme('text', v)}
              />
              <ColorPicker
                label="Texto secundario"
                value={draft.theme.textMuted}
                onChange={(v) => updateTheme('textMuted', v)}
              />
              <ColorPicker
                label="Exito"
                value={draft.theme.success}
                onChange={(v) => updateTheme('success', v)}
              />
              <ColorPicker
                label="Bordes"
                value={draft.theme.border}
                onChange={(v) => updateTheme('border', v)}
              />
            </div>
          </section>

          <section className="settings-section">
            <h3>Imagen de fondo</h3>
            <div className="image-field">
              {draft.backgroundImage && (
                <div className="image-preview">
                  <img src={getPreviewUrl(draft.backgroundImage)} alt="Fondo" />
                </div>
              )}
              <div className="image-actions">
                <button className="btn-secondary" onClick={handleSelectBackground}>
                  Seleccionar imagen...
                </button>
                {draft.backgroundImage && (
                  <button className="btn-danger" onClick={handleRemoveBackground}>
                    Quitar
                  </button>
                )}
              </div>
            </div>
            <div className="settings-field">
              <label>Opacidad del overlay: {draft.backgroundOverlay.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={draft.backgroundOverlay}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, backgroundOverlay: parseFloat(e.target.value) }))
                }
              />
            </div>
          </section>

          <section className="settings-section">
            <h3>Colores por decena</h3>
            <div className="decade-grid">
              {draft.decades.map((decade, index) => (
                <div className="settings-field decade-field" key={decade.range[0]}>
                  <label>
                    {decade.range[0]}-{decade.range[1]}
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={decade.color}
                      onChange={(e) => updateDecade(index, e.target.value)}
                    />
                    <input
                      type="text"
                      value={decade.color}
                      onChange={(e) => updateDecade(index, e.target.value)}
                      maxLength={7}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="settings-footer">
          <button className="btn-secondary" onClick={handleRestore}>
            Restaurar valores
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

SettingsPanel.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default SettingsPanel
