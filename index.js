const express = require('express');
const bodyparser = require('body-parser');
const http = require('http');

const app = express();

app.post('/get-response',function(req,res){
  var response = "this is a sample reponse from webhook";
    return res.json({
      "speech": repsonse,
      "displayText": reponse
    });
});

app.listen((process.env.PORT || 8000),function(){
  console.log('Server is up and running');
});
