<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    let electricity = {};
    let updatedCountry;
    let updatedYear;
    let updatedElectricityGeneration;
    let updatedElectricityConsumption;
    let updatedPerCapitaConsumption;
    onMount(getElectricityStats);
    async function getElectricityStats(){
        console.log("Fetching electricity....");
        const res = await fetch("/api/v1/electricity-consumption-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            electricity = data;
            updatedCountry = electricity.country;
            updatedYear = electricity.year;
            updatedElectricityGeneration = electricity.electricity_generation;
            updatedElectricityConsumption = electricity.electricity_consumption;
            updatedPerCapitaConsumption = electricity.per_capita_consumption;
        }else{
            Errores(res.status);
            pop();
        }
    }
    async function EditElectricity(){
        console.log("Updating electricity...."+updatedCountry);
        const res = await fetch("/api/v1/electricity-consumption-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    electricity_generation: updatedElectricityGeneration,
                    electricity_consumption: updatedElectricityConsumption,
                    per_capita_consumption: updatedPerCapitaConsumption
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
    {#await electricity}
    loading
        {:then electricity}
        
    
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
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedElectricityGeneration}"></td>
                    <td><input bind:value="{updatedElectricityConsumption}"></td>
                    <td><input bind:value="{updatedPerCapitaConsumption}"></td>
                    <td><Button outline color="primary" on:click="{EditElectricity}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>