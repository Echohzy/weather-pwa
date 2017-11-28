(function(){
  'use strict';
  const auth_key = "o0dcifkujjydcxxd";
  const url = "https://api.seniverse.com/v3";

  
  if( 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(()=>{
        console.log("Service Worker Register");
      })
  }

})();