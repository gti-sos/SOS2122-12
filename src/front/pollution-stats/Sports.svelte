<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let Win = [];
    let Lose = [];
    let ejeX = [];
    async function getData(){
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "api-basketball.p.rapidapi.com",
                "X-RapidAPI-Key": "2b111c7892msh051caecf38760abp18d9d2jsn309e375150fc"
            }
        };
        let res = await fetch("https://api-basketball.p.rapidapi.com/standings?league=12&season=2019-2020",options);
        await delay(2000);
        if (res.ok) {
            let json = await res.json();
            json = json.data;
            for(let i = 0; i<10; i++){
                
                //Nombre
                ejeX.push(json[i].response.team.name);
                //Dato de partidos ganados
                Win.push(json[i].response.games.win.total);
                //Dato de partidos perdidos
                Lose.push(json[i].response.games.lose.total);
    
            }
            loadGraph();
        }else{
            Win = [];
            Lose = [];
            ejeX = [];
            loadGraph();
        }
    }
    
    async function loadGraph(){
        var chart = JSC.chart('chartDiv', {
          debug: true,
          type: 'horizontalColumn',
          title_label_text: 'Partidos ganados y perdidos',
          xAxis: {
              categories: ejeX,
              crosshair: true
          },
          yAxis: {
              label_text: 'Valores'
          },
          series: [{
              name: 'Partidos ganados',
              id: 's1',
              points: Win
          }, {
              name: 'Partidos perdidos',
              points: Lose
          }]
      });
    }
    
    onMount(getData);
    
    </script>
    <svelte:head>

        <script src="https://code.jscharting.com/latest/jscharting.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>
        <div>
            <h2>
              Análiticas
            </h2>
        </div>
        <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto;"></div>
      
        
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