// json-server --watch db.json --port 4000

let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar campos vacios
    const camposVacios = [ mesa, hora ].some( campo => campo === '' );

    if(camposVacios) {
        // Verificar si hay una alerta
        const existeAlerta = document.querySelector('.text-danger');

        if (!existeAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('text-danger', 'd-blck', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            // Elminar alerta
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }

        return;
    }

    // Asignar datos del formulario a cliente
    cliente = { ...cliente, mesa, hora };

    // Ocultar Modal
    const modalFormilario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormilario);
    modalBootstrap.hide();

    // Mostrar las secciones
    mostrarSecciones();

    // Obtner platillos de la API de JSON-Server
    obtenerPlatillos()

}

function mostrarSecciones() {
        const seccionesOcultas = document.querySelectorAll('.d-none');
        seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => console.log(resultado) )
        .catch( error => console.log(error))
}