// json-server --watch db.json --port 4000

let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const catergorias =  {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

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
        .then( resultado => mostrarPlatillos(resultado) )
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const catergoria = document.createElement('DIV');
        catergoria.classList.add('col-md-3');
        catergoria.textContent = catergorias[ platillo.categoria ];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // Funcion que detecta la cantidad y el platillo q se esta agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt(  inputCantidad.value );
            agregarPlatillo({...platillo, cantidad});
        };

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(catergoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    });
}

function agregarPlatillo(producto) {
    // Extrae el pedido actual
    let { pedido } = cliente;

    // Revisar que la cantidad se mayor a 0
    if (producto.cantidad > 0) {
        
        // Comprueba si el elemento ya existe en el array
        if ( pedido.some( articulo => articulo.id === producto.id ) ) {
            // El artidulo ya existe, Actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            // Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            // El Articulo no existe, lo agregamos al larray del pedido
            cliente.pedido = [...pedido, producto];
        }
    } else{
        // Eliminar elemento cunado la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );
        cliente.pedido = [...resultado];
    }

    // Limpiar el código HTML previo
    limpiarHTML();

    // Mostrar el resumen
    actualizarResumen()
}

function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    // Información de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    // Información de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Agregar a los elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Titulo del contenido
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterear sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // Cantidad del articulo
        const cantidadEL = document.createElement('P');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio del articulo
        const precioEL = document.createElement('P');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        // Agreegar valores a sus conteneores
        cantidadEL.appendChild(cantidadValor);
        precioEL.appendChild(precioValor);

        // Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);

        // Agregar lista al grupo principal
        grupo.appendChild(lista);
    } )

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while ( contenido.firstChild ) {
        contenido.removeChild(contenido.firstChild);
    }
}