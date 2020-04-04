const {Tray,ipcMain,Menu,BrowserWindow,app} = require('electron')

const path = require('path')

const iconTray = new Tray(path.join(__dirname,'../static/lover.png'))

const template=[
   
      {
          label:'设置',
          click:function(){
          }
      },
      {
        label:'退出',
        click:function(){
            app.quit()
        }
      },
      {
        label:'升级',
        click:function(){
        }
      }
]

 const m = Menu.buildFromTemplate(template)
 iconTray.setContextMenu(m)

 iconTray.setToolTip('electron应用')

 var win = BrowserWindow.getFocusedWindow()
win.on('close',e=>{
    if(!win.isFocused()){
        win = null
    }else{
        e.preventDefault()
        win.hide()
    }
})

 iconTray.on('double-click',function(){
     win.show()
 })