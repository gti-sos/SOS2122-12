<script>
	import Router from "svelte-spa-router";
    import Home from "./Home.svelte";
    import Graph from "./Graph.svelte";
    import Integration from "./Integration.svelte";
    import Videos from "./Videos.svelte";
   
    //Elementos de Javi
    import PollutionStatsTable from "./pollution-stats/PollutionStatsTable.svelte";
    import PollutionStats from "./pollution-stats/PollutionStats.svelte";
    import GraphPollutionStats from "./pollution-stats/GraphPollution.svelte";
    import GraphPollutionStatsJSCharting from "./pollution-stats/GraphPollutionJSCharting.svelte";
    import GraphInmigrant from "./pollution-stats/Inmigrant-stats.svelte";
    import GraphPopulation from "./pollution-stats/Population.svelte";
    import GraphSports from "./pollution-stats/Sports.svelte";
    import GraphVacunation from "./pollution-stats/Vacunation.svelte";


    //Elementos de Fran
    import ElectricityStatsTable from "./electricity-consumption-stats/ElectricityStatsTable.svelte";
    import ElectricityStats from "./electricity-consumption-stats/ElectricityStats.svelte";
    import GraphElectricityStats from "./electricity-consumption-stats/GraphElectricity.svelte";
    import HighchartElectricity from "./electricity-consumption-stats/HighchartElectricity.svelte";
    import GraphEmigrant from "./electricity-consumption-stats/Emigrant.svelte";
    import GraphInternetPopulation from "./electricity-consumption-stats/InternetPopulation.svelte";
    import GraphVuelo from "./electricity-consumption-stats/ApiExterna.svelte";
    import GraphCovid from "./electricity-consumption-stats/ApiExterna2.svelte";

    const routes = {
        "/info": Home,
        "/analytics": Graph,
        "/integrations": Integration,
        "/about": Videos,

        "/pollution-stats": PollutionStatsTable,
		"/pollution-stats/:country/:year": PollutionStats,
        "/pollution-stats_graph": GraphPollutionStats,
        "/pollution-stats_graph_jscharting": GraphPollutionStatsJSCharting,
        "/pollution-stats_inmigrant": GraphInmigrant, 
        "/pollution-stats_population": GraphPopulation,
        "/pollution-stats_sport": GraphSports, 
        "/pollution-stats_vacuna": GraphVacunation, 

        "/electricity-consumption-stats": ElectricityStatsTable,
		"/electricity-consumption-stats/:country/:year": ElectricityStats,
        "/electricity-consumption-stats_graph": GraphElectricityStats,
        "/electricity-consumption-stats_graph_highchart": HighchartElectricity,
        "/electricity-consumption-stats_emigrant": GraphEmigrant,
        "/electricity-consumption-stats_internet_population": GraphInternetPopulation,
        "/electricity-consumption-stats_api_externa": GraphVuelo,
        "/electricity-consumption-stats_api_externa2": GraphCovid
    };
</script>

<main>
	<Router {routes} />
</main>

