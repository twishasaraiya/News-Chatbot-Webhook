'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const http = require('http');
const apiKey='028e0789cb204e8abb4b48f867ffd96b';


app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 1337 , () => {
  console.log('webhook is listening');
});

app.post('/webhook',(req,res) => {
  console.log(req.body);
  //CALL NEWS API AND EXTRACT PARAMETERS FROM REQ.BODY.PARAMETERS
  console.log(req.body.result.parameters.Topics);
  var topicToSearch = req.body.result.parameters.Topics ? req.body.result.parameters.Topics : 'technology' ;

  console.log(topicToSearch);
  var country = req.body.result.parameters.geo-country ? req.body.result.parameters.geo-country : 'in';

  var url = encodeURI("http://newsapi.org/v2/top-headlines?country=in&apiKey=" + apiKey);

  console.log(url);
  http.get(url, (responseFromApi) => {
    //console.log(responseFromApi);
    let body="";
    responseFromApi.on('data',(newsData) => {
      body+=newsData;
    });

    responseFromApi.on("end",()=>{
      body=JSON.parse(body);
      //console.log(body);
      var num=body.totalResults;
      console.log(num);
      console.log('num=',num);
      var response = " Okay I found " + num.toString() + " news stories for you!";
      var items=[];
      body.articles.forEach((news)=>{
          var obj={};
          obj['description']=news.description;
          obj['image']={
            "url":news.urlToImage
          };
          obj['url']=news.url;
          obj['title']=news.title;
        //  console.log(obj);
          items.push(obj);
      });
      //console.log(items);
      res.json({
        "messages":[
          {
            "platform":"google",
            "items": items,
            "type":"carousel_card"
          }
        ]
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
