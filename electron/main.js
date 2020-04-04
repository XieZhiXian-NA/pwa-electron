const electron = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

//声明要打开的主窗口
var mainWindow = null;
//注册全局快捷键
require('./notifaction/main/ipcMain')
app.on('ready',()=>{
    mainWindow = new BrowserWindow(
        {
            width:800,
            height:800,
            webPreferences:{nodeIntegration:true}
        })
    //mainWindow.loadFile('index.html')
    //mainWindow.loadFile('show.html')
    //mainWindow.loadFile('./system_pan/index.html')
    mainWindow.loadFile('./notifaction/index.html')
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed',()=>{
        mainWindow = null
    })
    //require('./system_pan/main/icpMain')
    //require('./main/ipcMain.js')
    //require('./ipcMain')
    //require('./menu.js')
})