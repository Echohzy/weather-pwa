'use strict';

function registerSW(path){
  if( 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(path)
      .then(()=>{
        console.log("Service Worker Register");
      });
  }
}