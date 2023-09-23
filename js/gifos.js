console.log("Modulo de captura integrado!");

//------------------------------------ DECLARACION DE VARIABLES

        //Funciones del header
const dropdownBtn = document.querySelector(".dropdown_button");
const dropdownMenu = document.querySelector(".dropdown_menu");
const captureModuleLogo = document.querySelector(".logo");
        //Para activar modulo
const crearGifos = document.querySelector(".crear_guifos");
const captureModule = document.getElementById("captureModule");
const backArrow = document.querySelector(".backArrow");
const buttons = document.querySelector(".buttons");
        //Para modulo de captura
const apiKey = "0vSJst7U3reZgjSC9fnJnx80gAGgTk0S";
const prompt1 = document.getElementById("prompt1");
const prompt2 = document.getElementById("prompt2");
const prompt3 = document.getElementById("prompt3");
const prompt1Btn1 = document.querySelector(".prompt1Btn1");
const prompt1Btn2 = document.querySelector(".prompt1Btn2");
const prompt2HeaderTitle = document.querySelector(".prompt2HeaderTitle");
const xButton = document.getElementById("x-button");
const prompt2Stream = document.querySelector(".prompt2Stream");
const prompt2Video = document.querySelector(".prompt2Video");
const prompt3Stream = document.querySelector(".prompt3Stream");
const prompt3CopyLink = document.querySelector(".prompt3CopyLink");
const prompt3Download = document.querySelector(".prompt3Download");
const prompt3Listo = document.querySelector(".prompt3Listo")
const estado1Btns = document.querySelector(".estado1Btns");
const estado2Btns = document.querySelector(".estado2Btns");
const estado3Btns = document.querySelector(".estado3Btns");
const estado3Repeat = document.querySelector(".estado3Repeat")
const estado3Upload = document.querySelector(".estado3Upload");
const estado4Cancel = document.querySelector(".estado4Cancel");
const estado4Uploading = document.querySelector(".estado4Uploading");
const galleryGrid = document.getElementById("galleryGrid");
let recorder; 
let gif;
let gifUrl;
let preview = document.createElement("img");
let upload;

//----------------------------------- DECLARACION DE FUNCIONES

        //Para activar/desactivar modulo
function toggleCaptureModule() {
    if (captureModule.style.display == "block") {
        buttons.style.display = "flex";
        backArrow.style.display = "none";
        captureModule.style.display = "none";
    } else {
        buttons.style.display = "none";
        backArrow.style.display = "block";
        captureModule.style.display = "block";
    }
    var colorCondition = window.getComputedStyle(dropdownMenu);
    var colorCondition2 = colorCondition.getPropertyValue("background");
    if (colorCondition2 == "rgb(230, 230, 230) none repeat scroll 0% 0% / auto padding-box border-box") {
        captureModuleLogo.href = "/gifos.html";
    } else {
        captureModuleLogo.href = "/gifos_darkMode.html";
    }
};

        //Para usar modulo de captura
function getStreamAndRecord () { 
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {height: { max: 480 }}
    })
    .then(function(stream) {
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
        })
        recorder.startRecording();
        prompt2Video.srcObject = stream;
        prompt2Video.play();
    })
};

function uploadAndGetIdFromResponse() {
    var id = fetch("https://upload.giphy.com/v1/gifs?" + "api_key=" + apiKey, {method: "POST", body: upload})
        .then(response => {
            return response.json();
        }) 
        .then(data => {
            console.log("Respuesta a la subida:");
            console.log(data);
            return data;
        }) 
        .catch(error => {
            return error;
        });
    return id;
};

function GOTOventana2() {
    prompt2HeaderTitle.innerHTML = "Un Chequeo Antes de Empezar";
    prompt1.style.display = "none";
    prompt2.style.display = "block";
    prompt2Video.style.display = "block";
    estado1Btns.style.display = "flex";
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {height: { max: 480 }}
    })
    .then(function(stream) {
        prompt2Video.srcObject = stream;
        prompt2Video.play();
    })
};

