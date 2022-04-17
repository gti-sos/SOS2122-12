<script>
	import Router from "svelte-spa-router";
    import Home from "./Home.svelte";
   
    //Elementos de Javi
    import PollutionStatsTable from "./pollution-stats/PollutionStatsTable.svelte";
    import PollutionStats from "./pollution-stats/PollutionStats.svelte";
    
    const routes = {
        "/": Home,
        "/pollution-stats": PollutionStatsTable,
		"/pollution-stats/:country/:year": PollutionStats        
    };
</script>

<main>
	<Router {routes} />
</main>

