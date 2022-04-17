<script>
	import Router from "svelte-spa-router";
    import Home from "./Home.svelte";
   
    //Elementos de Javi
    import PollutionStatsTable from "./pollution-stats/PollutionStatsTable.svelte";
    import PollutionStats from "./pollution-stats/PollutionStats.svelte";

    //Elementos de Fran
    import ElectricityStatsTable from "./electricity-consumption-stats/ElectricityStatsTable.svelte";
    import ElectricityStats from "./electricity-consumption-stats/ElectricityStats.svelte";
    
    const routes = {
        "/": Home,
        "/pollution-stats": PollutionStatsTable,
		"/pollution-stats/:country/:year": PollutionStats,     

        "/electricity-consumption-stats": ElectricityStatsTable,
		"/electricity-consumption-stats/:country/:year": ElectricityStats         
    };
</script>

<main>
	<Router {routes} />
</main>

