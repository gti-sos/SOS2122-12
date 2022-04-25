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

	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;
	let mP = 0;
	let nElectricity_s;

    onMount(getElectricityStats);
    async function getElectricityStats(){
        console.log("Fetching electricity_s....");
				let page = `/api/v1/electricity-consumption-stats?limit=${limit}&&offset=${offset*10}&&`;
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
            electricity_s = data;
			nElectricity_s = electricity_s.length;
            console.log("Received entries: "+electricity_s.length);
        }else{
			Errores(res.status);
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
			});
			if(res.ok){
				newElectricity;
				getElectricityStats();
				window.alert("Entrada introducida con éxito");
			}else{
				Errores(res.status);
			} 
    }
	async function BorrarElectricity(countryDelete, yearDelete){
        console.log("Deleting electricity....");
        const res = await fetch("/api/v1/electricity-consumption-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(nElectricity_s==1){
					from = null;
					to = null;
				}
				getElectricityStats();
				window.alert("Entrada eliminada con éxito");
			});
    }
	async function BorrarElectricity_s(){
        console.log("Deleting electricity_s....");
        const res = await fetch("/api/v1/electricity-consumption-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				from = null;
				to = null;
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
	async function Errores(code){
        let msg;
        if(code == 400){
            msg = "La fecha inicial no puede ser menor a la fecha final"
        }
		if(code = 404){
			msg = "No existe dato."
		}
		if(code == 409){
            msg = "El dato "+newElectricity.country+"/"+newElectricity.year+" ya existe"
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
   
    <h1>Electricity manager</h1>

{#await electricity_s}
loading
	{:then electricity_s}
	
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
						getElectricityStats();
					}
				}}">
					Buscar
					</Button>
				</td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = null;
					to = null;
					getElectricityStats();
					
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
				<th>Generación de electricidad</th>
                <th>Consumo de electricidad</th>
                <th>Consumo per capita</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newElectricity.country}"></td>
				<td><input type="number" bind:value="{newElectricity.year}"></td>
				<td><input type="number" bind:value="{newElectricity.electricity_generation}"></td>
                <td><input type="number" bind:value="{newElectricity.electricity_consumption}"></td>
                <td><input type="number" bind:value="{newElectricity.per_capita_consumption}"></td>
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
		</tbody>
	</Table>
	<div align="center">
		{#each Array(mP+1) as _,p}
		
			<Button outline color="secondary" on:click={()=>{
				offset = p;
				getElectricityStats();
			}}>{p} </Button>
		{/each}
	</div>
	<br>
	<div align="center">
		<Button outline color="success" on:click={LoadElectricity_s}>
			Cargar datos
		</Button>
		<Button outline color="danger" on:click={BorrarElectricity_s}>
			Borrar todo
		</Button>
	</div>
{/await}

</main>