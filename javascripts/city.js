(function(){
  'use strict';

  let app = {
    
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


  app.renderProvince = function(dom){
    let provinceContent = "";

    provinceList.map((province)=>{
      provinceContent = provinceContent + "<button data-name="+province.chinese+">" + province.chinese + "</button>";
    });
    dom.innerHTML = provinceContent;
  }

  app.selectProvince = function(name){
    app.selectedProvince = {
      chinese: name
    };
    let node = document.querySelector("#city-list");
    app.renderCity(node);
  }


  app.renderCity = function(dom){
    if(!app.selectedProvince){
      return;
    }
    let cityContent = "";
    cityList.map((city)=>{
      if(city.parent_chinese===app.selectedProvince.chinese){
        cityContent = cityContent + "<button>" + city.chinese + "</button>";
      }
    });
    dom.innerHTML = cityContent;
  }

  app.bindEvent = function(){
    let node = document.querySelector("#province-list");
    node.addEventListener("click", (e)=>{
      if(e.target.localName==="button"){
        app.selectProvince(e.target.getAttribute("data-name"));
      }
    });
  }

  function main(){
    var provinceBlock = document.querySelector("#province-list");
    var cityBlock = document.querySelector("#city-list");
    app.renderProvince(provinceBlock);
    app.renderCity(cityBlock);
    app.bindEvent();
  }

  main();

})();