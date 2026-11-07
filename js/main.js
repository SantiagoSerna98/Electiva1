// Datos propios para la comparación
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

    // Limpiar pantalla antes de consultar
    mensaje.innerText = "";
    mensaje.style.color = "black";
    resultadoDiv.style.display = "none";

    if (url === "") {
        mensaje.innerText = "Por favor ingresa una URL de perfil.json válida.";
        mensaje.style.color = "red";
        return;
    }

    mensaje.innerText = "Cargando datos del compañero...";

    // CORS Proxy para asegurar la lectura entre dominios externos
    var urlConProxy = "https://corsproxy.io/?" + encodeURIComponent(url);

    fetch(urlConProxy)
        .then(function(respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo obtener el JSON del perfil");
            }
            return respuesta.json();
        })
        .then(function(datosCompanero) {
            mensaje.innerText = "¡Conexión exitosa!";
            mensaje.style.color = "green";
            
            mostrarDatos(datosCompanero);
            compararGustos(datosCompanero);
        })
        .catch(function(error) {
            console.log("Error de conexión:", error);
            mensaje.innerText = "Error: No se pudo leer el archivo JSON de esa URL.";
            mensaje.style.color = "red";
        });
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
    var totalCategorias = 3; // Música, Comida, Pasatiempo

    // Normalizar a minúsculas para comparar cadenas
    var miMusica = misDatos.musica.toLowerCase();
    var suMusica = (datos.musica || datos.música || "").toLowerCase();

    var miComida = misDatos.comida.toLowerCase();
    var suComida = (datos.comida || "").toLowerCase();

    var miPasatiempo = misDatos.pasatiempo.toLowerCase();
    var suPasatiempo = (datos.pasatiempo || "").toLowerCase();

    // Verificación categoría por categoría
    if (miMusica === suMusica && miMusica !== "") {
        coincidencias.push("Ambos escuchan " + datos.musica);
    }
    if (miComida === suComida && miComida !== "") {
        coincidencias.push("Ambos disfrutan " + datos.comida);
    }
    if (miPasatiempo === suPasatiempo && miPasatiempo !== "") {
        coincidencias.push("Ambos comparten el pasatiempo: " + datos.pasatiempo);
    }

    // Porcentaje de compatibilidad
    var porcentaje = Math.round((coincidencias.length / totalCategorias) * 100);
    document.getElementById("porcentaje-texto").innerText = porcentaje + "%";

    // Mostrar lista visual de coincidencia
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