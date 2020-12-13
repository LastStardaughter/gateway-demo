const express = require("express");
const router = express.Router();
const fs = require('fs');
const keys=require('../config/keys');
const https = require('https');

router.get("/page", async (req, res) => {
    console.log("Request to load weather page");
    try {
      let html={
          panel1: fs.readFileSync("./private/weather.html").toString()
      }
      res.status(200).json(html);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

router.post("/", async (req, res) => {
    console.log(req.body);
    let city=req.body.city
    city.replace("[^a-zA-Z\s]","");
    city = city[0].toUpperCase() + city.substring(1);
    let country=req.body.country
    country.replace("[^a-zA-Z\s]","").toLowerCase;
    console.log("Requested weather for "+city+", "+country);
    try {
        console.log("Sending request to openweather");
        https.get("https://api.openweathermap.org/data/2.5/weather?q="+city+","+country+"&APPID="+keys.weatherKey, (weather) =>{
            let data= "";
            weather.on('data', (chunk)=>{
                data+=chunk;
            })
            weather.on('end', () =>{
                console.log("response from openweather:");
                console.log(JSON.parse(data));
                res.status(200).json(JSON.parse(data));
            })
        });

/*
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?q="+city+","+country+"&APPID="+keys.weatherKey, true);
        xhr.onload=function() {
                res.body=xhr.res.body;
                console.log("response from openweather");
                res.status(200);
            }
        xhr.send();
        */
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;