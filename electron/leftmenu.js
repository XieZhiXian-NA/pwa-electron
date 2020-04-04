const {remote} = require('electron')
let Menu = remote.Menu

var template=[
    {
        label:'文件',
        submenu:[
            {
                label:'新建文件',
                accelerator :'ctrl+n',
                //事件的监听
                click:function(){
                    console.log('ctrl+n')
                }
            },
            {
                label:'新建窗口'
            }
        
        ]
    },
    {
        label:'编辑',
        submenu:[
            {
                label:'编辑文件',
                role:'copy'
            },
            {
                label:'编辑窗口',
                role:'paste'
            }
        
        ]
    }
]
var m = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(m);

//contextmenu 右键事件
window.addEventListener('contextmenu',function(e){
      //阻止当前窗口的默认事件
      e.preventDefault();
      //获取到当前被点击的window 弹出
      m.popup({window:remote.getCurrentWindow()})
})