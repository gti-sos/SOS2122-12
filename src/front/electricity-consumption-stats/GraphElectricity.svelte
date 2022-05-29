<script>
  import * as c3 from "c3";
  import { onMount } from "svelte";
  
  
      const BASE_API_PATH = "/api/v2";
      let ElectricityData=[];
      let ElectricityCountryYear = [];
      let ElectricityGenerationData = [];
      let ElectricityConsumptionData = [];
      let PerCapitaConsumptionData = [];
   
      let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
      let cargados = false;
      async function loadGraph() {
          console.log("Fetching data...");
          const res = await fetch(BASE_API_PATH + "/electricity-consumption-stats");
          ElectricityData = await res.json();
          if (res.ok) {
            ElectricityData.forEach(stat => {
              ElectricityCountryYear.push(stat.country+"-"+stat.year);
              ElectricityGenerationData.push(parseInt(stat.electricity_generation));
              ElectricityConsumptionData.push(parseInt(stat.electricity_consumption));
              PerCapitaConsumptionData.push(parseInt(stat.per_capita_consumption));
              });
              cargados=true;
          }
          
      console.log("Electricity data: " + ElectricityData);
              
      var chart = c3.generate({
            
            data: {
                
                columns: [
                  ElectricityGenerationData,
                  ElectricityConsumptionData,
                  PerCapitaConsumptionData
                ],
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ElectricityCountryYear
                }
        }
        });
            }  
      onMount(loadGraph);
    </script>
    
    <svelte:head>
      <link href="/path/to/c3.css" rel="stylesheet">

      <!-- Load d3.js and c3.js -->
      <script src="/path/to/d3.v5.min.js" charset="utf-8"></script>
      <script src="/path/to/c3.min.js" on:load="{loadGraph}"></script>
    </svelte:head>
    
    <main>
      <div>
          <h2>
            Análisis de electricidad
          </h2>
        </div>
    
      <div id="chart"></div>
      
    
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