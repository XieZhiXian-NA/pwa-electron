# pwa

  > 一个标准的pwa程序 必须包含三个部分

+ https服务器 / http://localhost本地调试
+ manifest.json配置文件 可以生产桌面应用
+ service-worker  

## service

+ service worker 
  + 用来做持久的离线缓存 是一个浏览器进程 不独属于某个页面
  + 允许web应用在网络环境比较差或者时离线的环境下依旧可以使用
  + 是一个独立的worker线程，独立于当前网页进程，是一种特殊的web worker
  + 可编程拦截页面发出的请求，决定是从缓存中读取数据（缓存的文件可以被网页进程获取包括网络处于离线状态） 还是 将请求发送到服务器  由服务器进行数据响应且此次响应也可以存放到数据库里
  + 离线内容开发者可控 异步实现 大部分都是promise实现
+ 注册
  
  ```js
      window.addEventListener('load',()=>{
          if('serviceWorker' in navigator){
              //返回的是一个Promise对象
              navigator.serviceWorker.register('./sw.js')
                .then(registration=>{
                    //注册成功 触发了三个生命周期
                       console.log(registration)
                })
                .catch(err=>{
                    //注册失败
                    console.log(err)
                })
          }
      })

  ```

+ sw.js最重要的事就是操作缓存和处理网络请求  具有生命周期
+ install 注册成功是触发 主要用于缓存资源
  > install事件在网页存在时，只会触发一次
    当sw.js发生改变时 会再次触发 相当于再次创建了一个service_worker_B

  ```js
    const CACHE_NAME = 'cache_v1';
    this.addEventListener('install',async event=>{
        const cache = await caches.open(CACHE_NAME)
        //等到cache将所有的资源都缓存起来 
        await cache.addAll([
            '/',
            '/images/logo.png',
            '/manifest.json',
            '/index.css',
            'http://localhost:3000/api/getUser'
        ])
        await this.skipWaiting()//跳过等待 直接触发activate生命周期
    });
  ```

+ activate 激活时触发 主要用于删除旧的资源
  > 第一次 在install事件触发后 会立即触发
    如果现在已经存在了一个service_worker_A  install事件再次触发(service_worker_B) 那么activate不会立即触发 而是处于等待状态 直到service_worker_A终止  

  > skipWaiting 跳过等待 直接杀死service_worker_A 直接激活service_worker_B

  > service worker激活之后 会在下一次页面刷新的时候才会生效 
    this.clients.claim()表示在sw激活后，立即获得页面的控制权

 ```js
    this.addEventListener('activate',async event=>{
        // 清除旧的资源 只要cache名与当前的cache名不相等 则是旧的资源 缓存区则删除cache_v1容器
        const keys = await caches.keys()//cache_v1
        keys.forEach(key=>{
            if(key != CACHE_NAME){
                caches.delete(key)
            }
        })
        await this.clients.claim()
    })
  ```

+ fetch 会在发送请求时触发，主要用于操作缓存或者读取网络资源
  > 抓取到所有的网路请求 继而决定是发送云端请求 还是读取本地缓存

  ```js
    this.addEventListener('fetch',event=>{
        //能抓取到所有的请求
        //只缓存同源的内容
        const req = event.request
        const url = new URL(req.url)
        //不同源的直接return 不做任何处理
        if(url.origin !== location.origin) {
            if(req.url.includes('/api')){
            //给浏览器响应
            //接口 浏览器优先
            event.respondWith( networkFirst(req))
            return
        }
        }
    
        //静态资源 缓存优先
        event.respondWith( cacheFirst(req))
        
    })
    async function networkFirst(req){
    const cache =await caches.open(CACHE_NAME)
    try {
        //从网络中读取最新资源 并且往缓存中存取数据
        const fresh = await fetch(req)
        //将响应的备份存到缓存中
        cache.put(req,fresh.clone())
        return fresh
    } catch (error) {
        // 如果没有网络 去读取缓存
        //打开缓存
        //去缓存中拿到 对应请求的响应
        const cached =await cache.match(req)
        return cached
    }
     }

    async function cacheFirst(req){
        const cache = await caches.open(CACHE_NAME)
        const cached = await cache.match(req)
        if(cached) return cached
        else{
            const fresh =  await fetch(req)
            return fresh
        }
    }
  ```

  + 缓存策略
    > 对于不同的数据，需要不同的缓存策略
      本地的静态资源，缓存优先
      对于需要动态更新的数据，网络优先

    > 避免缓存跨域资源
      由于更新机制的问题 如果Service Worker缓存了错误的结果，将会对web应用造成灾难性的后果，我们必须小心翼翼的检查网络返回是否准确。一种常见的做法是只缓存满足如下条件的结果：
      1. 响应状态码为200；避免缓存304 404 50x等常见的结果
      2. 响应类型为basic或者cors及只缓存同源、或者能正确地跨域请求的结果；避免缓存错误的响应和不正确的跨域请求响应

+ cache storage  专门配合service worker来实现资源的缓存 
  + caches 类似于数据库 连接
  
    ```js
      //打开连接一个CACHE_NAME的缓存 返回一个cache对象 可以增加删除想缓存的内容
      caches.open(CACHE_NAME)
      //得到所有缓存的key(缓存名字---数据库名)
      caches.keys() 
      //删除缓存名字为key的cache区域
      caches.delete(key)
    ```

  + cache 类似于数据库里的表 新增 删除
   > cache接口为缓存的Request/Response 对象提供缓存机制 
     把请求当做key 并将对应的响应存储起来

    ```js
       //注： Cache.add/Cache.put/Cache.addAll 只能在 request method 为 GET 的情况下使用。并且相同的 request key 下的 cache，在这三个方法下会被覆盖。
      //抓取一个url数组 并且把结果都存储起来
       cache.addAll([])
      // 这实际上就是一个语法糖。fetch + put
       cache.add(url) 
      //获取req对应的response
       cache.match(req) 
       //将req作为key fresh作为响应 存到缓存中
       cache.put(req,fresh)
    ```
  
+ webworker
  > 独立于js主进程 是一个页面所独有 是属于渲染进程下面的线程
    只适合做大量的运算  
    不能操作 Bom 和 Dom  
    不能操作缓存

  ```js
  1. 在主线程中创建worker对象
     work.js是来做计算的work.js文件 在
   const worker = new Worker('./work.js')
  2. 主进程监听子进程的'message'事件
   worker.addEventListener('message',e=>{console.log(e.data)})
  3. 在work.js中 等待计算结束以后需要将计算结果发给主进程
   self.postMessage({total})
  4. 子线程可以监听主进程的事件
   self.addEventListener事件
  ```

## notification

+ 通知接口 用于向当前用户配置和显示桌面通知
+ Notification.permission 可以获取当前用户的授权情况
  > default 默认 未授权
    Granted 授权的 可以弹窗提醒
    denied 拒绝的 如果拒绝了 无法再次请求授权 也无法弹窗提醒
+ Notification.requestPermission 请求用户的权限
  
  ```js
  if(Notification.permission === 'default'){
        //得到用户的许可
        Notification.requestPermission()
    }
    if(!navigator.onLine){
        new Notification('提示',{body:"你当前没有网络，你访问的是缓存"})
    }
    window.addEventListener('online',function(){
        new Notification('提示',{body:"你已经连接上网络了，请刷新访问最新的数据"})
    })
  
  ```