// Número de obras por página
const obrasPerPage = 4;

// Ruta al archivo JSON de datos
const dataUrl = 'obras.json';

// Variable para almacenar la página actual
let currentPage = 1;

// Arreglo para almacenar los datos de las obras
let obrasData = [];

// Variable para almacenar la noticia actual
let currentNews = null;

let searchResults = []; // Variable global para almacenar los resultados de búsqueda

let selectedObraId = null; // Variable global para almacenar el ID de la obra seleccionada

let searchInputValue = ''; // Agregar una variable global para el estado del campo de búsqueda


// Obtiene la página actual almacenada en el localStorage o usa 1 como valor predeterminado
currentPage = localStorage.getItem('currentPage') || 1;

// Elementos del DOM
const obrasContainer = document.getElementById('obras');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const newsDetails = document.getElementById('newsDetails');
const detailTitle = document.getElementById('detailTitle');
const detailImage = document.getElementById('detailImage');
const detailDescription = document.getElementById('detailDescription');

// Obtiene el parámetro 'id' de la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Si se proporciona un 'id' en la URL, muestra los detalles de una obra
if (id !== null) {
    // Cargar detalles de la obra desde el archivo JSON
    fetch('obras.json')
        .then((response) => response.json())
        .then((data) => {
            const obra = data.find((item) => item.id == id);
            if (obra) {
                detailTitle.textContent = obra.titulo;
                detailImage.src = obra.imagen;
                detailDescription.textContent = obra.descripcion;

                // Agregar los detalles adicionales
                const detailDetails = document.createElement('p');
                detailDetails.textContent = obra.detalles;
                detailDescription.appendChild(detailDetails);
            } else {
                detailTitle.textContent = 'Obra no encontrada';
            }
        })
        .catch((error) => {
            console.error('Error al cargar datos: ', error);
        });
} else {
    detailTitle.textContent = 'Parámetro "id" no especificado';
}

// Función para cargar los datos de las obras desde el archivo JSON
function loadObrasData() {
    fetch(dataUrl)
        .then((response) => response.json())
        .then((data) => {
            obrasData = data;
            renderObras();
        })
        .catch((error) => {
            console.error('Error al cargar datos: ', error);
        });
}

// Función para renderizar las obras en la página
// Función para renderizar las obras en la página
function renderObras() {
    const startIndex = (currentPage - 1) * obrasPerPage;
    const endIndex = startIndex + obrasPerPage;
    const obrasToDisplay = obrasData.slice(startIndex, endIndex);

    obrasContainer.innerHTML = '';

    obrasToDisplay.forEach((obra, index) => {
        const obraElement = document.createElement('div');
        obraElement.classList.add('obra');
        obraElement.innerHTML = `
            <h2>${obra.titulo}</h2>
            <img src="${obra.imagen}" alt="${obra.titulo}">
            <p>${obra.descripcion}</p>
            <span class="fecha-publicacion ${obra.nueva ? 'hidden' : ''}">${obra.fechaPublicacion}</span>
            <button class="detailsButton" data-index="${obra.id}">Ver Detalles</button>
        `;

        // Verifica si el aviso temporal ya se mostró para esta obra
        const avisoMostrado = localStorage.getItem(`avisoMostrado_${obra.id}`);
        const avisoNuevoMostrado = localStorage.getItem(`avisoNuevoMostrado_${obra.id}`);

        if (obra.nueva && (!avisoNuevoMostrado || avisoNuevoMostrado !== "true")) {
            const avisoTemporal = document.createElement('div');
            avisoTemporal.classList.add('aviso-temporal');
            avisoTemporal.textContent = '¡Nuevo!';
            obraElement.appendChild(avisoTemporal);

            setTimeout(() => {
                avisoTemporal.style.opacity = 0;
                setTimeout(() => {
                    avisoTemporal.remove();
                }, 500);

                const fechaPublicacion = obraElement.querySelector('.fecha-publicacion');
                fechaPublicacion.classList.remove('hidden');

                localStorage.setItem(`avisoNuevoMostrado_${obra.id}`, "true");
            }, 2000);
        } else if (avisoNuevoMostrado === "true") {
            const fechaPublicacion = obraElement.querySelector('.fecha-publicacion');
            fechaPublicacion.classList.remove('hidden');
        }

       // Event Listener para cargar detalles al hacer clic en un botón de obra
obrasContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('detailsButton')) {
        const obraId = event.target.getAttribute('data-index'); // Obtén el ID de la obra directamente

        if (obraId) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace

            // Oculta los elementos relacionados con la información de la obra antes de la redirección
            obrasContainer.innerHTML = '';

            // Realiza la redirección a la página de detalles
            redirectToDetailsPage(obraId);
        }
    }
});


        obrasContainer.appendChild(obraElement);
    });

    renderPagination();
}


