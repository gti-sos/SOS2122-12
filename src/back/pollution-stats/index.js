const BASE_API_URL = "/api/v2";
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19481675/UVyn2JiB";


var pollutions = [
    {
        country:"usa",
        year:2019,
        plastic_waste:17792,
        gaseous_waste: 5036.047,
        collected_waste:323

    },
    {
        country:"españa",
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

module.exports.register = (app, db) => {

    app.get(BASE_API_URL+ "/pollution-stats/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL); 
    
    });
    app.get(BASE_API_URL + "/pollution-stats/loadInitialData", (req, res)=>{
        
        db.find({}, function(err,filteredPollutions){

            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            if(filteredPollutions==0){
                for(var i = 0; i<pollutions.length;i++){
                    db.insert(pollutions[i]);
                }
                res.sendStatus(200,"OK");
                return;
            }else{
                res.sendStatus(200, "Ya inicializados")
            }
        });
    
    });
    
    app.get(BASE_API_URL+ "/pollution-stats",(req,res)=>{
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
    
        db.find({},function(err, filteredPollutions){
    
            if(err){
                res.sendStatus(500, "CLIENT ERROR");  
                return; 
            }

            // Año
            if(year != null){
                var filteredPollutions = filteredPollutions.filter((reg)=>
                {
                    return (reg.year == year);
                });
                if (filteredPollutions==0){
                    res.sendStatus(404, "NOT FOUND"); 
                    return;    
                }
            }

            // From To
            if(from != null && to != null){
                filteredPollutions = filteredPollutions.filter((reg)=>
                {
                    return (reg.year >= from && reg.year <=to);
                });
    
                if (filteredPollutions==0){
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }    
            }
            
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredPollutions = pagination(req,filteredPollutions);
            }
            filteredPollutions.forEach((element)=>{
                delete element._id;
            });
            res.send(JSON.stringify(filteredPollutions,null,2));
        }); 
    
    });
    app.get(BASE_API_URL+"/pollution-stats/:country", (req,res)=>{
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
    
        db.find({}, function(err,filteredPollutions){
                
            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }
    
            filteredPollutions = filteredPollutions.filter((reg)=>
            {
                return (reg.country == country);
            });

            // Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;
    
            //Comprobamos si from es mas pequeño o igual a to
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
    
    
            if(from != null && to != null && from<=to){
                filteredPollutions = filteredPollutions.filter((reg)=>
                {
                   return (reg.year >= from && reg.year <=to);
                }); 
                
            }
        
            if (filteredPollutions==0){
                res.sendStatus(404, "NOT FOUND");
                return;
            }
            
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredPollutions = pagination(req,filteredPollutions);
            }
            filteredPollutions.forEach((element)=>{
                delete element._id;
            });
            res.send(JSON.stringify(filteredPollutions,null,2));
        });
    });
    app.get(BASE_API_URL+"/pollution-stats/:country/:year", (req,res)=>{
        var pollutionCountry =req.params.country
        var pollutionYear = req.params.year
    
        db.find({},function(err, filteredPollutions){
    
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
    
            filteredPollutions = filteredPollutions.filter((reg)=>
            {
                return (reg.country == pollutionCountry && reg.year == pollutionYear);
            });
    
            if (filteredPollutions==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            
            //Pagination
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredPollutions = pagination(req,filteredPollutions);
                res.send(JSON.stringify(filteredPollutions,null,2));
            }
            filteredPollutions.forEach((element)=>{
                delete element._id;
            });
            res.send(JSON.stringify(filteredPollutions[0],null,2));
        });
    });
    function mal(pollution){
        return (Object.keys(pollution.body).length != 5 ||
        pollution.body.country == null ||
        pollution.body.year == null ||
        pollution.body.plastic_waste == null ||
        pollution.body.gaseous_waste == null ||
        pollution.body.collected_waste == null);
    };
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
    
    app.post(BASE_API_URL+ "/pollution-stats",(req,res)=>{
        if(mal(req)){
            res.sendStatus(400,"BAD REQUEST");
        }
        else{
            db.find({},function(err,filteredPollutions){
    
                if(err){
                    res.sendStatus(500, "CLIENT ERROR");
                    return;
                   
                }
    
                filteredPollutions = filteredPollutions.filter((reg)=>
                {
                    return(req.body.country == reg.country && req.body.year == reg.year)
                })
            
                if(filteredPollutions.length != 0){
                    res.sendStatus(409, "CONFLICT");
                }else{
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            });
        }
    });
    app.post(BASE_API_URL+"/pollution-stats/:country",(req,res)=>{
        res.sendStatus(405,"METHOD NOT FOUND"); 
    });
    app.delete(BASE_API_URL+"/pollution-stats", (req,res)=>{
        db.remove({}, { multi: true}, (err, rem)=>{
            if (err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }
            res.sendStatus(200, "OK");
            return;
        })
    });
    app.delete(BASE_API_URL+"/pollution-stats/:country/:year", (req,res)=>{
        var Country = req.params.country;  
        var Year = req.params.year; 
    
        db.find({country: Country, year: parseInt(Year)}, {}, (err, filteredPollutions)=>{

            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredPollutions==0){
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
    
    app.put(BASE_API_URL+"/pollution-stats", (req,res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });
    app.put(BASE_API_URL+"/pollution-stats/:country/:year",(req,res)=>{
        if(mal(req)){
            res.sendStatus(400,"BAD REQUEST");
            return;
        }
        var Country = req.params.country;
        var Year = req.params.year;
        var Body = req.body; 
        
        db.find({},function(err,filteredPollutions){
            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            //Si no existe...

            filteredPollutions = filteredPollutions.filter((reg)=>
            {
                return (reg.country == Country && reg.year == Year);
        });
        if (filteredPollutions==0){
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

};
