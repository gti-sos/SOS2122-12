const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser =require("body-parser");


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

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
// Backend Javier Vargas Algaba
const backendPollutionStats = require("./src/pollution-stats");
backendPollutionStats(app)


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
app.get(BASE_API_URL+ "/electricity-consumption-stats/docs",(req,res)=>{
    res.send(JSON.stringify(electricity_consumption_stats,null,2)); 

});
app.get(BASE_API_URL + "/electricity-consumption-stats/loadInitialData", (req, res)=>{
    var iniData = [
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
        },
        {
            country:"spain", 
            year:2020, 
            electricity_generation:502797, 
            electricity_consumption:250051, 
            per_capita_consumption:5100
        },
        {
            country:"spain", 
            year:2020, 
            electricity_generation:502797, 
            electricity_consumption:250051, 
            per_capita_consumption:5100
        },
        {
            country:"eeuu", 
            year:2016, 
            electricity_generation:4095487, 
            electricity_consumption:3921118, 
            per_capita_consumption:12135
        }
    
    ];
    iniData.forEach((e) => {
        electricity_consumption_stats.push(e);
    });
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
app.put(BASE_API_URL+"/electricity-consumption-stats", (req,res)=>{
    res.sendStatus(405,"METHOD NOT ALLOWED");
});
app.put(BASE_API_URL+"/electricity-consumption-stats/:country/:year",(req,res)=>{
    if(req.body.country == null |
        req.body.year == null | 
        req.body.electricity_generation == null | 
        req.body.electricity_consumption == null | 
        req.body.per_capita_consumption == null){
        res.sendStatus(400,"BAD REQUEST");
    }else{
        var country = req.params.country;
        var year = req.params.year;
        var body = req.body;
        var index = electricity_consumption_stats.findIndex((electricity) =>{
            return (electricity.country == country && electricity.year == year)
        })
        if(index == null){
            res.sendStatus(404,"NOT FOUND");
        }else if(country != body.country || year != body.year){
            res.sendStatus(400,"BAD REQUEST");
        }else{
            var update_electricity_consumption_stats = {...body};
            pollution_stats[index] = update_electricity_consumption_stats;
            
            res.sendStatus(200,"UPDATED");
        }
    }

});