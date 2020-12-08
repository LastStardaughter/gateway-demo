const express = require("express");
const router = express.Router();
const fs = require('fs')

//Login route goes here, should call auth
router.post("/", async (req, res) => {
    console.log("POST request received:");
    console.log(req.body);
    try {
      const login = {
        user: req.body.user,
        password: req.body.password
      };
      let html={
          nav: fs.readFileSync("./private/nav.html").toString(),
          panel1: "<B>Login successful!</B>",
          panel2: "",
          script: ""
      }
      res.status(200).json(html);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  module.exports = router;