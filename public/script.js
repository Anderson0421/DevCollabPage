const menuButton = document.getElementById('BtnToggleMenu');
const MenuMobile = document.getElementById('MenuMobile');



let isOpen = false; // Variable para controlar el estado del menú

menuButton.addEventListener("click", function () {
  isOpen = !isOpen; // Cambia el estado del menú

  // Selecciona el elemento <svg> dentro del botón
const svgIcon = menuButton.querySelector("svg");

if (isOpen) {
    // Si el menú está abierto, cambia el contenido del botón al ícono de cierre
    svgIcon.innerHTML = `
    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.35220 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path>
    `;
    MenuMobile.classList.remove('hidden')
    MenuMobile.classList.add('flex')
} else {
    // Si el menú está cerrado, cambia el contenido del botón al ícono de menú hamburguesa
    svgIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
	</svg>
    `;
    MenuMobile.classList.add('hidden')
    MenuMobile.classList.remove('flex')
}
});

// Obteniendo los campos

const btnSuns = document.querySelectorAll("#BtnSun");
let isDark = true;

for (const btnSun of btnSuns) {
    btnSun.addEventListener("click", () => {
        isDark = !isDark;
        const svgChange = btnSun.querySelector("svg");
        const body = document.body;

        if (isDark) {
            svgChange.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            `;
        } else {
            svgChange.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            `;
        }

        body.classList.toggle('dark');
        body.classList.toggle('dark-mode-transition'); // Agregar/Quitar la clase de transición

        // Espera a que termine la animación de transición y luego quita la clase de transición
        setTimeout(() => {
            body.classList.toggle('dark-mode-transition');
        }, 300); // El mismo tiempo que la transición en CSS (0.3s)
    });
}


