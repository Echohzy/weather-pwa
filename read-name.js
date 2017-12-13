'use strict';
var fs = require('fs');

fs.readdir("./images/icons", function(error, files) {
  

  files = files.map((file)=>{
    return "/images/icons/" + file;
  });
  console.log(files);
});