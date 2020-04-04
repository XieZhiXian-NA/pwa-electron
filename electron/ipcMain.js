var {ipcMain,BrowserWindow} = require('electron')
//接受
ipcMain.on('send',function(event,data){
    console.log(event)
    console.log(data)
})
ipcMain.on('sendR',function(event,data){
    //通过主进程给渲染进程广播数据
    console.log(event,data)
    event.sender.send('replay','ok 接受到了')
})
ipcMain.on('sendSync',(event,data)=>{
    console.log('同步的消息',data)
    event.returnValue = 'this is sync message'
})

var win = null;

ipcMain.on('openWindow',(event,aid)=>{

    let wFirstId = BrowserWindow.getFocusedWindow().id
        win = new BrowserWindow({
            width:400,
            height:300,
            //frame:false,
            //fullscreen:true,
            webPreferences:{nodeIntegration:true}
            
        })
        win.loadFile('news.html')
        win.webContents.openDevTools()

        win.webContents.on('did-finish-load',function(event,data){
            win.webContents.send('toNews',aid,wFirstId)
        })



        win.on('close',()=>{
            win=null;
        })
    
})