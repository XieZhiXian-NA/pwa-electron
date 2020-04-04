//获取localstorage 
const {ipcRenderer} = require("electron");
const BrowserWindow = require('electron').remote.BrowserWindow
var aid = localStorage.getItem('aid');


ipcRenderer.on('toNews',(event,aid,winId)=>{
    let winFirst = BrowserWindow.fromId(winId)
    winFirst.send('fromNew',aid)
    console.log('news',aid)
})