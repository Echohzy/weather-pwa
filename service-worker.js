'use strict';

const cacheName = "weather-pwa-version-1";
const filesToCache = [
  "/",
  "/index.html",
  "/stylesheets/main.css",
  "/images/weather-icon.png",
  "javascripts/app.js"
];


self.addEventListener('install', function(e) {
  console.log("installed");
  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      console.log('Service Worker caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
