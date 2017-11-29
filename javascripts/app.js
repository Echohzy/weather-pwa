(function(){
  'use strict';
  const auth_key = "e1bada699df94f3b8fc2fbdc5ef74bc8";
  const host = "https://free-api.heweather.com/s6";

  let app = {
    isLoading: false,
  };

  app.fetchData = function(params){
    let url = host + params.url
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if( xhr.readyState == 4 &&  xhr.status === 200){
        console.log(xhr.responseText);
      } else {
        console.log( xhr.statusText );
      }
    }
    xhr.open("GET", url);
    xhr.send();
  }

 function main(){
  app.fetchData({url: "/weather/forecast?location=beijing&key="+auth_key});
  console.log("main lalalalala");
 }


 main();
  
  if( 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(()=>{
        console.log("Service Worker Register");
      })
  }

})();