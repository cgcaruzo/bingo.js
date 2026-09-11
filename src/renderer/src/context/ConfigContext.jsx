import { useState, useEffect, useCallback, createContext } from 'react'
import PropTypes from 'prop-types'
import { defaultConfig } from '../config/defaultConfig'

export const ConfigContext = createContext()

const cssVarMap = {
  primary: '--color-primary',
  primaryDark: '--color-primary-dark',
  primaryLight: '--color-primary-light',
  secondary: '--color-secondary',
  secondaryDark: '--color-secondary-dark',
  accent: '--color-accent',
  background: '--color-bg',
  surface: '--color-bg-panel',
  surfaceLight: '--color-bg-panel-alt',
  text: '--color-text',
  textMuted: '--color-text-muted',
  success: '--color-success',
  border: '--color-border'
}

const applyTheme = (config, imagesPath) => {
  const root = document.documentElement

  Object.entries(config.theme).forEach(([key, value]) => {
    const cssVar = cssVarMap[key]
    if (cssVar) {
      root.style.setProperty(cssVar, value)
    }
  })

  root.style.setProperty('--overlay-opacity', config.backgroundOverlay)

  if (config.backgroundImage) {
    root.style.setProperty('--bg-image', `url('bingo-images://${config.backgroundImage}')`)
  } else {
    root.style.setProperty('--bg-image', 'none')
  }
}

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig)
  const [isLoaded, setIsLoaded] = useState(false)
  const [imagesPath, setImagesPath] = useState('')

  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        const path = await window.api.getImagesPath()
        setImagesPath(path)

        const result = await window.api.loadConfig()
        if (result.success && result.exists && result.config) {
          setConfig(result.config)
          applyTheme(result.config, path)
        } else {
          applyTheme(defaultConfig, path)
          await window.api.saveConfig(defaultConfig)
        }
      } catch (error) {
        console.error('Error al cargar configuración inicial:', error)
        applyTheme(defaultConfig, '')
      }
      setIsLoaded(true)
    }
    loadInitialConfig()
  }, [])

  const updateConfig = useCallback(
    async (newConfig) => {
      setConfig(newConfig)
      applyTheme(newConfig, imagesPath)
      try {
        await window.api.saveConfig(newConfig)
      } catch (error) {
        console.error('Error al guardar configuración:', error)
      }
    },
    [imagesPath]
  )

  const selectAndCopyImage = useCallback(async (type) => {
    try {
      const selectResult = await window.api.selectImage()
      if (!selectResult.success || selectResult.canceled) {
        return null
      }
      const copyResult = await window.api.copyImage(selectResult.filePath, type)
      if (!copyResult.success) {
        return null
      }
      const fileName = copyResult.destPath.split(/[/\\]/).pop()
      return fileName
    } catch (error) {
      console.error('Error al seleccionar imagen:', error)
      return null
    }
  }, [])

  const deleteImage = useCallback(async (type) => {
    try {
      await window.api.deleteImage(type)
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
    }
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        selectAndCopyImage,
        deleteImage,
        imagesPath
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired
}
