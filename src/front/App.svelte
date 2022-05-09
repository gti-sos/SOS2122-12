<script>
	import Router from "svelte-spa-router";
    import Home from "./Home.svelte";
    import Graph from "./Graph.svelte";
   
    //Elementos de Javi
    import PollutionStatsTable from "./pollution-stats/PollutionStatsTable.svelte";
    import PollutionStats from "./pollution-stats/PollutionStats.svelte";
    import GraphPollutionStats from "./pollution-stats/GraphPollution.svelte";

    //Elementos de Fran
    import ElectricityStatsTable from "./electricity-consumption-stats/ElectricityStatsTable.svelte";
    import ElectricityStats from "./electricity-consumption-stats/ElectricityStats.svelte";
    import GraphElectricityStats from "./electricity-consumption-stats/GraphElectricity.svelte";
    
    const routes = {
        "/info": Home,
        "/Graph/:country": Graph,


        "/pollution-stats": PollutionStatsTable,
		"/pollution-stats/:country/:year": PollutionStats,
        "/pollution-stats_graph": GraphPollutionStats,     

        "/electricity-consumption-stats": ElectricityStatsTable,
		"/electricity-consumption-stats/:country/:year": ElectricityStats,
        "/electricity-consumption-stats_graph": GraphElectricityStats       
    };
</script>

<main>
	<Router {routes} />
</main>

