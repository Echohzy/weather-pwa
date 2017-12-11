(function(){
  'use strict';
  const auth_key = "e1bada699df94f3b8fc2fbdc5ef74bc8";
  const host = "https://free-api.heweather.com/s6";
  var city_ids;
  let app = {
    isLoading: false,
    showError: false,
    showRemind: false,
    weatherData: [],
    weatherList: document.querySelector("#content"),
    errorBlock: document.querySelector("#error-block"),
    loadingBlock: document.querySelector("#loading-block"),
    remindBlock: document.querySelector("#remind-block"),
    selectedCities: (city_ids=localStorage.getItem("city_ids")) ? city_ids.split(";"):[]
  };
  
  app.setLoading = function(loading, dom){
    app.isLoading = loading;
    if(loading){
      dom.className = "loading";
    } else {
      dom.className = "loading disable";
    }
  };

  app.setErrorBlock = function(show, status, dom){
    app.showError = show;
    if(show){
      dom.className = "error";
    }else{
      dom.className = "error hide";
    }
  };

  app.setRemindBlock = function(showRemind){
    app.showRemind = showRemind;
    if(showRemind){
      app.remindBlock.className = "remind-block show";
    }else{
      app.remindBlock.className = "remind-block";
    }
  };


  app.fetchData = function(params){
    let url = host + params.url
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if( xhr.readyState == 4){
        if(xhr.status === 200){
          params.success&&params.success(JSON.parse(xhr.responseText));
        } else {
          params.error&&params.error(xhr.statusText);
        }
      }
    }
    xhr.open("GET", url);
    xhr.send();
  }

  app.returnWeatherCard = function(forecast, current){
    const forecast_weather = forecast.HeWeather6&& forecast.HeWeather6[0];
    const now_weather = current.HeWeather6&&current.HeWeather6[0];
    const weather_icon = "https://cdn.heweather.com/cond_icon/";
    if(!forecast_weather||!now_weather){
      return;
    }
    const { daily_forecast } = forecast_weather;
    const { basic,  now, update } = now_weather;
    let weatherBlock = "<div class=weather-card data-code="+basic.cid+"><button class=delete-weather data-code="+basic.cid+">删除</button><h3>"+basic.location+"</h3><p class=info>"+new Date(update.loc)+"</p><p class=info>"+now.cond_txt+"</p><div class=weather-content><img src="+weather_icon+now.cond_code+".png /><div class=temperature><span class=number>"+now.tmp+"</span><span class=unit>℃</span></div><div class=detail><p><span class=title>Humidity: </span><span class=content>"+now.hum+"%</span></p><p><span class=title>Wind: </span><span class=content>"+now.wind_sc+"</span></p><p><span class=title>Pressure: </span><span class=content>"+now.pres+"</span></p><p><span class=title>Precipitation: </span><span class=content>"+now.pcpn+"</span></p></div></div><div class=future-weather>";
    daily_forecast.map((forecast)=>{
      var block = "<div class=future-block><p class=date>"+forecast.date+"</p><img src="+weather_icon+forecast.cond_code_d+".png /><p class=highest>"+forecast.tmp_max+"℃</p><p class=lowest>"+forecast.tmp_min+"℃</p></div>";
      weatherBlock += block;
    });

    weatherBlock = weatherBlock + "</div></div>"
    
    return weatherBlock;
  }

  app.renderWeatherList = function(datas){
    datas.length===0 ? app.setRemindBlock(true) : app.setRemindBlock(false);
    let list="";
    datas.map(function(data){
      list += app.returnWeatherCard(data.forecast, data.now);
    });
    app.weatherList.innerHTML = list;
  };

  app.deleteWeather = function(dom){
    let code =dom.getAttribute("data-code");
    app.selectedCities = app.selectedCities.filter(function(data){
      return data !== code;
    });
    localStorage.setItem("city_ids", app.selectedCities.join(";"));
    app.weatherData = app.weatherData.filter(function(data){
      if(data.forecast&&data.forecast.HeWeather6&&data.forecast.HeWeather6[0]&&data.forecast.HeWeather6[0].basic&&data.forecast.HeWeather6[0].basic.cid===code){
        return false;
      }else{
        return true;
      }
    });
    app.renderWeatherList(app.weatherData);
  };

  app.bindEvents = function(){
    app.weatherList.addEventListener("click", function(e){
      if(e.target.className==="delete-weather"){
        app.deleteWeather(e.target);
      }
    });
  };

 function main(){
   
  app.setLoading(true, document.getElementsByClassName("loading")[0]);

  let request_queue = [];

  app.selectedCities.map((code)=>{
    
    let p = new Promise(function(resolve, reject){
      app.fetchData({
        url: "/weather/forecast?location="+code+"&key="+auth_key,
        success: function(data){
          resolve(data);
        },
        error: function(xhr){
          reject(xhr);
        }
      });
    }).then(function(forecast){
      return new Promise(function(resolve, reject){
        app.fetchData({
          url: "/weather/now?location="+code+"&key="+ auth_key,
          success: function(data){
            resolve({forecast: forecast, now: data});
          },
          error: function(xhr){
            reject(xhr);
          }
        });
      });
    });
    request_queue.push(p);

  });

  Promise.all(request_queue).then((datas) => {
    app.weatherData = datas;
    app.renderWeatherList(datas);
    app.setLoading(false, app.loadingBlock);
  }).catch(function(error){
    app.setErrorBlock(true, error, app.errorBlock);
  });

  if( 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(()=>{
        console.log("Service Worker Register");
      });
  }

  app.bindEvents();

 }


 
  
  window.addEventListener("load", function(){
    main();
  });

})();