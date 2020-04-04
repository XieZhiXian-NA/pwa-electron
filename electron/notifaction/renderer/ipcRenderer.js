const path = require('path')
const {clipboard,nativeImage} = require('electron')
const option ={
    title:"electron 通知api",
    body:'electron跨平台消息通知',
    icon:path.join(__dirname,'./static/favicon2.ico')
}

// const myNotification = new window.Notification(option.title.option)
const btn = document.querySelector('#btn')
btn.onclick = function(){
    const myNotification = new window.Notification(option.title,option)
    myNotification.onclick = function(){
      console.log('点击了')
    }

}

const bimg = document.querySelector('#bimg')
bimg.onclick=function(){
   const img = nativeImage.createFromPath(path.join(__dirname,'./static/favicon2.ico'))
   clipboard.writeImage(img)
   const imgUrl = new Image()
   imgUrl.src = clipboard.readImage().toDataURL()
   document.body.appendChild(imgUrl)
}