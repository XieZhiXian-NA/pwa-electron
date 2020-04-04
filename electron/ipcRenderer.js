//让渲染进程给主进程发送消息
//异步通信
var {ipcRenderer} = require('electron')
var sendDom = document.querySelector('#send');

sendDom.onclick = function(){
   ipcRenderer.send('send','this is a hello girl');
}

var reDom = document.querySelector('#re');
reDom.onclick = function(){
    ipcRenderer.send('sendR','this is render bb')
}
ipcRenderer.on('replay',function(event,data){
    console.log('接受',data)
})

var syDom = document.querySelector('#sy');
syDom.onclick = function(){
    var res = ipcRenderer.sendSync('sendSync','发送同步的消息')
    console.log(res)
}

var cn = document.querySelector('#create-new');
cn.onclick = function(){ 
    var aid = 123;
    localStorage.setItem('aid',aid)
    ipcRenderer.send('openWindow',aid)
    ipcRenderer.on('fromNew',function(event,data){
        console.log('re',data)
    })
   
}