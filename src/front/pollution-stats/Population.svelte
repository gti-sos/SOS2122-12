<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let errorC= 0;
    let fechas = [];
    let PlasticWasteData = [];
    let GaseousWasteData = [];
    let CollectedWasteData = [];
    let DeathData = [];
    let LifeData = [];
    let BirthData = [];

    async function getData(){
        await delay(1000);
        let res_pollution;
        let res_registrations;

        res_pollution = await fetch(`/api/v2/pollution-stats`);
        res_registrations = await fetch(`https://sos2122-10.herokuapp.com/api/v2/population-levels`);
        if (res_pollution.ok && res_registrations.ok) {
            const json = await res_pollution.json();
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
                    DeathData.push(json_reg[index].death_rate);
                    LifeData.push(json_reg[index].life_expectancy_birth);
                    BirthData.push(json_reg[index].birth_rate);
                    json_reg.splice(index, 1);
                }else{
                    DeathData.push(0);
                    LifeData.push(0);
                    BirthData.push(0);
                }
                PlasticWasteData.push(json[i].plastic_waste);
                GaseousWasteData.push(json[i].gaseous_waste);
                CollectedWasteData.push(json[i].collected_waste);
            }
            for(let i = 0; i<rangoMax; i++){
                fechas.push(json_reg[i].country+"/"+json_reg[i].year);
                DeathData.push(json_reg[i].death_rate);
                LifeData.push(json_reg[i].life_expectancy_birth);
                BirthData.push(json_reg[i].birth_rate);
                PlasticWasteData.push(0);
                GaseousWasteData.push(0);
                CollectedWasteData.push(0);
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
                type:'area'
            },
            title: {
                text: `Gráfica conjunta `
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
                    name: 'Contaminación por plástico',
                    data: PlasticWasteData
                },
                {
                    name: 'Contaminación por gas',
                    data: GaseousWasteData
                },
                {
                    name: 'Residuos recogidos',
                    data: CollectedWasteData
                },
                {
                    name: 'Tasa de mortalidad',
                    data: DeathData,
                },{
                    name: 'Esperanza de vida',
                    data: LifeData,
                },{
                    name: 'Tasa de natalidad',
                    data: BirthData,
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
        <h1 align="center">Gráficas integrada de contaminación ambiental y estudio de la población en la actualidad</h1>
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