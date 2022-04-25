<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';

    let pollution = {};

    let updatedCountry;
    let updatedYear;
    let updatedPlasticWaste;
    let updatedGaseousWaste;
    let updatedCollectedWaste;
    
    onMount(getPollutionStats);

    async function getPollutionStats(){
        console.log("Fetching pollutions....");
        const res = await fetch("/api/v1/pollution-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            pollution = data;
            updatedCountry = pollution.country;
            updatedYear = pollution.year;
            updatedPlasticWaste = pollution.plastic_waste;
            updatedGaseousWaste = pollution.gaseous_waste;
            updatedCollectedWaste = pollution.collected_waste;
        }else{
            Errores(res.status);
            pop();
        }
    }
    async function EditPollution(){
        console.log("Updating pollution...."+updatedCountry);
        const res = await fetch("/api/v1/pollution-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    plastic_waste: updatedPlasticWaste,
                    gaseous_waste: updatedGaseousWaste,
                    collected_waste: updatedCollectedWaste
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(){
                pop();
            }); 
    }
    async function Errores(code){
        
        let msg;
        if(code == 404){
            msg = "La entrada seleccionada no existe"
        }
        if(code == 400){
            msg = "La petición no está correctamente formulada"
        }
        if(code == 409){
            msg = "El dato introducido ya existe"
        }
        if(code == 401){
            msg = "No autorizado"
        }
        if(code == 405){
            msg = "Método no permitido"
        }
        window.alert(msg)
            return;
    }
</script>

<main>
    <h1>Editar entrada "{params.country}"/"{params.year}"</h1>
    {#await pollution}
    loading
        {:then pollution}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Contaminación por plástico</th>
                    <th>Contaminación por gas</th>
                    <th>Residuos de recogidos</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedPlasticWaste}"></td>
                    <td><input bind:value="{updatedGaseousWaste}"></td>
                    <td><input bind:value="{updatedCollectedWaste}"></td>
                    <td><Button outline color="primary" on:click="{EditPollution}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>