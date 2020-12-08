//Login
function login(e) {
    e.preventDefault();
  
    let authData = {
      user: document.getElementById("user").value,
      password: document.getElementById("pass").value,
 };
  
    console.log(authData);
  
    let xhrLogin = new window.XMLHttpRequest();
    xhrLogin.open("POST", "login");
    xhrLogin.setRequestHeader("Content-Type", "application/json");
    xhrLogin.send(JSON.stringify(authData));
    xhrLogin.onload = function() {
        let res = JSON.parse(xhrLogin.response);
        if (xhrLogin.readyState == 4 && xhrLogin.status == "200"){
            document.getElementById("nav").innerHTML=res.nav;
            document.getElementById("panel1").innerHTML=res.panel1;
            document.getElementById("panel2").innerHTML=res.panel2;
            document.getElementById("script").innerHTML=res.script;
        } else {
            console.error(res);
        }
    }
}

//Load Weather
function loadWeather(e){
    e.preventDefault();
    let xhrLoadWeather = new window.XMLHttpRequest();
    xhrLoadWeather.open("GET", "/weather/page");
    xhrLoadWeather.setRequestHeader("Content-Type", "application/json");
    xhrLoadWeather.send(JSON.stringify(null));
    xhrLoadWeather.onload = function() {
        let res = JSON.parse(xhrLoadWeather.response);
        if (xhrLoadWeather.readyState == 4 && xhrLoadWeather.status == "200"){
            document.getElementById("panel1").innerHTML=res.panel1;
            document.getElementById('weatherButton').addEventListener('click', getWeather);
        } else {
            console.error(res);
        }
    }
}

//Weather
function parseDir(a){
    a=Math.round(a/(360/16));
    switch(a){
        case 0:return "N";
        case 1:return "NNE";
        case 2:return "NE";
        case 3:return "ENE";
        case 4:return "E";
        case 5:return "ESE";
        case 6:return "SE";
        case 7:return "SSE";
        case 8:return "S";
        case 9:return "SSW";
        case 10:return "SW";
        case 11:return "WSW";
        case 12:return "W";
        case 13:return "WNW";
        case 14:return "NW";
        case 15:return "NNW";
        case 16:return "N";
    }
}

function getWeather() {
    console.log("You clicked me!");

    const xhr = new XMLHttpRequest();

    let data={};
    let city=document.getElementById("city").value.replace("[^a-zA-Z\s]","")
    data.city = city[0].toUpperCase() + city.substring(1)

    data.country=document.getElementById("country").value.replace("[^a-zA-Z\s]","").toLowerCase();

   xhr.open("POST", "/weather");
   xhr.setRequestHeader("Content-Type", "application/json");
   console.log(data);
   xhr.send(JSON.stringify(data));
    xhr.onload= function() {
    const parsedData=JSON.parse(xhr.responseText);
    console.log(xhr.responseText);
    if (parsedData["cod"]=="404"){
        document.getElementById("weather").innerHTML="<b>City not found.</b>";
        document.getElementById("weatherimg").removeAttribute("src");
        return;
    }
    document.getElementById("weatherimg").src="http://openweathermap.org/img/wn/"+parsedData["weather"][0]["icon"]+"@2x.png";
    document.getElementById("weather").innerHTML="<b>"+parsedData["weather"][0]["description"]+"</b><br />";
    document.getElementById("weather").innerHTML+="Temp: "+Math.round((parsedData["main"]["temp"]-273.15)*9/5+32)+" degrees F";
    document.getElementById("weather").innerHTML+=" ("+Math.round((parsedData["main"]["temp_min"]-273.15)*9/5+32)+" - ";
    document.getElementById("weather").innerHTML+=Math.round((parsedData["main"]["temp_max"]-273.15)*9/5+32)+")<br />";
    document.getElementById("weather").innerHTML+="Humidity: "+parsedData["main"]["humidity"]+"%<br />";
    document.getElementById("weather").innerHTML+="Wind: "+Math.round(parsedData["wind"]["speed"]/0.44704)+"MPH ";
    document.getElementById("weather").innerHTML+=parseDir(parsedData["wind"]["deg"])+"<br />";
    // document.getElementById("weather").innerHTML+="High: "+Math.round((parsedData["main"]["temp_max"]-273.15)*9/5+32)+" degrees<br />";
    // document.getElementById("weather").innerHTML+="Low:  "+Math.round((parsedData["main"]["temp_min"]-273.15)*9/5+32)+" degrees<br />";
    document.getElementById("weather").innerHTML+="Visibility: "+parsedData["visibility"]+" meters<br />";
    document.getElementById("weather").innerHTML+="Cloudiness: "+parsedData["clouds"]["all"]+"%<br />";
    document.getElementById("weather").innerHTML+="Pressure: "+parsedData["main"]["pressure"]+" hPa<br />";

    }
}

