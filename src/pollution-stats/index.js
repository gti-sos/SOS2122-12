const BASE_API_URL = "/api/v1";
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19481675/UVyn2JiB";
var pollution_stats = [];

module.exports = (app) => {

    app.get(BASE_API_URL+ "/pollution-stats/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL); 
    
    });
    app.get(BASE_API_URL + "/pollution-stats/loadInitialData", (req, res)=>{
        var iniData = [
            {
                country:"eeuu",
                year:2019,
                plastic_waste:17792,
                gaseous_waste: 5036.047,
                collected_waste:323
        
            },
            {
                country:"spain",
                year:2019,
                plastic_waste:1586,
                gaseous_waste: 255.831,
                collected_waste:616736
            },
            {
                country:"germany",
                year:2019,
                plastic_waste:1200,
                gaseous_waste: 702.201,
                collected_waste:65
        
            },
            {
                country:"france",
                year:2019,
                plastic_waste:800,
                gaseous_waste: 319.613,
                collected_waste:38
            },
            {
                country:"italy",
                year:2019,
                plastic_waste:500,
                gaseous_waste: 332.855,
                collected_waste:41
            }
        
        ];
        iniData.forEach((e) => {
            pollution_stats.push(e);
        });
        res.send(JSON.stringify(pollution_stats,null,2));
    
    });
    
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
    app.get(BASE_API_URL+"/pollution-stats/:country/:year", (req,res)=>{
        var pollutionCountry = req.params.country;
        var pollutionYear = req.params.year;
        filteredPollutions = pollution_stats.filter((pollution)=>{
            return ((pollution.country == pollutionCountry) && pollution.year == pollutionYear);
        });
    
        if(filteredPollutions == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredPollutions[0],null,2));
        }
    });
    function mal(pollution){
        return (Object.keys(pollution.body).length != 5 ||
        pollution.body.country == null ||
        pollution.body.year == null ||
        pollution.body.plastic_waste == null ||
        pollution.body.gaseous_waste == null ||
        pollution.body.collected_waste == null);
    }
    
    app.post(BASE_API_URL+ "/pollution-stats",(req,res)=>{
        if (mal(req)){
            res.sendStatus(400, "BAD REQUEST")
        }
        else {
            filteredEmigrants = pollution_stats.filter((pollution) => {
                return (pollution.country == req.body.country
                    && pollution.year == req.body.year
                    && pollution.plastic_waste == req.body.plastic_waste
                    && pollution.gaseous_waste == req.body.gaseous_waste
                    && pollution.collected_waste == req.body.collected_waste);
            });
            
            existente = pollution_stats.filter((pollution) => {
                return (pollution.year == req.body.year && pollution.country == req.body.country);
            })
    
            if (existente != 0){
                res.sendStatus(409, "CONFLICT");
            }else{
                pollution_stats.push(req.body);
                res.sendStatus(201, "CREATED");
            }
        } 
    });
    app.post(BASE_API_URL+"/pollution-stats/:country",(req,res)=>{
        res.sendStatus(405,"METHOD NOT FOUND"); 
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
    app.put(BASE_API_URL+"/pollution-stats", (req,res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });
    app.put(BASE_API_URL+"/pollution-stats/:country/:year",(req,res)=>{
        if(req.body.country == null |
            req.body.year == null | 
            req.body.plastic_waste == null | 
            req.body.gaseous_waste == null | 
            req.body.collected_waste == null){
            res.sendStatus(400,"BAD REQUEST");
        }else{
            var country = req.params.country;
            var year = req.params.year;
            var body = req.body;
            var index = pollution_stats.findIndex((pollution) =>{
                return (pollution.country == country && pollution.year == year)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(country != body.country || year != body.year){
                res.sendStatus(400,"BAD REQUEST");
            }else{
                var update_pollution_stats = {...body};
                pollution_stats[index] = update_pollution_stats;
                
                res.sendStatus(200,"UPDATED");
            }
        }
    
    });

};
