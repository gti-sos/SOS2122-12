<script>
  import {onMount} from 'svelte';
  export let params = {};
  import Button from 'sveltestrap/src/Button.svelte';
  import {pop} from "svelte-spa-router";
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let electricityGenerationData = [];
  let electricityConsumptionData = [];
  let electricityPerCapitaData = [];
  let country = params.country
  
async function loadGraph(){
  var chart = new CanvasJS.Chart("chartContainer", {
animationEnabled: true,
title:{
  text: "Relación entre usuarios de internet y población urbana"
},
axisY: {
  title: "years",
  includeZero: true
},
legend: {
  cursor:"pointer",
  itemclick : toggleDataSeries
},
toolTip: {
  shared: true,
  content: toolTipFormatter
},
data: [{
  type: "bar",
  showInLegend: true,
  name: "electricity consumption",
  color: "black",
  dataPoints: electricityGenerationData

},
{
  type: "bar",
  showInLegend: true,
  name: "electricity consumption",
  color: "red",
  dataPoints: electricityConsumptionData

},
{
  type: "bar",
  showInLegend: true,
  name: "electricity consumption per capita",
  color: "blue",
  dataPoints: 
    electricityPerCapitaData
}]
});
chart.render();
function toolTipFormatter(e) {
var str = "";
var total = 0 ;
var str2 ;
for (var i = 0; i < e.entries.length; i++){
  var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
  total = e.entries[i].dataPoint.y + total;
  str = str.concat(str1);
}
str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
return (str2.concat(str));
}
function toggleDataSeries(e) {
if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
  e.dataSeries.visible = false;
}
else {
  e.dataSeries.visible = true;
}
chart.render();
}
}
onMount(loadGraph);
</script>
<svelte:head>
  <script src="https://canvasjs.com/assets/script/canvasjs.min.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
  <br>
      <h1 align="center">Gráficas de electricity</h1>
      
      <br>
      <div id="chartContainer" style="height: 370px; width: 100%;"></div>
      <br><br>

      <br>
      <Button outline color="dark" on:click="{()=>{
          pop();
      }}">
      Volver
      </Button>
      <br><br>
</main>