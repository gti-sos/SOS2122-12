<script>
    import { onMount } from "svelte";
    
    
        const BASE_API_PATH = "/api/v2";
        let electricityData=[];
        let electricityCountryYear = [];
        let electricityGenerationData = [];
        let electricityConsumptionData = [];
        let perCapitaConsumptionData = [];
     
            let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
        let cargados = false;

        async function loadGraphWithDelay() {
            setTimeout(loadGraph, 1000);
        }

        async function loadGraph() {
            console.log("Fetching data...");
            const res = await fetch(BASE_API_PATH + "/electricity-consumption-stats");
            electricityData = await res.json();
            if (res.ok) {
              electricityData.forEach(stat => {
                electricityCountryYear.push(stat.country+"-"+stat.year);
                electricityGenerationData.push(stat.electricity_generation);
                electricityConsumptionData.push(stat.electricity_consumption);
                perCapitaConsumptionData.push(stat.per_capita_consumption);
                });
                cargados=true;
            }
            
        console.log("Electricity data: " + electricityData);
                
        Highcharts.chart('container', {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Porcentajes de generación, consumo y consumo per capita de electricidad'
          },
          xAxis: {
              categories: electricityCountryYear,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Rainfall (mm)'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: [{
              name: 'Generación de electricidad',
              data: electricityGenerationData
          }, {
              name: 'Consumo de electricidad',
              data: electricityConsumptionData
          }, {
              name: 'Consumo per capita',
              data: perCapitaConsumptionData
          }]
      });
        }
        onMount(loadGraphWithDelay);
      </script>
      
      <svelte:head>
      <script src="https://code.highcharts.com/highcharts.js"></script>
      <script src="https://code.highcharts.com/modules/series-label.js"></script>
      <script src="https://code.highcharts.com/modules/exporting.js"></script>
      <script src="https://code.highcharts.com/modules/export-data.js"></script>
      <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraphWithDelay}"></script>
      </svelte:head>
      
      <main>
        <div>
            <h2>
              Analíticas
            </h2>
          </div>
      
        <div>
            <figure class="highcharts-figure">
              <div id="container" />
              <p class="highcharts-description">
                Porcentajes de generación, consumo y consumo per capita de electricidad.
              </p>
            </figure>
        </div>
        
      
        <div>
          {#if !cargados}
            <p class="error">{errorMsg}</p>
          {/if}
        </div>
      </main>
      
      <style>
        main {
            text-align: center;
            padding: 30px;       
        }
        p.error{
          color: red; 
          text-align:center;
          font-size: 20px;
          margin-top:80px;
        }
        
       
      </style>