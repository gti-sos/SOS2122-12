<script>
    import {onMount} from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import {pop} from "svelte-spa-router";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    let Viewers = [];
    let Channels = [];
    let ejeX = [];
    async function getData(){
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "twitch-game-popularity.p.rapidapi.com",
                "X-RapidAPI-Key": "e84361b17bmsh9f691ab3194f15ep1ce792jsn82c3dafa3fe2"
            }
        };
        let res = await fetch("https://twitch-game-popularity.p.rapidapi.com/game?name=League%20of%20Legends&year=2020&month=08",options);
        await delay(2000);
        if (res.ok) {
            let json = await res.json();
            for(let i = 0; i<10; i++){
                
                //Nombre
                ejeX.push(json[i].Game);
                //Dato de viewers
                Viewers.push(json[i].Peak_viewers);
                //Dato de canales
                Channels.push(json[i].Peak_channels);
    
            }
            loadGraph();
        }else{
            ejeX = [];
            Viewers = [];
            Channels = [];
            loadGraph();
        }
    }
    
    async function loadGraph(){
        var chart = bb.generate({
            bindto: "#chart",
            
            data: {
                columns: [
                Viewers,
                    Channels
                ],
                types: {
                Viewers: "line",
                Channels: "area-spline"
                },
                labels:true,
            
                colors: {
                Viewers: "red",
                Channels: "green"
                }
            }
            
            });
        }
    
    
    onMount(getData);
    
    </script>
    <svelte:head>
        <script src="https://d3js.org/d3.v6.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.js" on:load="{loadGraph}"></script>
    
    </svelte:head>
    
    <main>
        <div>
            <h2>
              Análiticas
            </h2>
        </div>
        <div id="barChart" align="center"></div>
      
        
        <br>
        <Button outline color="dark" on:click="{()=>{
            pop();
        }}">
        Volver
        </Button>
        <br><br>
    </main>
    <style>
        main {
            text-align: center;
            padding: 30px;       
        }
    </style>