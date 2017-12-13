'use strict';

const dataCacheName = "weatherData-v1";
const cacheName = "weather-pwa-version-1";
const filesToCache = [
  "/",
  "/index.html",
  "/city.html",
  '/stylesheets/base.css',
  '/stylesheets/city.css',
  '/stylesheets/common.css',
  '/stylesheets/loading.css',
  '/stylesheets/main.css',
  '/images/icons/android-icon-144x144.png',
  '/images/icons/android-icon-192x192.png',
  '/images/icons/android-icon-36x36.png',
  '/images/icons/android-icon-48x48.png',
  '/images/icons/android-icon-72x72.png',
  '/images/icons/android-icon-96x96.png',
  '/images/icons/apple-icon-114x114.png',
  '/images/icons/apple-icon-120x120.png',
  '/images/icons/apple-icon-144x144.png',
  '/images/icons/apple-icon-152x152.png',
  '/images/icons/apple-icon-180x180.png',
  '/images/icons/apple-icon-57x57.png',
  '/images/icons/apple-icon-60x60.png',
  '/images/icons/apple-icon-72x72.png',
  '/images/icons/apple-icon-76x76.png',
  '/images/icons/apple-icon-precomposed.png',
  '/images/icons/apple-icon.png',
  '/images/icons/favicon-16x16.png',
  '/images/icons/favicon-32x32.png',
  '/images/icons/favicon-96x96.png',
  '/images/icons/favicon.ico',
  '/images/icons/ms-icon-144x144.png',
  '/images/icons/ms-icon-150x150.png',
  '/images/icons/ms-icon-310x310.png',
  '/images/icons/ms-icon-70x70.png',
  "/javascripts/app.js",
  "/javascripts/city.js"
];


self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key){
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }))
    })
  );
});

self.addEventListener('fetch', function(e) {
  const dataUrl = "https://free-api.heweather.com/s6";
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    e.respondWith(
     caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
     })
    );
  }
});
