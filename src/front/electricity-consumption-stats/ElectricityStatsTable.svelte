<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let electricity_s = [];
	let newElectricity = {
		country: "",
		year: "",
		electricity_generation: "",
        electricity_consumption: "",
        per_capita_consumption: ""
	}
    onMount(getElectricityStats);
    async function getElectricityStats(){
        console.log("Fetching electricity_s....");
        const res = await fetch("/api/v1/electricity-consumption-stats"); 
        if(res.ok){
            const data = await res.json();
            electricity_s = data;
            console.log("Received entries: "+electricity_s.length);
        }
    }
	async function insertElectricity(){
        console.log("Inserting electricity...."+JSON.stringify(newElectricity));
        const res = await fetch("/api/v1/electricity-consumption-stats",
			{
				method: "POST",
				body: JSON.stringify(newElectricity),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getElectricityStats();
				window.alert("Entrada introducida con éxito");
			}); 
    }
	async function BorrarElectricity(countryDelete, yearDelete){
        console.log("Deleting electricity....");
        const res = await fetch("/api/v1/electricity-consumption-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getPollutionStats();
				window.alert("Entrada eliminada con éxito");
			});
    }
	async function BorrarElectricity_s(){
        console.log("Deleting electricity_s....");
        const res = await fetch("/api/v1/electricity-consumption-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getElectricityStats();
				window.alert("Entradas elimidas con éxito");
			});
    }
	async function LoadElectricity_s(){
        console.log("Loading electricity_s....");
        const res = await fetch("/api/v1/electricity-consumption-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getElectricityStats();
				window.alert("Entradas cargadas con éxito");
			});
    }
	
</script>

<main>
   
    <h1>Electricity manager</h1>

{#await electricity_s}
loading
	{:then electricity_s}
	

	<Table bordered>
		<thead>
			<tr>
				<th>País</th>
				<th>Año</th>
				<th>Generación de electricidad</th>
                <th>Consumo de electricidad</th>
                <th>Consumo per capita</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newElectricity.country}"></td>
				<td><input bind:value="{newElectricity.year}"></td>
				<td><input bind:value="{newElectricity.electricity_generation}"></td>
                <td><input bind:value="{newElectricity.electricity_consumption}"></td>
                <td><input bind:value="{newElectricity.per_capita_consumption}"></td>
				<td><Button outline color="primary" on:click="{insertElectricity}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each electricity_s as electricity}
				<tr>
					<td>{electricity.country}</td>
					<td>{electricity.year}</td>
					<td>{electricity.electricity_generation}</td>
                    <td>{electricity.electricity_consumption}</td>
                    <td>{electricity.per_capita_consumption}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/electricity-consumption-stats/${electricity.country}/${electricity.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarElectricity(electricity.country,electricity.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadElectricity_s}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarElectricity_s}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
{/await}

</main>