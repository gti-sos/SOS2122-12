<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let Cases = [];
    let Deaths = [];
    let ejeX = [];
    async function getData(){
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com",
                "X-RapidAPI-Key": "2b111c7892msh051caecf38760abp18d9d2jsn309e375150fc"
            }
        };
        let res = await fetch("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/africa",options);
        await delay(2000);
        if (res.ok) {
            let json = await res.json();
            for(let i = 0; i<10; i++){
                
                //Nombre
                ejeX.push(json[i].Country);
                //Dato de casos
                Cases.push(json[i].TotalCases);
                //Dato de muertes
                Deaths.push(json[i].TotalDeaths);
    
            }
            loadGraph();
        }else{
            ejeX = [];
            Cases = [];
            Deaths = [];
            loadGraph();
        }
    }
    
    async function loadGraph(){
        var ctx = document.getElementById("myChart").getContext("2d");
        var chart = new Chart(ctx, {
            type: "line",
            responsive: true,
            maintainAspectRatio: false,
            data: {
                labels: ejeX,
                datasets: [
                    {
                        label: "Casos",
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        pointBackgroundColor: 'rgb(255, 99, 132)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(255, 99, 132)',
                        data: Cases,
                    },
                    {
                        label: "Muertes",
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        pointBackgroundColor: 'rgb(54, 162, 235)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(54, 162, 235)',
                        data: Deaths,
                    },
                ],
            }
        });
    }
    
    onMount(getData);
    
    </script>
    <svelte:head>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>
        <div>
            <h2>
              Análiticas
            </h2>
        </div>
        <div id="chartBox" >
            <canvas id="myChart" align="center"></canvas>
        </div>
      
        
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