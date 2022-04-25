const BASE_API_URL = "/api/v2";
const API_DOC_PORTAL_1 = "https://documenter.getpostman.com/view/19481748/UVyn3yy7";
var electricity = [
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

module.exports.register = (app, db) => {


    app.get(BASE_API_URL + "/electricity-consumption-stats/loadInitialData", (req, res)=>{
        
        db.find({}, function(err,filteredElectricity){

            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            if(filteredElectricity==0){
                for(var i = 0; i<electricity.length;i++){
                    db.insert(electricity[i]);
                }
                res.sendStatus(200,"OK");
                return;
            }else{
                res.sendStatus(200, "Ya inicializados")
            }
        })
    
    });
    app.get(BASE_API_URL+ "/electricity-consumption-stats/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL_1); 

    });
    app.get(BASE_API_URL+ "/electricity-consumption-stats",(req,res)=>{
        var year = req.query.year;
        var from = req.query.from;
        var to   = req.query.to;
    
        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        if(from>to){
            res.sendStatus(400, "BAD REQUEST");  
            return; 
        }
    
        db.find({},function(err, filteredElectricity){
    
            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return; 
            }

            // Año
            if(year != null){
                var filteredElectricity = filteredElectricity.filter((reg)=>
                {
                    return (reg.year == year);
                });
                if (filteredElectricity==0){
                    res.sendStatus(404, "NOT FOUND");
                    return;     
                }
            }

            // From To
            if(from != null && to != null){
                filteredElectricity = filteredElectricity.filter((reg)=>
                {
                    return (reg.year >= from && reg.year <=to);
                });
    
                if (filteredElectricity==0){
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }    
            }
            
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredElectricity = pagination(req,filteredElectricity);
            }
            filteredElectricity.forEach((element)=>{
                delete element._id;
            });
            res.send(JSON.stringify(filteredElectricity,null,2));
        });
      
    }); 
    app.get(BASE_API_URL+"/electricity-consumption-stats/:country", (req,res)=>{
        var country =req.params.country
        var from = req.query.from;
        var to = req.query.to;
    
        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "from" && element != "to"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }
    
        if(from>to){
            res.sendStatus(400, "BAD REQUEST"); 
            return;
        }
    
        db.find({}, function(err,filteredElectricity){
                
            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }
    
            filteredElectricity = filteredElectricity.filter((reg)=>
            {
                return (reg.country == country);
            });
    
            //Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;

            //Comprobamos si from es mas pequeño o igual a to
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            if(from != null && to != null && from<=to){
                filteredElectricity = filteredElectricity.filter((reg)=>
                {
                   return (reg.year >= from && reg.year <=to);
                }); 
                
            }
        
            if (filteredElectricity==0){
                res.sendStatus(404, "NOT FOUND");
                return;
            }
            
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredElectricity = pagination(req,filteredElectricity);
            }
            filteredElectricity.forEach((element)=>{
                delete element._id;
            });
            res.send(JSON.stringify(filteredElectricity,null,2));
        });
    
    });
    function mal(electricity){
        return (Object.keys(electricity.body).length != 5 ||
        electricity.body.country == null ||
        electricity.body.year == null ||
        electricity.body.electricity_generation == null ||
        electricity.body.electricity_consumption == null ||
        electricity.body.per_capita_consumption == null);
    }
    app.get(BASE_API_URL+"/electricity-consumption-stats/:country/:year", (req,res)=>{
        var electricityCountry =req.params.country
        var electricityYear = req.params.year
    
        db.find({},function(err, filteredElectricity){
    
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
    
            filteredElectricity = filteredElectricity.filter((reg)=>
            {
                return (reg.country == electricityCountry && reg.year == electricityYear);
            });
    
            if (filteredElectricity==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            
            //Pagination
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredElectricity = pagination(req,filteredElectricity);
                res.send(JSON.stringify(filteredElectricity,null,2));
            }
            filteredElectricity.forEach((element)=>{
                delete element._id;
            });
            res.send(JSON.stringify(filteredElectricity[0],null,2));
        });
    
    });
    function mal(electricity){
        return (Object.keys(electricity.body).length != 5 ||
        electricity.body.country == null ||
        electricity.body.year == null ||
        electricity.body.electricity_generation == null ||
        electricity.body.electricity_consumption == null ||
        electricity.body.per_capita_consumption == null);
    }

    function pagination(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("ERROR");
            return res;
        }
    
        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;
    
    };

    app.post(BASE_API_URL+ "/electricity-consumption-stats",(req,res)=>{
        if (mal(req)){
            res.sendStatus(400, "BAD REQUEST")
        }
        else {
            db.find({},function(err,filteredElectricity){
    
                if(err){
                    res.sendStatus(500, "CLIENT ERROR");
                    return;
                   
                }
    
                filteredElectricity = filteredElectricity.filter((reg)=>
                {
                    return(req.body.country == reg.country && req.body.year == reg.year)
                })
            
                if(filteredElectricity.length != 0){
                    res.sendStatus(409, "CONFLICT");
                }else{
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            });
        }
    
    });

    //POST a un recurso concreto (país)
    app.post(BASE_API_URL + "/electricity-consumption-stats/:country", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    app.delete(BASE_API_URL+"/electricity-consumption-stats", (req,res)=>{
        db.remove({}, { multi: true}, (err, rem)=>{
            if (err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }
            res.sendStatus(200, "OK")
            return;
        })
    });
    app.delete(BASE_API_URL+"/electricity-consumption-stats/:country/:year", (req,res)=>{
        var Country = req.params.country;   
        var Year = req.params.year;
        db.find({country: Country, year: parseInt(Year)}, {}, (err, filteredElectricity)=>{

            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredElectricity==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({country: Country, year: parseInt(Year)}, {}, (err, rem)=>{
                if (err){
                    res.sendStatus(500,"ERROR EN CLIENTE");
                    return;
                }
            
                res.sendStatus(200,"OK");
                return;
                
            });
        });
    });
    app.put(BASE_API_URL+"/electricity-consumption-stats", (req,res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });
        //PUT a un recurso en concreto
    app.put(BASE_API_URL + "/electricity-consumption-stats/:country/:year", (req, res) => {
        if(mal(req)){
            res.sendStatus(400,"BAD REQUEST");
            return;
        }
    var Country = req.params.country;
    var Year = req.params.year;
    var Body = req.body; 

    db.find({},function(err,filteredElectricity){
        if(err){
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }

        //Si no existe...

        filteredElectricity = filteredElectricity.filter((reg)=>
        {
            return (reg.country == Country && reg.year == Year);
        });
        if (filteredElectricity==0){
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //Si los campos han cambiado...

        if(Country != Body.country || Year != Body.year){
            res.sendStatus(400,"BAD REQUEST");
            return;
        }

        //Se hace el put
            
        db.update({$and:[{country: String(Country)}, {year: parseInt(Year)}]}, {$set: Body}, {},function(err, upd) {
            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
            }else{
                res.sendStatus(200, "UPDATED");
            }
        });
    });
});
}