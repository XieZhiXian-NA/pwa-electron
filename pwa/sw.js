//操作缓存和处理网络请求
//存在生命周期事件
const CACHE_NAME = 'cache_v2';
const URLS = [
    '/webwork.html',
    '/6.jpg',
    '/index.css',
    'http://localhost:3000/api/getUser'
]
self.addEventListener('install',async event=>{
    console.log('install',event);
    const cache = await caches.open(CACHE_NAME)
    //等到cache将所有的资源都缓存起来
    await cache.addAll(
        URLS
    )
    //event.waitUntil(self.skipWaiting())
    //让serviceworker跳过等待，直接进入activate状态
    //skip返回的是一个promise 为了保证它执行完 需要添加一个waitUntil
    await this.skipWaiting()
})

self.addEventListener('activate',async event=>{
    console.log('active',event)
    const keys = await caches.keys()//cache_v1
    keys.forEach(key=>{
        if(key != CACHE_NAME){
            caches.delete(key)
        }
    })
    await self.clients.claim()
    
})

self.addEventListener('fetch',event=>{
    //能抓取到所有的请求
    //只缓存同源的内容
   const req = event.request
   const url = new URL(req.url)
   console.log(url,location.origin);
   //不同源的直接return 不做任何处理
   if(url.origin !== location.origin){
    if(req.url.includes('/api')){
        event.respondWith( networkFirst(req))
     }
       return
   }
   
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