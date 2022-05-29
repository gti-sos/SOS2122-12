<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let errorC = null;
    
    //Pais
    let country = "spain";
    //Fechas
    let fechas = [];
    let fechas_pollution = [];
    let fechas_electricity = [];
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
        await fetch(`/api/v2/pollution-stats/loadInitialData`);
        await fetch(`/api/v2/electricity-consumption-stats/loadInitialData`);

        res_pollution = await fetch(`/api/v2/pollution-stats`);
        res_electricity = await fetch(`/api/v2/electricity-consumption-stats`);
        
        if (res_pollution.ok && res_electricity.ok) {
            const json_pollution = await res_pollution.json();
            const json_electricity = await res_electricity.json();
            for(let i=0;i<json_pollution.length;i++){
                fechas_pollution.push(json_pollution[i].country+"/"+json_pollution[i].year);
            }
            for(let i=0;i<json_electricity.length;i++){
                fechas_electricity.push(json_electricity[i].country+"/"+json_electricity[i].year);
            }
            guardaDatosPollution(json_pollution,json_electricity);
            guardaDatosElectricity(json_pollution,json_electricity);
            if(country==null){
                PlasticWasteData = [];
                GaseousWasteData = [];
                CollectedWasteData = [];
                electricityGenerationData = [];
                electricityConsumptionData = [];
                perCapitaConsumptionData = [];
            }
            console.log(fechas);
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
    
    async function guardaDatosPollution(json_pollution,json_electricity){
        for(let i = 0; i<json_pollution.length; i++){
            let fecha = json_pollution[i].country+"/"+json_pollution[i].year;
            fechas.push(fecha);
            if(fechas_electricity.includes(fecha)){
                let index = fechas_electricity.indexOf(fecha);
                electricityGenerationData.push(json_electricity[index].electricity_generation);
                electricityConsumptionData.push(json_electricity[index].electricity_consumption);
                perCapitaConsumptionData.push(json_electricity[index].per_capita_consumption);
            }else{
                electricityGenerationData.push(0);
                electricityConsumptionData.push(0);
                perCapitaConsumptionData.push(0);
            }
            GaseousWasteData.push(json_pollution[i].gaseous_waste);
            CollectedWasteData.push(json_pollution[i].collected_waste);
            PlasticWasteData.push(json_pollution[i].plastic_waste);
                
        }
    }

    async function guardaDatosElectricity(json_pollution,json_electricity){
        for(let i = 0; i<json_electricity.length; i++){
            let fecha = json_electricity[i].country+"/"+json_electricity[i].year;
            fechas.push(fecha);
            if(fechas_pollution.includes(fecha)){
                let index = fechas_pollution.indexOf(fecha);
                GaseousWasteData.push(json_pollution[index].gaseous_waste);
                CollectedWasteData.push(json_pollution[index].collected_waste);
                PlasticWasteData.push(json_pollution[index].plastic_waste);
            }else{
                GaseousWasteData.push(0);
                CollectedWasteData.push(0);
                PlasticWasteData.push(0);
            }
            electricityGenerationData.push(json_electricity[i].electricity_generation);
            electricityConsumptionData.push(json_electricity[i].electricity_consumption);
            perCapitaConsumptionData.push(json_electricity[i].per_capita_consumption);    
        }
    }
    async function loadGraph(){
        
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
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