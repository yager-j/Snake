const appCacheName = 'app-cache'

const assets = [
    '/',
    '/snake.html',
    'app.js',
    'snake.js',
    'snake.css'
]

// install
self.addEventListener('install', (event) => {
    console.log("serviceworker installed", event)
    event.waitUntil(
        caches.open(appCacheName)
        .then(cache => {
            cache.addAll(assets)
            console.log("caching assets")
        })
    )
})

// activate
self.addEventListener('activate', (event) => {
    console.log("serviceworker activated", event)
})

// fetch
self.addEventListener('fetch', (event) => {
    console.log("fetch event", event)
    event.respondWith(
        caches.match(event.request)
        .then(cacheResponse => {
            return cacheResponse || fetch(event.request)   
        })
    )
})