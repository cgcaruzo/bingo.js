import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    resizable: true,
    fullscreenable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('show-confirm-dialog', async (_event, { title, message }) => {
    try {
      const result = await dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancelar', 'Aceptar'],
        defaultId: 1,
        cancelId: 0,
        title: title || 'Confirmar',
        message: message || '¿Está seguro?'
      })
      return result.response === 1
    } catch (error) {
      console.error('Error en show-confirm-dialog:', error)
      return false
    }
  })

  const getGameStatePath = () => join(app.getPath('userData'), 'current-game.json')

  ipcMain.handle('save-game-state', async (_event, gameState) => {
    try {
      const filePath = getGameStatePath()
      writeFileSync(filePath, JSON.stringify(gameState), 'utf-8')
      return { success: true }
    } catch (error) {
      console.error('Error al guardar estado:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('load-game-state', async () => {
    try {
      const filePath = getGameStatePath()
      if (!existsSync(filePath)) {
        return { success: false, exists: false }
      }
      const data = readFileSync(filePath, 'utf-8')
      const gameState = JSON.parse(data)
      return { success: true, exists: true, gameState }
    } catch (error) {
      console.error('Error al cargar estado:', error)
      return { success: false, exists: false, error: error.message }
    }
  })

  ipcMain.handle('delete-game-state', async () => {
    try {
      const filePath = getGameStatePath()
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar estado:', error)
      return { success: false, error: error.message }
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
