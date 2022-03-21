const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser =require("body-parser");

const app = express();
const port = process.env.PORT || 8081;
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

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});

// Javier Vargas Algaba
var pollution_stats = [
    {
        country:"EEUU",
        year:2019,
        plastic_waste:17.792,
        gaseous_waste: 5.036,
        collected_waste:323

    },
    {
        country:"Spain",
        year:2019,
        plastic_waste:1.586,
        gaseous_waste: 255.831,
        collected_waste:616.736
    }

];
app.get(BASE_API_URL+ "/pollution-stats",(req,res)=>{
    res.send(JSON.stringify(pollution_stats,null,2)); 

});
app.get(BASE_API_URL+"/pollution-stats/:country", (req,res)=>{
    var pollutionCountry = req.params.country;
    filteredPollutions = pollution_stats.filter((pollution)=>{
        return (pollution.country == pollutionCountry);
    });

    if(filteredPollutions == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredPollutions[0],null,2));
    }
});
app.post(BASE_API_URL+ "/pollution-stats",(req,res)=>{
    pollution_stats.push(req.body);
    res.sendStatus(201,"CREATED"); 
});
app.delete(BASE_API_URL+"/pollution-stats", (req,res)=>{
    pollution_stats = [];
    res.sendStatus(200,"OK");
});
app.delete(BASE_API_URL+"/pollution-stats/:country", (req,res)=>{
    var pollutionCountry = req.params.country;
    pollution_stats = pollution_stats.filter((pollution)=>{
        return (pollution.country != pollutionCountry);
    });
    res.sendStatus(200,"OK");
});

// Francisco Javier Cerrada Begines
var electricity_consumption_stats = [
    {
        country:"france",
        year:2018,
        electricity_generation:551544,
        electricity_consumption: 449957,
        per_capita_consumption:6698

    },
    {
        country:"china",
        year:2018,
        electricity_generation:6801933,
        electricity_consumption: 645119,
        per_capita_consumption:4590
    }

];
app.get(BASE_API_URL+ "/electricity-consumption-stats",(req,res)=>{
    res.send(JSON.stringify(electricity_consumption_stats,null,2)); 

});
app.get(BASE_API_URL+"/electricity-consumption-stats/:country", (req,res)=>{
    var electricityCountry = req.params.country;
    filteredElectricity = electricity_consumption_stats.filter((electricity)=>{
        return (electricity.country == electricityCountry);
    });

    if(filteredElectricity == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredElectricity[0],null,2));
    }
});
app.post(BASE_API_URL+ "/electricity-consumption-stats",(req,res)=>{
    electricity_consumption_stats.push(req.body);
    res.sendStatus(201,"CREATED"); 
});
app.delete(BASE_API_URL+"/electricity-consumption-stats", (req,res)=>{
    electricity_consumption_stats = [];
    res.sendStatus(200,"OK");
});
app.delete(BASE_API_URL+"/electricity-consumption-stats/:country", (req,res)=>{
    var electricityCountry = req.params.country;
    electricity_consumption_stats = electricity_consumption_stats.filter((electricity)=>{
        return (electricity.country != electricityCountry);
    });
    res.sendStatus(200,"OK");
});