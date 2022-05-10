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
            PlasticWasteData.push(stat.plastic_waste);
            GaseousWasteData.push(stat.gaseous_waste);
            CollectedWasteData.push(stat.collected_waste);
            });
            cargados=true;
        }
        
    console.log("Waste data: " + WasteData);
            
    Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Porcentajes de plastico, gas y residuos'
      },
      xAxis: {
          categories: WasteCountryYear,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Valores (mt)'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} mt</b></td></tr>',
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
          name: 'Plástico',
          data: PlasticWasteData
      }, {
          name: 'Gas',
          data: GaseousWasteData
      }, {
          name: 'Residuos',
          data: CollectedWasteData
      }]
  });
    }
    onMount(loadGraph);
  </script>
  
  <svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
  </svelte:head>
  
  <main>
    <div>
        <h2>
          Análiticas
        </h2>
      </div>
  
    <div>
        <figure class="highcharts-figure">
          <div id="container" />
          <p class="highcharts-description">
            Porcentajes de plastico, gas y residuos.
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