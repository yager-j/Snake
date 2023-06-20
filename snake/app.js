// register serviceworker
if('serviceWorker' in navigator) {
    console.log("service worker supported")
    navigator.serviceWorker.register('/ServiceWorker.js')
    .then((reg) => console.log("serviceworker registered", reg))
    .catch((err) => console.log("serviceworker not registered", err))
}