const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser =require("body-parser");

const pollution_stats = require("./src/pollution-stats/index.js");
const Datastore = require("nedb")


const app = express();
const port = process.env.PORT || 8080;
const BASE_API_URL = "/api/v1";


app.use("/", express.static('public'));
app.use(bodyParser.json());

app.get("/cool",(req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>"+cool()+"</h1></body></html>")
});

app.get("/time",(req,res)=>{
    console.log("Requested /time route");
    res.send("<html><body><h1>"+new Date()+"</h1></body></html>")
});


db_pollutions = new Datastore();

pollution_stats.register(app, db_pollutions);

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});

// Backend Francisco Javier Cerrada Begines
const backendElectricityStats = require("./src/electricity-stats");
backendElectricityStats(app)