async function retrieveGifGrid() {
    for (var i = 0; i < localStorage.length; i++) {
        var item = localStorage.getItem(localStorage.key(i));
        var found = await fetch("https://api.giphy.com/v1/gifs/" + item + "?api_key=" + apiKey)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("Iteracion de busqueda #" + i);
                console.log(data);
                return data;
            })
            .catch(error => {
                return error;
            })
        var image = document.createElement("img");
        image.setAttribute("src", found.data.images.original.url);
        galleryGrid.appendChild(image);
    };
};

//-------------------------------------- FLUJO DEL PROGRAMA

//AL ABRIR LA PAGINA
window.onload = retrieveGifGrid();

//EN EL HEADER:

        //Se presiona "elegir tema"
dropdownBtn.addEventListener("click", () => {
    if (dropdownMenu.style.display == "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    };
});

//PARA ACTIVAR MODULO DE CAPTURA

        //Se presiona "crear gifOS"
crearGifos.addEventListener("click", () => {
    toggleCaptureModule();
});

//AL USAR MODULO DE CAPTURA

//Ventana #1 - PERMISOS
        //Se presiona el boton "cancelar"
prompt1Btn1.addEventListener("click", () => {
    toggleCaptureModule();
})

        //Se presiona el boton "comenzar"
prompt1Btn2.addEventListener("click", () => {
    GOTOventana2();
});

        //`Se presiona el boton X
xButton.addEventListener("click", () => {
    window.location.reload();
})

//Ventana #2 - CAPTURA
//ESTADO #1 - Previsualizacion
        //Se presiona el boton "capturar"
estado1Btns.addEventListener("click", () => {
    prompt2HeaderTitle.innerHTML = "Capturando Tu Gifo";
    estado1Btns.style.display = "none";
    estado2Btns.style.display = "flex";
    getStreamAndRecord();
})

//ESTADO #2 - Captura
        //Se presiona el boton "listo"
estado2Btns.addEventListener("click", () => {
    prompt2HeaderTitle.innerHTML = "Vista Previa";
    estado2Btns.style.display = "none";
    prompt2Video.style.display = "none";
    estado3Btns.style.display = "flex";
    recorder.stopRecording(function() {
        var stream = prompt2Video.srcObject;
        var tracks = stream.getTracks();
        tracks.forEach(function(track) {
          track.stop();
        });
        gif = recorder.getBlob();
        gifUrl = URL.createObjectURL(gif);
        preview.setAttribute("src", gifUrl);
        preview.style.height = "434px";
        preview.style.transform = "translateX(13.5%)";
        preview.style.display = "block";
        prompt2Stream.appendChild(preview);
    });
});

//ESTADO #3 - Confirmacion
        //Se presiona "repetir captura"
estado3Repeat.addEventListener("click", () => {
    preview.style.display = "none";
    estado3Btns.style.display = "none";
    GOTOventana2();
});

        //Se presiona el boton "subir gifo"
estado3Upload.addEventListener("click", async function() {

//ESTADO #4 - Subida
//------------------------- Aqui va la barra de progreso -->
    prompt2HeaderTitle.innerHTML = "Subiendo Gifo";
    estado3Btns.style.display = "none";
    preview.style.display = "none";
    estado4Cancel.style.display = "block";
    estado4Uploading.style.display = "block";
    upload = new FormData();
    upload.append("file", gif, "usergif.gif");
    var id = await uploadAndGetIdFromResponse();
    localStorage.setItem("gif" + id.data.id, id.data.id);
    galleryGrid.innerHTML = "";
    retrieveGifGrid();
    estado4Cancel.style.display = "none";
    estado4Uploading.style.display = "none";
    prompt2.style.display = "none";
    prompt3.style.display = "block";
    preview.style.height = "190px";
    preview.style.transform = "translateX(39px)";
    prompt3Stream.appendChild(preview);
    preview.style.display = "block";
});

        //Se presiona el boton "cancelar"
estado4Cancel.addEventListener("click", () => {
    window.location.reload();
})

//VENTANA #3 - Exito
        //Se presiona el boton "copiar"
prompt3CopyLink.addEventListener("click", () => {
    alert("La direccion del gif es: " + gifUrl)
})

        //Se presiona el boton "descargar"
prompt3Download.addEventListener("click", () => {
    var download = recorder.getBlob(); 
    invokeSaveAsDialog(download);
});
        //Se presiona el boton "listo"
prompt3Listo.addEventListener("click", ()=> {
    window.location.reload();
});