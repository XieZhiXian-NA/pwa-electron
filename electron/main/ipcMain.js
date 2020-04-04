let {Menu,shell,BrowserWindow} = require('electron')
function openWebview(url){
    var window = BrowserWindow.getFocusedWindow()
    window.webContents.send('sendUrl',url)
}

let template=[
    {
        label:'文件',
        submenu:[
            {
                label:'掘金社区',
                click:function(){
                    openWebview("https://juejin.im");
                },
            },
            {
               type:'separator'
            },
            {
                label:'知乎',
                click:function(){
                    openWebview("https://www.zhihu.com");
                }
            }
        ]
    },
    {
        label:'编辑',
        submenu:[
            {
                label:'去外网',
                click:function(){
                    shell.openExternal('https://www.baidu.com')
                }
            },
            {
                type:'separator',
            },
            {
                label:'联系我们',
                click:function(){
                    shell.openExternal('https://www.electronjs.org/docs/api')
                }
            },
        ]
    }
]
let m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)