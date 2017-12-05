(function(){
  'use strict';
  const auth_key = "e1bada699df94f3b8fc2fbdc5ef74bc8";
  const host = "https://free-api.heweather.com/s6";

  let app = {
    isLoading: false,
    selectedCity: [{
      code: "CN101010100",
      parent_english: "Beijing",
      parent_chinese: "北京",
      english: "beijing",
      chinese: "北京"
    }]
  };

  const provinceList = [{
    chinese: "浙江",
    english: "Zhejiang"
  },{
    chinese: "河北",
    english: "Hebei"
  },{
    chinese: "北京",
    english: "Beijing"
  }];

  const cityList = [{
    code: "CN101010100",
    parent_english: "Beijing",
    parent_chinese: "北京",
    english: "beijing",
    chinese: "北京"
  },{
    code: "CN101090201",
    parent_chinese: "河北",
    parent_english: "Hebei",
    english: "baoding",
    chinese: "保定"
  },{
    code: "CN101090402",
    parent_chinese: "河北",
    parent_english: "Hebei",
    english: "chengde",
    chinese: "承德"
  },{
    code: "CN101090601",
    parent_chinese: "河北",
    parent_english: "Hebei",
    english: "langfang",
    chinese: "廊坊"
  },{
    code: "CN101210101",
    parent_english: "Zhejiang",
    parent_chinese: "浙江",
    english: "hangzhou",
    chinese: "杭州"
  },{
    code: "CN101210301",
    parent_english: "Zhejiang",
    parent_chinese: "浙江",
    english: "jiaxing",
    chinese: "嘉兴"
  }];
  
  app.setLoading = function(loading, dom){
    app.loading = loading;
    if(loading){
      dom.className = "loading";
    } else {
      dom.className = "loading disable";
    }
  };
  
  app.fetchData = function(params){
    let url = host + params.url
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if( xhr.readyState == 4 &&  xhr.status === 200){
        params.success&&params.success(JSON.parse(xhr.responseText));
      } else {
        params.error&&params.error(xhr.statusText);
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
    let weatherBlock = "<div class=weather-card><h3>"+basic.location+"</h3><p class=info>"+new Date(update.loc)+"</p><p class=info>"+now.cond_txt+"</p><div class=weather-content><img src="+weather_icon+now.cond_code+".png /><div class=temperature><span class=number>"+now.tmp+"</span><span class=unit>℃</span></div><div class=detail><p><span class=title>Humidity: </span><span class=content>"+now.hum+"%</span></p><p><span class=title>Wind: </span><span class=content>"+now.wind_sc+"</span></p><p><span class=title>Pressure: </span><span class=content>"+now.pres+"</span></p><p><span class=title>Precipitation: </span><span class=content>"+now.pcpn+"</span></p></div></div><div class=future-weather>";

    daily_forecast.map((forecast)=>{
      var block = "<div class=future-block><p class=date>"+forecast.date+"</p><img src="+weather_icon+forecast.cond_code_d+".png /><p class=highest>"+forecast.tmp_max+"℃</p><p class=lowest>"+forecast.tmp_min+"℃</p></div>";
      weatherBlock += block;
    });

    weatherBlock = weatherBlock + "</div></div>"
    
    return weatherBlock;
  }

  app.renderWeatherCard = function(forecast, now, dom){
    dom.innerHTML = app.returnWeatherCard(forecast, now);
  }

 function main(){
   
  app.setLoading(true, document.getElementsByClassName("loading")[0]);
  var forecast = new Promise(function (resolve, reject){
    app.fetchData({
      url: "/weather/forecast?location=beijing&key="+auth_key,
      success: function(data){
        resolve(data);
      },
      error: function(xhr){
        console.log(xhr);
      }
    });
  });

  var now = new Promise(function (resolve, reject){
    app.fetchData({
      url: "/weather/now?location=beijing&key="+ auth_key,
      success: function(data){
        resolve(data);
      },
      error: function(xhr){
        console.log(xhr);
      }
    });
  });

  Promise.all([forecast, now]).then(datas => {
    app.renderWeatherCard(datas[0], datas[1], document.getElementById("content"));
    app.setLoading(false, document.getElementsByClassName("loading")[0]);
  });
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