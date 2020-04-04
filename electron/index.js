let fs =  require('fs')
let path = require('path')

// window.onload = function(){
//     var btn = this.document.querySelector('#btn');
//     var mybaby = this.document.querySelector('#mybaby');
//     btn.onclick = function(){
//         fs.readFile('xiaojiejie.txt',(err,data)=>{
//             mybaby.innerHTML = data
//         })
//     }
// }
var content =document.querySelector('#content')
content.ondragenter  = content.ondragover = content.ondragleave = function(){ return false}

content.ondrop = function(e){
   // e.preventDefault();
    console.log('dddd')
    console.log(e)
}

//渲染进程没办法直接调用主进程中的模块
//使用remote中的模块的间接的调用主进程中的模块
var BrowserWindow = require('electron').remote.BrowserWindow
var win = null
var cw = document.querySelector('#create-new-window');
cw.onclick = function(){
    win = new BrowserWindow({
        width:400,
        height:300,
        //frame:false,
        fullscreen:true,
        webPreferences:{nodeIntegration:true}
        
    })
    win.loadFile('news.html')
    win.on('close',()=>{
        win=null;
    })
}

let {shell} = require('electron')
const turn = document.querySelector('#turn')
turn.onclick = function(e){
   e.preventDefault()
   let url = this.getAttribute('href')
   //shell.openExternal(url)
//    shell.showItemInFolder('F:\web\bundle\package.json')
}