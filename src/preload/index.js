import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  showConfirmDialog: (title, message) =>
    ipcRenderer.invoke('show-confirm-dialog', { title, message }),
  saveGameState: (gameState) => ipcRenderer.invoke('save-game-state', gameState),
  loadGameState: () => ipcRenderer.invoke('load-game-state'),
  deleteGameState: () => ipcRenderer.invoke('delete-game-state'),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  selectImage: () => ipcRenderer.invoke('select-image'),
  copyImage: (sourcePath, type) => ipcRenderer.invoke('copy-image', { sourcePath, type }),
  deleteImage: (type) => ipcRenderer.invoke('delete-image', type),
  getImagesPath: () => ipcRenderer.invoke('get-images-path')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
