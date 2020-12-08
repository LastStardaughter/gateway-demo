const express = require("express");
const router = express.Router();
const https = require('https');
let potdJSON;

router.get("/", async (req, res) => {
    console.log("Request to load NASA POTD");
    try {
        https.get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", (potd) =>{
        let data= "";
        potd.on('data', (chunk)=>{
            data+=chunk;
        })
        potd.on('end', () =>{
            console.log("POTD received");
            potdJSON=JSON.parse(data);
            let html={
                panel1: "<B>POTD for "+potdJSON.date+"</B><br /><a href=\""+potdJSON.hdurl+"\"><img src="+potdJSON.url+" /></a><br />(Image (c) "+potdJSON.copyright+")",
                panel2: "<B>"+potdJSON.title+"</B><br />"+potdJSON.explanation
              }
              res.status(200).json(html);
        })
        });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }

  });

module.exports = router;