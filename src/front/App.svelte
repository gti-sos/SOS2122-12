<script>
	import Router from "svelte-spa-router";
    import Home from "./Home.svelte";
    import Graph from "./Graph.svelte";
   
    //Elementos de Javi
    import PollutionStatsTable from "./pollution-stats/PollutionStatsTable.svelte";
    import PollutionStats from "./pollution-stats/PollutionStats.svelte";
    import GraphPollutionStats from "./pollution-stats/GraphPollution.svelte";
    import GraphPollutionStatsJSCharting from "./pollution-stats/GraphPollutionJSCharting.svelte";
    import GraphInmigrant from "./pollution-stats/Inmigrant-stats.svelte";
    import GraphEmigrant from "./pollution-stats/Emmigrant-stats.svelte";

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
        "/pollution-stats_graph_jscharting": GraphPollutionStatsJSCharting,
        "/pollution-stats_inmigrant": GraphInmigrant, 
        "/pollution-stats_emigrant": GraphEmigrant,     

        "/electricity-consumption-stats": ElectricityStatsTable,
		"/electricity-consumption-stats/:country/:year": ElectricityStats,
        "/electricity-consumption-stats_graph": GraphElectricityStats       
    };
</script>

<main>
	<Router {routes} />
</main>

