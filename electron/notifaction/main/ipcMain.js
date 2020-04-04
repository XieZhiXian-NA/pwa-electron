const {app,globalShortcut} = require('electron')

app.on('ready',function(){
    globalShortcut.register('ctrl+e',function(){
        console.log('ctrl+e')
    })
})
app.on('will-quit',function(){
   //globalShortcut.unregister('ctrl+e')
})