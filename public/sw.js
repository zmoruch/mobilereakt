// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker zainstalowany');
});

self.addEventListener('fetch', (event) => {
  // Cache strategia dla offline
});