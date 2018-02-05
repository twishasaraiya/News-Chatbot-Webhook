'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const https = require('https');
const apiKey='028e0789cb204e8abb4b48f867ffd96b';


app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 1337 , () => {
  console.log('webhook is listening');
});

app.get('/',(req,res) => {
    res.send('hello World!!');
});

app.post('/webhook',(req,res) => {
  //console.log(req.body);
  //CALL NEWS API AND EXTRACT PARAMETERS FROM REQ.BODY.PARAMETERS
  var topicToSearch = req.body.result.parameters.Topics ? req.body.result.parameters.Topics : 'tech' ;

  //var country = req.body.result.parameters.geo-country ? req.body.result.parameters.geo-country : 'in';

  var url = encodeURI("https://newsapi.org/v2/top-headlines?country=in&q=" + topicToSearch + '&sortBy=popularity&apiKey=' + apiKey);

  https.get(url, (responseFromApi) => {
    //console.log(responseFromApi);
    let body="";
    responseFromApi.on('newsData',(newsData) => {
      body+=data;
    });

    responseFromApi.on("end",()=>{
      body=JSON.parse(body);
      var num=body.totalResults;
      console.log('num=',num);
      var response = " Okay I found " + num.toString() + " news stories for you!";
      res.status(200).json({
        speech:response,
        displayText:response
      });
    });

  },(error) =>{

    var response = "this is a sample webhook response";
    res.status(200).json({
      speech: response,
      displayText: response,
    });

  });
});
