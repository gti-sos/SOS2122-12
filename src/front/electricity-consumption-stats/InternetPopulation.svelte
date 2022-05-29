<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let errorC= 0;
    let fechas = [];
    let ElectricityGenerationData = [];
    let ElectricityConsumptionData = [];
    let PerCapitaConsumptionData = [];
    let populationData = [];
    let internetData  = [];
    let urbanData  = [];

    async function getData(){
        await delay(1000);
        let res_electricity;
        let res_registrations;

        res_electricity = await fetch(`/api/v2/electricity-consumption-stats`);
        res_registrations = await fetch(`/remoteInternetPopulation`);
        if (res_electricity.ok && res_registrations.ok) {
            const json = await res_electricity.json();
            const json_reg = await res_registrations.json();
            let rangoMax = 5;
            const country_years = [];
            for(let i = 0; i<json_reg.length;i++){
                country_years.push(json_reg[i].country+"/"+json_reg[i].year);
            }
            for(let i = 0; i<rangoMax; i++){
                let fecha = json[i].country+"/"+json[i].year;
                fechas.push(fecha);
                if(country_years.includes(fecha)){
                    let index = country_years.indexOf(fecha);
                    populationData.push(json_reg[index].population_growth);
                    internetData.push(json_reg[index].internet_users);
                    urbanData.push(json_reg[index].urban_population);
                    json_reg.splice(index, 1);
                }else{
                    populationData.push(0);
                    internetData.push(0);
                    urbanData.push(0);
                }
                ElectricityGenerationData.push(json[i].electricity_generation);
                ElectricityConsumptionData.push(json[i].electricity_consumption);
                PerCapitaConsumptionData.push(json[i].per_capita_consumption);
            }
            for(let i = 0; i<rangoMax; i++){
                fechas.push(json_reg[i].country+"/"+json_reg[i].year);
                populationData.push(json_reg[i].population_growth);
                internetData.push(json_reg[i].internet_users);
                urbanData.push(json_reg[i].urban_population);
                ElectricityGenerationData.push(0);
                ElectricityConsumptionData.push(0);
                PerCapitaConsumptionData.push(0);
            }
            console.log(fechas);
            console.log(json_reg);
            await delay(1000);
            loadGraph();
        }else{
            errorC = 200.4;
            await delay(1000);
            loadGraph();
        }
    }
    
    async function loadGraph(){
        
        Highcharts.chart('container', {
        
            chart: {
                type:'column'
            },
            title: {
                text: `Gráfica conjunta 2`
            },
        
            yAxis: {
                min:0,
                title: {
                    text: 'Valor'
                }
            },
        
            xAxis: {
                categories: fechas,
                title: {
                    text: 'Ciudad/Año'
                },
                crosshair: true
            },
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
        
            series: [{
                    name: 'Generación de electricidad',
                    data: ElectricityGenerationData
                },
                {
                    name: 'Consumo de electricidad',
                    data: ElectricityConsumptionData
                },
                {
                    name: 'Consumo per capita de electricidad',
                    data: PerCapitaConsumptionData
                },
                {
                    name: 'population growth',
                    data: populationData,
                },{
                    name: 'internet users',
                    data: internetData,
                },{
                    name: 'urban population',
                    data: urbanData,
                }
            ]
        
        });
    }
    
    onMount(getData);
    
    </script>
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/series-label.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>
        {#if errorC === 200.4}
        <br>
        <UncontrolledAlert  color="danger" >
			ERROR EN LA SOLICITUD A LOS DATOS
        </UncontrolledAlert>
        {/if}
        <br>
        <h1 align="center">Gráficas integrada de consumo de electricidad y de internet population</h1>
        <br>
        <figure class="highcharts-figure">
            <div id="container"></div>
        </figure>
        <br><br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>