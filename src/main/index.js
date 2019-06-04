import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, webContents
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 800,
    minHeight: 300,
    frame: false,
    webPreferences: {webSecurity: false}
  })

  mainWindow.loadURL(winURL)

  webContents = mainWindow.webContents

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());

}


ipcMain.on('window-min',function(){
  mainWindow.minimize();
})


ipcMain.on('window-max',function(){
  if(mainWindow.isMaximized()){
      mainWindow.restore();  
  }else{
      mainWindow.maximize(); 
  }
})

ipcMain.on('window-close',function(){
  mainWindow.close();
})

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  checkForUpdates();
})



app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('getPath', (event, path) => {
  event.returnValue = app.getPath(path)
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})




/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

let checkForUpdates = () => {
  // 配置安装包远端服务器
  autoUpdater.setFeedURL(`http://127.0.0.1:5500/win32`);

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function(message) {
      sendUpdateMessage('error', message);
  });
  autoUpdater.on('checking-for-update', function(message) {
      sendUpdateMessage('checking-for-update', message);
  });
  autoUpdater.on('update-available', function(message) {
      sendUpdateMessage('update-available', message);
  });
  autoUpdater.on('update-not-available', function(message) {
      sendUpdateMessage('update-not-available', message);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
      sendUpdateMessage('downloadProgress', progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      sendUpdateMessage('isUpdateNow');
      ipcMain.on('updateNow', (e, arg) => {
          autoUpdater.quitAndInstall();
      });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};


// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  console.log({ message, data });
  webContents.send('message', { message, data });
}