const express = require("express");
const router = express.Router();
const fs = require('fs');
const https = require('https');
let cardCache;

router.get("/page", async (req, res) => {
    console.log("Request to load cards page");
    try {
      let html={
          panel1: fs.readFileSync("./private/cbh.html").toString(),
      }
      res.status(200).json(html);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
    console.log("Caching cards...");
    https.get("https://scene.eldertaleonline.com/api/cards.json", (cards) =>{
        let data= "";
        cards.on('data', (chunk)=>{
            data+=chunk;
        })
        cards.on('end', () =>{
            console.log("Caching complete");
            cardCache=JSON.parse(data);
        })
    });

  });

router.get("/api", async (req, res) => {
    console.log("Request for card cache received")
    try {
        res.status(200).json(cardCache);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;