function resetAvisoById(obraId) {
    localStorage.removeItem(`avisoNuevoMostrado_${obraId}`);
}

// // Para restablecer el aviso de una obra específica, llama a la función con su ID
// const obraIdToReset = 1; // Reemplaza con el ID de la obra que deseas restablecer
// const obra1 = 2;
// const obra2 = 3;
// const obra3 = 4;
// const obra4 = 5;
// const obra5 = 6;
// const obra8 = 7;
// const obra7 = 8;

// resetAvisoById(obraIdToReset);
// resetAvisoById(obra1);
// resetAvisoById(obra2);
// resetAvisoById(obra3);
// resetAvisoById(obra4);
// resetAvisoById(obra5);
// resetAvisoById(obra8);
// resetAvisoById(obra7);



// Función para renderizar la paginación
function renderPagination() {
    const totalPages = Math.ceil(obrasData.length / obrasPerPage);
    const paginationButtons = [];

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            renderObras();
        });

        if (i === currentPage) {
            button.classList.add('active'); // Agregar la clase "active" al botón de la página actual
        }
        paginationButtons.push(button);
    }

    paginationContainer.innerHTML = '';
    paginationButtons.forEach((button) => {
        paginationContainer.appendChild(button);
    });
}

// Función para mostrar detalles de una obra

function showDetails(obraId) {

    // Borra el valor almacenado en el localStorage para que el campo de búsqueda esté vacío al volver atrás
    localStorage.removeItem('searchInputValue');
    // Busca la obra en el arreglo 'obrasData' por su 'id'
    window.location.href = `detalles/detalle.html?id=${obraId}`;
    const obra = obrasData.find((item) => item.id == obraId);

    if (obra) {
        detailTitle.textContent = obra.titulo;
        detailImage.src = obra.imagen;
        detailDescription.textContent = obra.descripcion;

        // Agregar los detalles adicionales (si los tienes) de la misma manera que los demás detalles.
        const detailDetails = document.createElement('p');
        detailDetails.textContent = obra.detalles;
        detailDescription.appendChild(detailDetails);

        newsDetails.classList.remove('hidden');
        // Desplaza la página hacia los detalles
        newsDetails.scrollIntoView({ behavior: 'smooth' });

          // Redirige a la página de detalles con el ID en la URL
         
    } else {
        detailTitle.textContent = 'Obra no encontrada';
    }
}



// Event Listener para cargar detalles al hacer clic en un botón de obra
obrasContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('detailsButton')) {
        const obraId = event.target.getAttribute('data-index'); // Obtén el ID de la obra directamente

        if (obraId) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            showDetails(obraId);
        }
    }
});




// Función para buscar obras por títulos parciales o descripciones
function search(query) {
    let queryNormalizado = quitarAcentos(query);
    queryNormalizado = queryNormalizado.trim(); // Quitar espacios en blanco

    // Filtrar los elementos cuyos títulos o descripciones normalizados contienen la consulta normalizada
    const resultados = obrasData.filter(item => {
        const tituloNormalizado = quitarAcentos(item.titulo);
        const descripcionNormalizada = quitarAcentos(item.descripcion);

        return (
            tituloNormalizado.includes(queryNormalizado) || // Coincidencia en el título
            descripcionNormalizada.includes(queryNormalizado) // Coincidencia en la descripción
        );
    });

    return resultados;
}

