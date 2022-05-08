<script>
    import {onMount} from 'svelte';
    export let params = {};
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let errorC = null;
    
    //Pais
    let country = params.country;
    //Datos population levels
    let PlasticWasteData = [];
    let GaseousWasteData = [];
    let CollectedWasteData = [];

    //Datos electricity consumption
    let electricityGenerationData = [];
    let electricityConsumptionData = [];
    let perCapitaConsumptionData = [];

    async function getData(){
        let res_pollution;
        let res_electricity;

        if(country==null){
            res_pollution = await fetch(`/api/v2/pollution-stats`);
            res_electricity = await fetch(`/api/v2/electricity-consumption-stats`);
        }else{
            res_pollution = await fetch(`/api/v2/pollution-stats/${country}`);
            res_electricity = await fetch(`/api/v2/electricity-consumption-stats/${country}`);
        }
        if (res_pollution.ok && res_electricity.ok) {
            const json_pollution = await res_pollution.json();
            const json_electricity = await res_electricity.json();
            guardaDatosPollution(json_pollution);
            guardaDatosElectricity(json_electricity);
            if(country==null){
                PlasticWasteData = [];
                GaseousWasteData = [];
                CollectedWasteData = [];
                electricityGenerationData = [];
                electricityConsumptionData = [];
                perCapitaConsumptionData = [];
            }
            console.log(json_pollution);
            console.log(json_electricity);
            country = null;
            await delay(1000);
            loadGraph();
        }else{
            errorC = 404;
            PlasticWasteData = [];
            GaseousWasteData = [];
            CollectedWasteData = [];
            electricityGenerationData = [];
            electricityConsumptionData = [];
            perCapitaConsumptionData = [];
            await delay(1000);
            loadGraph();
        }
    }
    
    async function guardaDatosPollution(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].gaseous_waste);
                GaseousWasteData.push(aux);
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].collected_waste);
                CollectedWasteData.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].plastic_waste);
                PlasticWasteData.push(aux);
            }
            console.log(GaseousWasteData);
            console.log(CollectedWasteData);
            console.log(PlasticWasteData);
    }

    async function guardaDatosElectricity(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].electricity_generation);
                electricityGenerationData.push(aux);
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].electricity_consumption);
                electricityConsumptionData.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].per_capita_consumption);
                perCapitaConsumptionData.push(aux);
            }
            console.log(electricityGenerationData);
            console.log(electricityConsumptionData);
            console.log(perCapitaConsumptionData);
    }
    async function loadGraph(){
        
        Highcharts.chart('container', {
        
            title: {
                text: `Gráfico común a todo el grupo`
            },
        
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
        
            xAxis: {
                accessibility: {
                    title: {
                    text: 'Año'
                }
                }
            },
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                }
            },
            series: [
                //Pollution 
                {
                    name: 'Contaminación por gas',
                    data: GaseousWasteData
                },
                {
                    name: 'Contaminación por plástico',
                    data: PlasticWasteData
                },
                {
                    name: 'Residuos recogidos',
                    data: CollectedWasteData
                },

                //Electricity
                {
                    name: 'Generación de electricidad',
                    data: electricityGenerationData
                },
                {
                    name: 'Consumo de electricidad',
                    data: electricityConsumptionData
                },
                {
                    name: 'Consumo per capita',
                    data: perCapitaConsumptionData
                },
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

        {#if errorC === 404}
        <UncontrolledAlert  color="danger" >
            El país introducido no tiene registros para alguna de las APIS.
        </UncontrolledAlert>
        {/if}
        <br>
        
        <div align="center">
            <input type="text" bind:value="{country}">
            <Button outline color="info" on:click="{()=>{
                window.location.href = `/#/Graph/${country}`;
                location.reload();
                
            }}">
            Buscar
            </Button>
        </div>
        <br>
        <figure class="highcharts-figure">
            <div id="container"></div>
        </figure>
        <br>
        <br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>