//Load Card Battle Helper
function loadCards(e){
    e.preventDefault();
    let xhrLoadCbh = new window.XMLHttpRequest();
    xhrLoadCbh.open("GET", "/cards/page");
    xhrLoadCbh.setRequestHeader("Content-Type", "application/json");
    xhrLoadCbh.send(JSON.stringify(null));
    xhrLoadCbh.onload = function() {
        let res = JSON.parse(xhrLoadCbh.response);
        if (xhrLoadCbh.readyState == 4 && xhrLoadCbh.status == "200"){
            document.getElementById("panel1").innerHTML=res.panel1;
        } else {
            console.error(res);
        }
    }
}

//Card Battle Helper
async function main(e){
    e.preventDefault();
    let handNames=await parseText();
    const cardDB=await apiCall();
    hand = cardDB.filter(element =>{
       return handNames.includes(element.Title);
    })
    //console.log(hand);
    buildDisplayCards(hand);
}

async function getOne(e){
    e.preventDefault();
    let name=document.getElementById("oneInput").value;
    const cardDB=await apiCall();
    hand = cardDB.filter(element =>{
       return element.Title.toLowerCase() == name.toLowerCase();
    })
    buildDisplayCards(hand);
}

async function getJSON(e){
    e.preventDefault();
    let name=document.getElementById("JSONInput").value;
    const cardDB=await apiCall();
    hand = cardDB.filter(element =>{
       return element.Title.toLowerCase() == name.toLowerCase();
    })
    displayJSON(hand);
}

async function parseText(){
    //let matchStatus="(\| [A-Za-z ]+\([ADU]\:[12]\))g";
    let matchStatus=/([\|][ ][A-Za-z ]+[\(][ADU][\:][12][\)])/g;
    let str=document.getElementById("input").value;
    let hand=str.match(matchStatus);
    hand.forEach((card, i)=>{
        hand[i]=card.substr(2,card.length-8);
    });
    return hand;
}

async function apiCall() {
    let res = await fetch("/cards/api");
    return res.json();
  }

async function showHand(){
    
}

async function buildDisplayCards(hand){
    let html;
    hand.forEach(card =>{
        html="";
        let entry = document.createElement("li");
        entry.className = "card blue-grey white-text";
        //entry.innerHTML = JSON.stringify(card);
        html=card.Title + "<br />";
        html+= card.Description + "<br />";
        html+= "Cost: " + card.Data.cost + "<br />";
        html+= "Damage: " + card.Data.damage + "<br />";
        html+= "Facedown? " + card.Data.facedown + "<br />";
        html+= "Hits: " + card.Data.hits + "<br />";
        html+= "<br />";
        entry.innerHTML = html;
        let div = document.getElementById("hand");
        div.appendChild(entry);
    })
}

async function displayJSON(hand){
    let html;
    hand.forEach(card =>{
        html="";
        let entry = document.createElement("li");
        entry.className = "card blue-grey white-text";
        entry.innerHTML = JSON.stringify(card);
        let div = document.getElementById("hand");
        div.appendChild(entry);
    })
}

//Load NASA POTD
function loadPotd(e){
    e.preventDefault();
    let xhrLoadPotd = new window.XMLHttpRequest();
    xhrLoadPotd.open("GET", "/nasa");
    xhrLoadPotd.setRequestHeader("Content-Type", "application/json");
    xhrLoadPotd.send(JSON.stringify(null));
    xhrLoadPotd.onload = function() {
        let res = JSON.parse(xhrLoadPotd.response);
        if (xhrLoadPotd.readyState == 4 && xhrLoadPotd.status == "200"){
            document.getElementById("panel1").innerHTML=res.panel1;
            document.getElementById("panel2").innerHTML=res.panel2;
        } else {
            console.error(res);
        }
    }
}