// Función para quitar los acentos
function quitarAcentos(texto) {
    return texto
        .normalize("NFD")  // Normalizar caracteres a forma NFD (Unicode descompuesto)
        .replace(/[\u0300-\u036f]/g, "")  // Quitar diacríticos
        .toLowerCase();  // Convertir todo a minúsculas
}

// Función para manejar la búsqueda en tiempo real
function handleSearchInput() {
    const query = searchInput.value;
    searchInputValue = query; // Actualiza la variable global con el valor del campo de búsqueda
    searchResults = search(query);

    // Guardar el valor actual del campo de búsqueda en el localStorage
    localStorage.setItem('searchInputValue', query);

    // Actualizar la visualización de los resultados de búsqueda
    renderSearchResults(searchResults);
}

// Función para mostrar los resultados de búsqueda
function renderSearchResults(resultados) {
    const obrasContainer = document.getElementById('obras');

    // Limpia el contenedor de resultados
    obrasContainer.innerHTML = '';

    if (resultados.length === 0) {
        // Si no se encontraron resultados, puedes mostrar un mensaje o realizar alguna acción específica.
        const mensajeNoResultados = document.createElement('p');
        mensajeNoResultados.textContent = 'No se encontraron resultados.';
        obrasContainer.appendChild(mensajeNoResultados);
    } else {
        resultados.forEach((obra, index) => {
            const obraElement = document.createElement('div');
            obraElement.classList.add('obra');
            obraElement.innerHTML = `
                <h2>${obra.titulo}</h2>
                <img src="${obra.imagen}" alt="${obra.titulo}">
                <p>${obra.descripcion}</p>
                <span class="fecha-publicacion ${obra.nueva ? 'hidden' : ''}">${obra.fechaPublicacion}</span>
                <button class="detailsButton" data-id="${obra.id}">Ver Detalles</button>
            `;

            // Verifica si el aviso temporal ya se mostró para esta obra
            const avisoNuevoMostrado = localStorage.getItem(`avisoNuevoMostrado_${obra.id}`);
            if (obra.nueva && (!avisoNuevoMostrado || avisoNuevoMostrado !== "true")) {
                const avisoTemporal = document.createElement('div');
                avisoTemporal.classList.add('aviso-temporal');
                avisoTemporal.textContent = '¡Nuevo!';
                obraElement.appendChild(avisoTemporal);

                setTimeout(() => {
                    avisoTemporal.style.opacity = 0;
                    setTimeout(() => {
                        avisoTemporal.remove();
                        localStorage.setItem(`avisoNuevoMostrado_${obra.id}`, "true");
                    }, 500);

                    const fechaPublicacion = obraElement.querySelector('.fecha-publicacion');
                    fechaPublicacion.classList.remove('hidden');
                }, 1000 * 60 * 60 * 24);
            } else if (avisoNuevoMostrado === "true") {
                const fechaPublicacion = obraElement.querySelector('.fecha-publicacion');
                fechaPublicacion.classList.remove('hidden');
            }

            // Manejador de eventos para el botón "Ver Detalles"
            obraElement.querySelector('.detailsButton').addEventListener('click', () => {
            const obraId = obra.id;
            redirectToDetailsPage(obraId);
        });

            obrasContainer.appendChild(obraElement);
        });
    }
}

// Función para redirigir a la página de detalles
function redirectToDetailsPage(obraId) {
    if (obraId) {
        window.location.href = `detalles/detalle.html?id=${obraId}`;
    }
}



// Espera a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');

    // Recupera el valor del campo de búsqueda desde el localStorage y colócalo en el campo
    searchInput.value = localStorage.getItem('searchInputValue') || '';

    searchInput.addEventListener('input', handleSearchInput);

    // Agrega un manejador para el evento pageshow
    window.addEventListener('pageshow', function () {
        // Si la página se muestra nuevamente (por ejemplo, al retroceder en el historial), limpia el campo de búsqueda
        searchInput.value = '';
        // Limpia también el valor en el localStorage
        localStorage.removeItem('searchInputValue');
    });
});

// Maneja el clic en el elemento de detalles para ocultarlo
newsDetails.addEventListener('click', () => {
    if (currentNews !== null) {
        newsDetails.style.display = 'none';
    }
});




// Carga los datos de las obras al inicio
loadObrasData();
