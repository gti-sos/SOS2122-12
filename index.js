const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser =require("body-parser");
const request = require('request');
const cors = require('cors');

const pollution_stats = require("./src/back/pollution-stats/index.js");
const electricity_consumption_stats = require("./src/back/electricity-stats/api-electricity-stats.js");
const Datastore = require('nedb');
 

const app = express();
const port = process.env.PORT || 8082;


app.use("/", express.static('public'));
app.use(bodyParser.json());
app.use(cors());

var paths='/remoteImmigrant';
var apiServerHost='https://sos2122-13.herokuapp.com/api/v2/immigrants';

app.use(paths, function(req, res) {
  var url = apiServerHost + req.url;
  req.pipe(request(url)).pipe(res);
});


app.get("/cool",(req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>"+cool()+"</h1></body></html>")
});

app.get("/time",(req,res)=>{
    console.log("Requested /time route");
    res.send("<html><body><h1>"+new Date()+"</h1></body></html>")
});


db_pollutions = new Datastore();
db_electricity = new Datastore();

pollution_stats.register(app, db_pollutions);
electricity_consumption_stats.register(app, db_electricity);

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});