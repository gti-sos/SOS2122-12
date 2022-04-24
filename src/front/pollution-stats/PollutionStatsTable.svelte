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

	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;

	let mP = 0;
	let nPollutions;

    onMount(getPollutionStats);
    async function getPollutionStats(){
        console.log("Fetching pollutions...."); 
		let page = `/api/v1/pollution-stats?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			page = page + `from=${from}&&`
		}
		if (to != null) {
			page = page + `to=${to}&&`
		}
        const res = await fetch(page);
        if(res.ok){
			let cPage = page.split(`limit=${limit}&&offset=${offset*10}`);
			mPFunction(cPage[0]+cPage[1]);
            const data = await res.json();
            pollutions = data;
			nPollutions = pollutions.length;
            console.log("Received entries: "+pollutions.length);
        }else{
			Errores(res.status);
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
			}); 
		if(res.ok){
			newPollution;
			getPollutionStats();
			window.alert("Entrada introducida con éxito");
		}else{
			Errores(res.status);
		}
    }
	async function BorrarPollution(countryDelete, yearDelete){
        console.log("Deleting pollution....");
        const res = await fetch("/api/v1/pollution-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(nPollutions==1){
					from = null;
					to = null;
				}
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
				from = null;
				to = null;
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
	async function Errores(code){
        let msg;
        if(code == 400){
            msg = "La fecha inicial no puede ser menor a la fecha final"
        }
		if(code = 404){
			msg = "No existe dato."
		}
		if(code == 409){
            msg = "El dato "+newPollution.country+"/"+newPollution.year+" ya existe"
        }
        window.alert(msg)
            return;
    }
	async function mPFunction(page){
		let num;
        const res = await fetch(page,
			{
				method: "GET"
			});
			if(res.ok){
				const data = await res.json();
				mP = Math.floor(data.length/10);
				if(mP === data.length/10){
					mP = mP-1;
				}
        }
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
				<th>Fecha inicial</th>
				<th>Fecha final</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="number" min="2000" bind:value="{from}"></td>
				<td><input type="number" min="2000" bind:value="{to}"></td>
				<td align="center"><Button outline color="dark" on:click="{()=>{
					if (from == null || to == null) {
						window.alert('Los campos fecha inicial y fecha final no pueden estar vacíos')
					}else{
						getPollutionStats();
					}
				}}">
					Buscar
					</Button>
				</td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = null;
					to = null;
					getPollutionStats();
					
				}}">
					Limpiar Búsqueda
					</Button>
				</td>
			</tr>
		</tbody>
	</Table>

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
				<td><input type="number" bind:value="{newPollution.year}"></td>
				<td><input type="number" bind:value="{newPollution.plastic_waste}"></td>
                <td><input type="number" bind:value="{newPollution.gaseous_waste}"></td>
                <td><input type="number" bind:value="{newPollution.collected_waste}"></td>
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
		</tbody>
	</Table>
	<div align="center">
		{#each Array(mP+1) as _,p}
		
			<Button outline color="secondary" on:click={()=>{
				offset = p;
				getPollutionStats();
			}}>{p} </Button>
		{/each}
	</div>
	<br>
	<div align="center">
		<Button outline color="success" on:click={LoadPollutions}>
			Cargar datos
		</Button>
		<Button outline color="danger" on:click={BorrarPollutions}>
			Borrar todo
		</Button>
	</div>
{/await}

</main>