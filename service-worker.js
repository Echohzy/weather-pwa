'use strict';

const cacheName = "weather-pwa-version-1";
const filesToCache = [
  "/",
  "/index.html",
  "/city.html",
  "/stylesheets/main.css",
  "/images/icons",
  "/images/clear.png",
  "/images/cloudy-scattered-showers.png",
  "/images/cloudy.png",
  "/images/cloudy_s_sunny.png",
  "/images/fog.png",
  "/images/partly-cloudy.png",
  "/images/rain.png",
  "/images/scattered-showers.png",
  "/images/sleet.png",
  "/images/snow.png",
  "/images/thunderstorm.png",
  "/images/weather-icon.png",
  "/images/wind.png",
  "javascripts/app.js"
];


self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
});
