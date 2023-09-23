console.log("JS integrado!");

//------------------------------------ DECLARACION DE VARIABLES

        //Cambio de tema
const dropdownBtn = document.querySelector(".dropdown_button");
const dropdownMenu = document.querySelector(".dropdown_menu");
        //Busqueda
const apiKey = "0vSJst7U3reZgjSC9fnJnx80gAGgTk0S";
const searchBar = document.getElementById("search_string");
const submitBtn = document.getElementById("search_submit");
const submitLupa = document.querySelector(".submitLupa");
const searchSuggs = document.getElementById("searchSuggs");
const suggSrchTerm1Txt = document.querySelector(".suggSrchTerm1Txt");
const suggSrchTerm2Txt = document.querySelector(".suggSrchTerm2Txt");
const suggSrchTerm3Txt = document.querySelector(".suggSrchTerm3Txt");
const resultsBar = document.querySelector(".results_bar");
const resultsTitle = document.querySelector(".results_title");
const suggsBoxes = document.querySelector(".suggsBoxes");
const suggsBox1Txt = document.querySelector(".suggsBox1Txt");
const suggsBox2Txt = document.querySelector(".suggsBox2Txt");
const suggsBox3Txt = document.querySelector(".suggsBox3Txt");
let searchGrid = document.getElementById("search_grid");
let foundSuggs;
let foundResults;
let autoResults;
        //Sugerencias
const suggCubeContainer = document.querySelectorAll(".suggCubeContainer");
const suggCubeHeaderTitle = document.querySelectorAll(".suggCubeHeaderTitle");
let suggBtn = document.querySelectorAll(".sugg_vm"); 
        //Tendencias
const trendsGifContainer = document.querySelectorAll(".trendsGifContainer");
const trendsGifBackdrop = document.querySelectorAll(".trendsGifBackdrop");
const trendsGifMarco = document.querySelectorAll(".trendsGifMarco");
const trendsElementMarcoTxt = document.querySelectorAll(".trendsElementMarcoTxt");

//------------------------------------ DECLARACION DE FUNCIONES

        //Para cargar los cubos de sugerencias aleatorias
async function getAndLoadRandomSuggestions() {
    var foundRandom = await fetch("https://api.giphy.com/v1/gifs/random?api_key=" + apiKey)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            console.log("Buscando gif aleatorio ^^^^")
            return data
        })
        .catch(error => {
            return error
        });
    return foundRandom;
};

        //Para el autocomplete en el modulo de busqueda
async function getAutocomplete(string) {
    autoResults = await fetch("https://api.giphy.com/v1/gifs/search/tags?q=" + string + "&api_key=" + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log("Buscando terminos autocompletados ^^^^")
            return data;
        })
        .catch(error => {
            return error;
        });
    suggSrchTerm1Txt.innerHTML = autoResults.data[0].name;
    suggSrchTerm2Txt.innerHTML = autoResults.data[1].name;
    suggSrchTerm3Txt.innerHTML = autoResults.data[2].name;
};

        //Para obtener terminos de busqueda sugeridos
async function getSearchSuggestions(term) {
    foundSuggs = await fetch('https://api.giphy.com/v1/tags/related/' + term + '?api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log("Buscando sugerencias de busqueda ^^^^")
            return data;
        })
        .catch(error => {
            return error;
        });
    suggsBox1Txt.innerHTML = foundSuggs.data[0].name;
    suggsBox2Txt.innerHTML = foundSuggs.data[1].name;
    suggsBox3Txt.innerHTML = foundSuggs.data[2].name;
};

        //Para obtener los resultados de busqueda
async function getSearchResults(search) {
    searchGrid.innerHTML = "";
    foundResults = await fetch('https://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log("Buscando resultados de busqueda ^^^^")
            return data;
        })
        .catch(error => {
            return error;
        })
    foundResults.data.forEach(item => {
        var image = document.createElement("img");
        image.setAttribute("src", item.images.fixed_height_downsampled.url);
        image.style.margin = "7px";
        image.style.height = "296px";
        searchGrid.appendChild(image);
    })
    searchGrid.removeChild(searchGrid.lastChild);
};

        //Para generar la grilla de tendencias
async function getTrends() {
    var foundTrends = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + "&limit=28")
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log("Buscando tendencias ^^^^")
        return data;
    })
    .catch(error => {
        return error;
    });
    for(let i = 0; i < foundTrends.data.length; i++) {
        var image = document.createElement("img");
        image.setAttribute("src", foundTrends.data[i].images.fixed_height_downsampled.url);
        trendsGifContainer[i].appendChild(image);
        trendsElementMarcoTxt[i].innerHTML = foundTrends.data[i].title;
        trendsGifContainer[i].onmouseover = () => {
            trendsGifBackdrop[i].style.display = "block";
            trendsGifMarco[i].style.display = "block";
        }
        trendsGifContainer[i].onmouseout = () => {
            trendsGifBackdrop[i].style.display = "none";
            trendsGifMarco[i].style.display = "none";
        }
    };
};

//------------------------------------------ FLUJO DEL PROGRAMA

        //Al cargar la pagina
