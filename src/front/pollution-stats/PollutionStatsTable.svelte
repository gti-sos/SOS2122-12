<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let pollutions = [];
	let newPollution = {
		country: "",
		year: "",
		plastic_waste: "",
        gaseous_waste: "",
        collected_waste: ""
	}
    onMount(getPollutionStats);
    async function getPollutionStats(){
        console.log("Fetching pollutions....");
        const res = await fetch("/api/v1/pollution-stats"); 
        if(res.ok){
            const data = await res.json();
            pollutions = data;
            console.log("Received entries: "+pollutions.length);
        }
    }
	async function insertPollution(){
        console.log("Inserting pollution...."+JSON.stringify(newPollution));
        const res = await fetch("/api/v1/pollution-stats",
			{
				method: "POST",
				body: JSON.stringify(newPollution),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getPollutionStats();
				window.alert("Entrada introducida con éxito");
			}); 
    }
	async function BorrarPollution(countryDelete, yearDelete){
        console.log("Deleting pollution....");
        const res = await fetch("/api/v1/pollution-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getPollutionStats();
				window.alert("Entrada eliminada con éxito");
			});
    }
	async function BorrarPollutions(){
        console.log("Deleting pollutions....");
        const res = await fetch("/api/v1/pollution-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getPollutionStats();
				window.alert("Entradas elimidas con éxito");
			});
    }
	async function LoadPollutions(){
        console.log("Loading pollutions....");
        const res = await fetch("/api/v1/pollution-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getPollutionStats();
				window.alert("Entradas cargadas con éxito");
			});
    }
	
</script>

<main>
   
    <h1>Pollution manager</h1>

{#await pollutions}
loading
	{:then pollutions}
	

	<Table bordered>
		<thead>
			<tr>
				<th>País</th>
				<th>Año</th>
				<th>Contaminación por plástico</th>
				<th>Contaminación por gas</th>
                <th>Recogida de residuos</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newPollution.country}"></td>
				<td><input bind:value="{newPollution.year}"></td>
				<td><input bind:value="{newPollution.plastic_waste}"></td>
                <td><input bind:value="{newPollution.gaseous_waste}"></td>
                <td><input bind:value="{newPollution.collected_waste}"></td>
				<td><Button outline color="primary" on:click="{insertPollution}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each pollutions as pollution}
				<tr>
					<td>{pollution.country}</td>
					<td>{pollution.year}</td>
					<td>{pollution.plastic_waste}</td>
                    <td>{pollution.gaseous_waste}</td>
                    <td>{pollution.collected_waste}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/pollution-stats/${pollution.country}/${pollution.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarPollution(pollution.country,pollution.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadPollutions}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarPollutions}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
{/await}

</main>