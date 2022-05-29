<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let Assists = [];
    let Turnovers = [];
    let ejeX = [];
    async function getData(){
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
                "X-RapidAPI-Key": "e84361b17bmsh9f691ab3194f15ep1ce792jsn82c3dafa3fe2"
            }
        };
        let res = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",options);
        await delay(2000);
        if (res.ok) {
            let json = await res.json();
            for(let i = 0; i<10; i++){
                
                //Nombre
                ejeX.push(json[i].team.name);
                //Dato de partidos ganados
                Assists.push(json[i].totalAssistsMade);
                //Dato de partidos perdidos
                Turnovers.push(json[i].totalTurnovers);
    
            }
            loadGraph();
        }else{
            ejeX = [];
            Assists = [];
            Turnovers = [];
            loadGraph();
        }
    }
    
    async function loadGraph(){
        var chart = bb.generate({
            bindto: "#barChart",
            axis: {
                x: {
                type: "category",
                categories: ejeX
                }
            },
            data: {
                type: "bar",
                labels:true,
                columns: [
                    Assists,
                    Turnovers
                ]
            },
            bar: {
                width: {
                ratio: 0.5
                }
            }
        });
    }
    
    onMount(getData);
    
    </script>
    <svelte:head>
        <script src="https://d3js.org/d3.v6.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>
        <div>
            <h2>
              Análiticas
            </h2>
        </div>
        <div id="barChart" align="center"></div>
      
        
        <br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>
    <style>
        main {
            text-align: center;
            padding: 30px;       
        }
    </style>