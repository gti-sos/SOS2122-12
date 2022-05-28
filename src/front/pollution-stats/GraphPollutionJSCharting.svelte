<script>
    import { onMount } from "svelte";
    
    
        const BASE_API_PATH = "/api/v2";
        let WasteData=[];
        let WasteCountryYear = [];
        let PlasticWasteData = [];
        let GaseousWasteData = [];
        let CollectedWasteData = [];
     
            let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
        let cargados = false;
        async function loadGraph() {
            console.log("Fetching data...");
            const res = await fetch(BASE_API_PATH + "/pollution-stats");
            WasteData = await res.json();
            if (res.ok) {
              WasteData.forEach(stat => {
                WasteCountryYear.push(stat.country+"-"+stat.year);
                PlasticWasteData.push(parseInt(stat.plastic_waste));
                GaseousWasteData.push(parseInt(stat.gaseous_waste));
                CollectedWasteData.push(parseInt(stat.collected_waste));
                });
                cargados=true;
            }
            
        console.log("Waste data: " + WasteData);
                
        var chart = JSC.chart('chartDiv', {
          debug: true,
          type: 'horizontalColumn',
          title_label_text: 'Porcentajes de plastico, gas y residuos',
          xAxis: {
              categories: WasteCountryYear,
              crosshair: true
          },
          yAxis: {
              label_text: 'Valores(mt)'
          },
          series: [{
              name: 'Plástico',
              id: 's1',
              points: PlasticWasteData
          }, {
              name: 'Gas',
              points: GaseousWasteData
          }, {
              name: 'Residuos',
              points: CollectedWasteData
          }]
      });
        }
        onMount(loadGraph);
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