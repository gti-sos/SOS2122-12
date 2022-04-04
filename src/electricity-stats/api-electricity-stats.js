const BASE_API_URL = "/api/v1";
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19481748/UVyn3yy7";
var electricity_stats = [];

module.exports = (app) => {



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
        res.sendStatus(200, "OK");
        res.send(JSON.stringify(electricity_consumption_stats,null,2));

    });
    app.get(BASE_API_URL+ "/electricity-consumption-stats/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL_1); 

    });
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
    function mal(electricity){
        return (Object.keys(electricity.body).length != 5 ||
        electricity.body.country == null ||
        electricity.body.year == null ||
        electricity.body.electricity_generation == null ||
        electricity.body.electricity_consumption == null ||
        electricity.body.per_capita_consumption == null);
    }

    app.post(BASE_API_URL+ "/electricity-consumption-stats",(req,res)=>{
        if (mal(req)){
            res.sendStatus(400, "BAD REQUEST")
        }
        else {
            filteredElectricity = electricity_consumption_stats.filter((electricity) => {
                return (electricity.country == req.body.country
                    && electricity.year == req.body.year
                    && electricity.electricity_generation == req.body.electricity_generation
                    && electricity.electricity_consumption == req.body.electricity_consumption
                    && electricity.per_capita_consumption == req.body.per_capita_consumption);
            });
        
            existente = electricity_consumption_stats.filter((electricity) => {
                return (electricity.year == req.body.year && electricity.country == req.body.country);
            })

            if (existente != 0){
                res.sendStatus(409, "CONFLICT");
            }else{
                electricity_consumption_stats.push(req.body);
                res.sendStatus(201, "CREATED");
            }
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
}