window.onload = async () => {
    getTrends();
    for(let i = 0; i < 4; i++) {
        var randomResult = await getAndLoadRandomSuggestions();
        var randomPic = document.createElement("img")
        randomPic.setAttribute("src", randomResult.data.images.fixed_height_downsampled.url)
        randomPic.setAttribute("class", "fetchedImage")
        suggCubeContainer[i].appendChild(randomPic)
        suggCubeHeaderTitle[i].innerHTML = randomResult.data.title;
        sessionStorage.setItem("random-" + [i], randomResult.data.title)
        suggBtn[i].addEventListener("click", () => {
            getSearchResults(sessionStorage.getItem(sessionStorage.key(i)))
        });
    };
};

//EN EL HEADER:

        //Se presiona "elegir tema"
dropdownBtn.addEventListener("click", () => {
    if (dropdownMenu.style.display == "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    };
});

//EN LA BARRA DE BUSQUEDA:

        //Aparecen sugerencias al clickear la barra
searchBar.addEventListener("click", () => {
    searchBar.value = "";
    var colorCondition = window.getComputedStyle(dropdownMenu);
    var colorCondition2 = colorCondition.getPropertyValue("background");
    if (colorCondition2 == "rgb(230, 230, 230) none repeat scroll 0% 0% / auto padding-box border-box") {
        submitBtn.style.background = "#F7C9F3";
        submitBtn.style.color = "#110038";
        submitBtn.style.fontWeight = "900";
        submitBtn.style.border = "1px solid #110038";
        submitLupa.src = "/images/lupa.svg";
    } else {
        submitBtn.style.background = "#EE3EFE";
        submitBtn.style.color = "#FFFFFF";
        submitBtn.style.fontWeight = "900";
        submitBtn.style.border = "1px solid #110038";
        submitLupa.src = "/images/lupa_light.svg";
    }
});

        //Muestra los resultados de busqueda con la barra
submitBtn.addEventListener("click", async function() { 
    event.preventDefault();
    searchSuggs.style.display = "none";
    suggsBoxes.style.display = "flex";
    await getSearchSuggestions(searchBar.value);
    await getSearchResults(searchBar.value);
    resultsTitle.innerHTML = "Tu busqueda: " + searchBar.value + " (resultados: " + foundResults.data.length + ")";
    resultsBar.style.display = "block";
});

        //Muestra los resultados de busqueda con las sugerencias
suggsBox1Txt.addEventListener("click", async function() {
    searchBar.value = "";
    await getSearchResults(foundSuggs.data[0].name);
    resultsTitle.innerHTML = "Tu busqueda: " + foundSuggs.data[0].name + " (resultados: " + foundResults.data.length + ")";
    await getSearchSuggestions(suggsBox1Txt.innerHTML);
});

suggsBox2Txt.addEventListener("click", async function() {
    searchBar.value = "";
    await getSearchResults(foundSuggs.data[1].name);
    resultsTitle.innerHTML = "Tu busqueda: " + foundSuggs.data[1].name + " (resultados: " + foundResults.data.length + ")";
    await getSearchSuggestions(suggsBox2Txt.innerHTML);
});

suggsBox3Txt.addEventListener("click", async function() {
    searchBar.value = "";
    await getSearchResults(foundSuggs.data[2].name);
    resultsTitle.innerHTML = "Tu busqueda: " + foundSuggs.data[2].name + " (resultados: " + foundResults.data.length + ")";
    await getSearchSuggestions(suggsBox3Txt.innerHTML);
});

        //Muestra o busca las sugerencias de autocompletado

searchBar.addEventListener("keydown", () => {
    searchSuggs.style.display = "block";
    var autocomplete = getAutocomplete(searchBar.value);
});

suggSrchTerm1Txt.addEventListener("click", async function() {
    searchSuggs.style.display = "none";
    suggsBoxes.style.display = "flex";
    await getSearchSuggestions(autoResults.data[0].name);
    await getSearchResults(autoResults.data[0].name);
    resultsTitle.innerHTML = "Tu busqueda: " + autoResults.data[0].name + " (resultados: " + foundResults.data.length + ")";
    resultsBar.style.display = "block";
});

suggSrchTerm2Txt.addEventListener("click", async function() {
    searchSuggs.style.display = "none";
    suggsBoxes.style.display = "flex";
    await getSearchSuggestions(autoResults.data[1].name);
    await getSearchResults(autoResults.data[1].name);
    resultsTitle.innerHTML = "Tu busqueda: " + autoResults.data[1].name + " (resultados: " + foundResults.data.length + ")";
    resultsBar.style.display = "block";
});

suggSrchTerm3Txt.addEventListener("click", async function() {
    searchSuggs.style.display = "none";
    suggsBoxes.style.display = "flex";
    await getSearchSuggestions(autoResults.data[2].name);
    await getSearchResults(autoResults.data[2].name);
    resultsTitle.innerHTML = "Tu busqueda: " + autoResults.data[2].name + " (resultados: " + foundResults.data.length + ")";
    resultsBar.style.display = "block";
})