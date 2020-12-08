const express = require("express");

const app = express();

app.use(express.json());

const login = require("./routes/login");
const weather = require("./routes/weather");
const cards = require("./routes/cards");
const nasa = require("./routes/nasa");

app.use("/", express.static("public"));
app.use("/login", login);
app.use("/weather", weather);
app.use("/nasa", nasa);

const port = 8080;

app.listen(port, () =>
  console.log(`listening on port ${port} - Gateway operational`)
);