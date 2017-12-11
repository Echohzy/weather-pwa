(function(){
  'use strict';

  let app = {
    provinceBlock: document.querySelector("#province-list"),
    cityBlock: document.querySelector("#city-list"),
    plusBlock: document.querySelector("#complete")
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
  },{
    chinese: "江苏",
    english: "Jiangsu"
  },{
    chinese: "福建",
    english: "Fujian"
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
  },{
    code: "CN101190101",
    parent_english: "Jiangsu",
    parent_chinese: "江苏",
    english: "Nanjing",
    chinese: "南京"
  },{
    code: "CN101190201",
    parent_english: "Jiangsu",
    parent_chinese: "江苏",
    english: "Wuxi",
    chinese: "无锡"
  },{
    code: "CN101190401",
    parent_english: "Jiangsu",
    parent_chinese: "江苏",
    english: "Suzhou",
    chinese: "苏州"
  },{
    code: "CN101190601",
    parent_english: "Jiangsu",
    parent_chinese: "江苏",
    english: "Yangzhou",
    chinese: "扬州"
  },{
    code: "CN101230101",
    parent_english: "Fujian",
    parent_chinese: "福建",
    english: "Fuzhou",
    chinese: "福州"
  },{
    code: "CN101230301",
    parent_english: "Fujian",
    parent_chinese: "福建",
    english: "Ningde",
    chinese: "宁德"
  },{
    code: "CN101230501",
    parent_english: "Fujian",
    parent_chinese: "福建",
    english: "Quanzhou",
    chinese: "泉州"
  }];


  app.renderProvince = function(dom){
    let provinceContent = "";
    let provinceName = app.selectedProvince&&app.selectedProvince.chinese;
    provinceList.map((province)=>{
      if(provinceName===province.chinese){
        provinceContent = provinceContent + "<button class=selected data-name="+province.chinese+">" + province.chinese + "</button>";
      }else{
        provinceContent = provinceContent + "<button data-name="+province.chinese+">" + province.chinese + "</button>";
      }
    });
    dom.innerHTML = provinceContent;
  }

  app.selectProvince = function(name){
    app.selectedProvince = {
      chinese: name
    };
    app.selectedCity = null;
    app.renderProvince(app.provinceBlock);
    app.renderCity(app.cityBlock);
  }

  app.selectCity = function(name, code){
    app.selectedCity = {
      chinese: name,
      code: code
    };
     app.renderCity(app.cityBlock);
  }

  app.renderCity = function(dom){
    if(!app.selectedProvince){
      return;
    }
    let cityContent = "";
    let cityName = app.selectedCity && app.selectedCity.chinese;
    cityList.map((city)=>{
      if(city.parent_chinese===app.selectedProvince.chinese){
        if(cityName===city.chinese){
          cityContent = cityContent + "<button class=selected data-name="+city.chinese+" data-code="+city.code+">" + city.chinese + "</button>";
        }else{
          cityContent = cityContent + "<button data-name="+city.chinese+" data-code="+city.code+">" + city.chinese + "</button>";
        }
      }
    });
    dom.innerHTML = cityContent;
  }


  app.completeSelection = function() {
    if(app.selectedCity){
      var cityIds = localStorage.getItem("city_ids");
      var cityArr  = cityIds ? cityIds.split(";") : [];
      if(cityArr.indexOf(app.selectedCity.code)<0){
        cityArr.push(app.selectedCity.code);
        localStorage.setItem("city_ids", cityArr.join(";"));
      }
    }
    window.location.href = "/";
  }
  app.bindEvent = function(){
    app.provinceBlock.addEventListener("click", (e)=>{
      if(e.target.localName==="button"){
        if(e.target.className !== "selected"){
          app.selectProvince(e.target.getAttribute("data-name"));
        }
      }
    });

    app.cityBlock.addEventListener("click", (e)=>{
      if(e.target.localName==="button"){
        if(e.target.className !== "selected"){
          app.selectCity(e.target.getAttribute("data-name"), e.target.getAttribute("data-code"));
        }
      }
    });

    app.plusBlock.addEventListener("click", ()=>{
      app.completeSelection();
    });
  }

  function main(){
    app.renderProvince(app.provinceBlock);
    app.renderCity(app.cityBlock);
    app.bindEvent();
  }

  window.addEventListener("load", function(){
    main();
  })

  main();

})();