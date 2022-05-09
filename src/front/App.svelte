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
    
    const routes = {
        "/info": Home,
        "/Graph": Graph,

        "/pollution-stats": PollutionStatsTable,
		"/pollution-stats/:country/:year": PollutionStats,
        "/pollution-stats_graph": GraphPollutionStats,     

        "/electricity-consumption-stats": ElectricityStatsTable,
		"/electricity-consumption-stats/:country/:year": ElectricityStats         
    };
</script>

<main>
	<Router {routes} />
</main>

