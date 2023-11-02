// Selección de imágenes y seguimiento del índice actual
const images = document.querySelectorAll('.slide-image');
let currentIndex = 0;

// Función para mostrar una imagen específica
function showImage(index) {
    images.forEach((image, i) => {
        if (i === index) {
            image.style.opacity = 1;
        } else {
            image.style.opacity = 0;
        }
    });
}

// Función para mostrar la siguiente imagen
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

// Mostrar la primera imagen al cargar la página
showImage(currentIndex);

// Cambiar la imagen automáticamente cada 5 segundos
setInterval(nextImage, 5000);

// Obtener enlaces del menú y línea de resaltado
const menuLinks = document.querySelectorAll('.menu-link');
const line = document.querySelector('.line');

// Agregar manejador de clic a los enlaces del menú
menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        // Resaltar el enlace seleccionado y mover la línea
        menuLinks.forEach((el) => el.classList.remove('active'));
        link.classList.add('active');
        const rect = link.getBoundingClientRect();
        line.style.transform = `translateX(${rect.left + rect.width / 2}px)`;
    });
});

// Agregar manejador de eventos para actualizar el resaltado mientras se desplaza
document.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    menuLinks.forEach((link) => {
        const sectionId = link.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
            const sectionBottom = sectionTop + section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Resaltar el enlace actual y mover la línea
                menuLinks.forEach((el) => el.classList.remove('active'));
                link.classList.add('active');
                const rect = link.getBoundingClientRect();
                line.style.transform = `translateX(${rect.left + rect.width / 2}px)`;
            }
        }
    });
});

// Mostrar información de contacto con retraso
document.addEventListener("DOMContentLoaded", function () {
    const contactInfo = document.querySelector(".contact-info");
    setTimeout(function () {
        contactInfo.classList.add("active");
    }, 100); // Agregar un retraso de 100ms antes de agregar la clase.
});

// JavaScript para manejar la barra lateral deslizante en dispositivos móviles
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    // Agregar un evento de clic al ícono de las tres rallitas
    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('active');
    });

    // Agregar un evento de clic al cuerpo del documento
    document.body.addEventListener('click', function (event) {
        // Cerrar la barra lateral si se hace clic fuera de ella y el ícono de las tres rallitas
        if (!menu.contains(event.target) && event.target !== menu && !menuToggle.contains(event.target)) {
            menu.classList.remove('active');
        }
    });

    // Agregar un evento de clic a cada enlace del menú
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Cerrar la barra lateral
            menu.classList.remove('active');
        });
    });
});

// Manejo de formulario y mensaje de confirmación
const form1 = document.getElementById("miFormulario");
const confirmation = document.getElementById("confirmation");
const messageInput = document.getElementById("message");

if (form1 && confirmation) {
    form1.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameValue = document.getElementById("name").value;
        const emailValue = document.getElementById("email").value;
        let messageValue = document.getElementById("message").value;

        // Contar las palabras y aplicar el desplazamiento si es necesario
        const words = messageValue.split(' ');
        if (words.length > 10) {
            messageInput.classList.add("scrollable");
        } else {
            messageInput.classList.remove("scrollable");
        }

        // Mostrar los valores en el mensaje de confirmación
        document.getElementById("name-value").textContent = nameValue;
        document.getElementById("email-value").textContent = emailValue;
        document.getElementById("message-value").textContent = messageValue;

        confirmation.style.display = "block";

        const confirmYes = document.getElementById("confirm-yes");
        const confirmNo = document.getElementById("confirm-no");

        confirmYes.addEventListener("click", function () {
            window.location.href = "gracias.html";
        });

        confirmNo.addEventListener("click", function () {
            confirmation.style.display = "none";
        });
    });
} // Agregar esta llave para cerrar la función del formulario


// Manejo de imágenes antes y después con desplazamiento suave
document.addEventListener("DOMContentLoaded", function () {
    const antesDespuesElements = document.querySelectorAll('.antes-despues');

    antesDespuesElements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            // Activar el desplazamiento suave cuando el mouse entra en las imágenes de proyectos
            document.body.style.scrollBehavior = 'smooth';
        });

        element.addEventListener('mouseleave', () => {
            // Desactivar el desplazamiento suave cuando el mouse sale de las imágenes de proyectos
            document.body.style.scrollBehavior = 'auto';
        });
    });
});





document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("miFormulario");
    const submitButton = document.getElementById("submit-button");
  
    submitButton.addEventListener("click", function (event) {
      event.preventDefault(); // Evita el envío predeterminado del formulario
  
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
  
      if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
        alert("Por favor, complete todos los campos.");
        return;
      }
  
      const formData = {
        name: name,
        email: email,
        message: message,
      };
  
      fetch("http://127.0.0.1:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          alert("Formulario enviado con éxito");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error al enviar el formulario");
        });
    });
  });
  
  