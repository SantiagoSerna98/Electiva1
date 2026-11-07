var misDatos = {
    nombre: "Santiago Serna",
    musica: "Vallenato",
    comida: "Pasta Carbonara",
    pasatiempo: "Videojuegos"
};

function consultarPerfil() {
    var url = document.getElementById("urlCompanero").value.trim();
    var mensaje = document.getElementById("mensaje-estado");
    var resultadoDiv = document.getElementById("resultado-conexion");

    mensaje.innerText = "";
    mensaje.style.color = "black";
    resultadoDiv.style.display = "none";

    if (url === "") {
        mensaje.innerText = "Por favor ingresa una URL válida.";
        mensaje.style.color = "red";
        return;
    }

    mensaje.innerText = "Cargando datos del compañero...";

    // Intento 1: Petición HTTP directa
    fetch(url)
        .then(function(respuesta) {
            if (!respuesta.ok) {
                throw new Error("Petición directa no disponible");
            }
            return respuesta.json();
        })
        .then(function(datosCompanero) {
            procesarExito(datosCompanero, mensaje);
        })
        .catch(function() {
            // Intento 2: Petición por Proxy en caso de CORS o restricciones de servidor
            var proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
            
            fetch(proxyUrl)
                .then(function(respuestaProxy) {
                    if (!respuestaProxy.ok) {
                        throw new Error("Error en servidor proxy");
                    }
                    return respuestaProxy.json();
                })
                .then(function(datosCompaneroProxy) {
                    procesarExito(datosCompaneroProxy, mensaje);
                })
                .catch(function(errorFinal) {
                    console.log("Error final:", errorFinal);
                    mensaje.innerText = "Error: No se pudo leer el archivo JSON de esa URL.";
                    mensaje.style.color = "red";
                });
        });
}

function procesarExito(datos, elementoMensaje) {
    elementoMensaje.innerText = "¡Conexión exitosa!";
    elementoMensaje.style.color = "#00e676";
    mostrarDatos(datos);
    compararGustos(datos);
}

function mostrarDatos(datos) {
    document.getElementById("nombre-companero").innerText = datos.nombre || "No especificado";
    document.getElementById("musica-companero").innerText = datos.musica || datos.música || "No especificado";
    document.getElementById("comida-companero").innerText = datos.comida || "No especificado";
    document.getElementById("pasatiempo-companero").innerText = datos.pasatiempo || "No especificado";

    document.getElementById("resultado-conexion").style.display = "block";
}

function compararGustos(datos) {
    var coincidencias = [];
    var totalCategorias = 3;

    var miMusica = misDatos.musica.toLowerCase();
    var suMusica = (datos.musica || datos.música || "").toLowerCase();

    var miComida = misDatos.comida.toLowerCase();
    var suComida = (datos.comida || "").toLowerCase();

    var miPasatiempo = misDatos.pasatiempo.toLowerCase();
    var suPasatiempo = (datos.pasatiempo || "").toLowerCase();

    if (miMusica === suMusica && miMusica !== "") {
        coincidencias.push("Ambos escuchan " + (datos.musica || datos.música));
    }
    if (miComida === suComida && miComida !== "") {
        coincidencias.push("Ambos disfrutan " + datos.comida);
    }
    if (miPasatiempo === suPasatiempo && miPasatiempo !== "") {
        coincidencias.push("Ambos comparten el pasatiempo: " + datos.pasatiempo);
    }

    var porcentaje = Math.round((coincidencias.length / totalCategorias) * 100);
    document.getElementById("porcentaje-texto").innerText = porcentaje + "%";

    var ul = document.getElementById("lista-coincidencias");
    ul.innerHTML = "";

    if (coincidencias.length > 0) {
        for (var i = 0; i < coincidencias.length; i++) {
            var li = document.createElement("li");
            li.innerText = "✅ " + coincidencias[i];
            ul.appendChild(li);
        }
    } else {
        var liError = document.createElement("li");
        liError.innerText = "❌ Tienen gustos diferentes en las categorías evaluadas.";
        ul.appendChild(liError);
    }
}
