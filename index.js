'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const http = require('http');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 1337 , () => {
  console.log('webhook is listening');
});

app.get('/',(req,res) => {
    res.send('hello World!!');
});

app.post('/webhook',(req,res) => {
  console.log(req.body);
  var response = "this is a sample webhook response";
  res.status(200).json({
    speech: response,
    displayText: response,
  });
});
