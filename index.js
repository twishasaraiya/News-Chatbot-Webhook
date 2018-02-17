'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const http = require('http');
const apiKey='028e0789cb204e8abb4b48f867ffd96b';
const page_access_token="EAAIYLFF6ZBboBANMA5De9CdzDQ6iQ0IZB13pDQ0K2gAgtbzZAXxVzbQwlWn8zZBDY94wNTtZCtbBd0NBMWmzUN1RdfvaiZA5AwHMxgUyFx9Y0hR4jdPDq13hzr4nMBQUgxOx0M76M4jZBkcNMMTnKVxpLvDMKosJ4mK7rNTnQ1Y5QZDZD";


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
          var elements=[];
          body.articles.forEach((news)=>{
            var obj={};
            var obj1={};
            obj['description']=news.description;
            obj['image']={
              "url":news.urlToImage
            };
            obj['url']=news.url;
            obj['title']=news.title;
            items.push(obj);

            obj1['title']=news.title;

            obj1['image_url']=news.urlToImage;
            obj1['default_action']={
              "type":"web_url",
              "url":news.url,
              "messenger_extensions":false,
              "webview_height_ratio":"tall"
            };
            obj1['buttons']=[
              {
                "type":"web_url",
                "url":news.url,
                "title":"Read More"
              }
            ];

            elements.push(obj1);
          });



          res.json({
            "displayText":"Okay here is some news for you!!",
            /*"messages":[
              {
                "platform":"google",
                "items":items,
                "type":"carousel_card"
              }
            ],*/
            "data":{
              "facebook":  {
                  "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"generic",
                      "elements":elements
                    }
                  }
                }
            }
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


function handleMessage(sender_psid,received_message){

}

function handlePostback(sender_psid,received_postback){

}

function sendAPI(sender_psid,response){

}
