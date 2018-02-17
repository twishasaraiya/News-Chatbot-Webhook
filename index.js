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


//messenger platform webhook verification
app.get('/webhook',(req,res)=>{
    let VERIFY_TOKEN = "abc";

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge =req.query['hub.challenge'];

    if(mode && token){
      if(mode == 'subscribe' && token === VERIFY_TOKEN){
        console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge);
      }
    }else{
      res.send(403);
    }
});

// receives all webhook events
app.post('/webhook',(req,res) => {
  console.log(req.body);
  //CALL NEWS API AND EXTRACT PARAMETERS FROM REQ.BODY.PARAMETERS
  const ACTION=req.body.result.action;
  console.log('action',ACTION);

  var country = req.body.result.parameters.geo-country ? req.body.result.parameters.geo-country : 'in';


  if(ACTION==="SPECIFIC_NEWS"){
    console.log(req.body.result.parameters.about);
    var about = req.body.result.parameters.about ? req.body.result.parameters.about : null  ;
      console.log('About',about);

      var url = encodeURI("http://newsapi.org/v2/top-headlines?country=in&category="+about+"&apiKey="+apiKey);
      console.log('URL=',url);

      http.get(url, (responseFromApi)=>{
        let body = "";
        responseFromApi.on('data',(newsData)=>{
          body+=newsData;
        });

        responseFromApi.on("end",()=>{
          body=JSON.parse(body);
          var num = body.totalResults;
          console.log(num);

          var items = [];
          body.articles.forEach((news)=>{
            var obj={};
            obj['description']=news.description;
            obj['image']={
              "url":news.urlToImage
            };
            obj['url']=news.url;
            obj['title']=news.title;
            items.push(obj);
          });
          res.json({
            "displayText":"Okay here is some news for you!!",
            "messages":[
              {
                "platform":"google",
                "items":items,
                "type":"carousel_card"
              }
            ]
          });


        });
      });
  }
  else if(ACTION === 'BREAKING_NEWS'){
    var date=req.body.result.parameters.date;
    var url = encodeURI("http://newsapi.org/v2/top-headlines?country=in&from="+date+"&to="+date+"&apiKey=" + apiKey);

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

    });
  }

});
