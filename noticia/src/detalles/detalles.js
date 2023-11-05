const detailTitle = document.getElementById('detailTitle');
const detailImage = document.getElementById('detailImage');
const detailDescription = document.getElementById('detailDescription');
const detallesNormales = document.getElementById('detalles');
const detallesAvanzados = document.getElementById('detallesAvanzados');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (id !== null) {
    // Cargar detalles de la obra desde el archivo JSON
    fetch('../obras.json')
        .then((response) => response.json())
        .then((data) => {
            const obra = data.find((item) => item.id == id);
            if (obra) {
                detailTitle.textContent = obra.titulo;
                detailImage.src = obra.imagen;
                detailDescription.textContent = obra.descripcion;
                if (detallesNormales) {
                    detallesNormales.textContent = obra.detalles;
                }
                detallesAvanzados.innerHTML = `
                    Fecha: ${obra.fecha}<br>
                    Lugar: ${obra.lugar}<br>
                    Artista: ${obra.nombreArtista}<br>
                    Año de Creación: ${obra.anioCreacion}<br>
                    Técnica: ${obra.tecnica}<br>
                    Dimensiones: ${obra.dimensiones}<br>
                    
                `;
                console.log('ID:', id);
console.log('Obra:', obra);

                
            }
        
        })
        .catch((error) => {
            console.error('Error al cargar datos: ', error);
        });
} else {
    detailTitle.textContent = 'Parámetro "id" no especificado';
}


// JavaScript para abrir el modal y mostrar la imagen

const imageModal = document.getElementById('imageModal');
const popupImage = document.getElementById('popupImage');
const closeButton = document.getElementById('closeButton');

if (detailImage) {
    detailImage.addEventListener("click", () => {
        openImageModal(detailImage.src);
    });
}

function openImageModal(imageSrc) {
    if (popupImage) {
        popupImage.src = imageSrc;
        imageModal.style.display = "block";
    }
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        closeImageModal();
    });
}

// Cierra el modal haciendo clic fuera de la imagen
window.addEventListener("click", (event) => {
    if (event.target === imageModal) {
        closeImageModal();
    }
});

function closeImageModal() {
    imageModal.style.display = "none";
}
function openImageModal(imageSrc) {
    if (popupImage) {
        // Restablece el nivel de zoom a 100% antes de mostrar la imagen
        popupImage.style.transform = 'scale(1)';
        popupImage.src = imageSrc;
        imageModal.style.display = 'block';

        // Limpia el nivel de zoom actual
        currentZoomLevel = 100; // Restablece el nivel de zoom a 100%
    }
}




const zoomInButton = document.getElementById('zoomInButton');
const zoomOutButton = document.getElementById('zoomOutButton');

let currentZoomLevel = 100; // 100% de zoom



if (zoomInButton && zoomOutButton) {
    zoomInButton.addEventListener("click", () => {
        zoomImage(10); // Aumenta el zoom en 10%
    });

    zoomOutButton.addEventListener("click", () => {
        zoomImage(-10); // Reduce el zoom en 10%
    });
}



function zoomImage(zoomAmount) {
    currentZoomLevel += zoomAmount;
    updateZoom();
}

function updateZoom() {
    if (popupImage) {
        // Limita el nivel de zoom mínimo a 10% y el máximo a 200%
        if (currentZoomLevel < 10) {
            currentZoomLevel = 10;
        } else if (currentZoomLevel > 200) {
            currentZoomLevel = 200;
        }

        popupImage.style.transform = `scale(${currentZoomLevel / 100})`;
    }
}

// JavaScript para agregar la clase .show al cargar la página
window.addEventListener("load", function() {
    var obraDetails = document.querySelector(".obra-details");
    obraDetails.classList.add("show");
});
