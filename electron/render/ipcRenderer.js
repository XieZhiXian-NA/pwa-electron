let {ipcRenderer,remote} = require('electron')

// var wb = document.querySelector('#wb')
// ipcRenderer.on('sendUrl',(event,data)=>{
//   console.log(data)
//   wb.src = 'https://www.zhihu.com'
// })


var save = document.querySelector('#save')
save.onclick = function(){
    remote.dialog.showSaveDialog({
      title:"save file",
      //保存的类型
      defaultPath:'aa.png',
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        { name: 'Custom File Type', extensions: ['as'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(data=>{
      console.log(data.filePath)
    })
    // remote.dialog.showOpenDialog({
    //   properties:['openFile','openDirectory'],
    //   filters: [
    //         { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    //         { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    //         { name: 'Custom File Type', extensions: ['as'] },
    //         { name: 'All Files', extensions: ['*'] }
    //       ]
    // }).then(data=>{
    //   console.log(data.filePaths)
    // })
}