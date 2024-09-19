let cinta = [];
let posicionCabezal = 0;
let simboloGuardado = '';
let colaOperaciones = [];

function iniciarMaquinaTuring() {
    const cadenaEntrada = document.getElementById('inputString').value;
    posicionCabezal = parseInt(document.getElementById('headPosition').value);
    
    cinta = cadenaEntrada.split('');
    mostrarCinta();
    colaOperaciones = [];
    actualizarListaOperaciones();
    actualizarMaquinaCompuesta(); // Inicializa la máquina compuesta
}

function mostrarCinta() {
    const cintaDiv = document.getElementById('tape');
    cintaDiv.innerHTML = '';
    
    cinta.forEach((simbolo, indice) => {
        const celda = document.createElement('div');
        celda.classList.add('cell');
        if (indice === posicionCabezal) {
            celda.classList.add('head');
        }
        celda.textContent = simbolo;
        cintaDiv.appendChild(celda);
    });
}

function agregarOperacion(operacion) {
    colaOperaciones.push(operacion);
    actualizarListaOperaciones();
}

function actualizarListaOperaciones() {
    const operacionesUl = document.getElementById('operations');
    operacionesUl.innerHTML = '';
    
    colaOperaciones.forEach((operacion, indice) => {
        const li = document.createElement('li');
        li.textContent = `${indice + 1}. ${operacion}`;
        operacionesUl.appendChild(li);
    });
}

async function ejecutarOperaciones() {
    for (let operacion of colaOperaciones) {
        switch (operacion) {
            case 'moverIzquierda':
                moverIzquierda();
                break;
            case 'moverDerecha':
                moverDerecha();
                break;
            case 'escribirSimbolo':
                escribirSimbolo();
                break;
            case 'guardarSimbolo':
                guardarSimbolo();
                break;
            case 'escribirSimboloGuardado':
                escribirSimboloGuardado();
                break;
            case 'buscarDerecha':
                buscarDerecha();
                break;
            case 'buscarIzquierda':
                buscarIzquierda();
                break;
            case 'buscarDiferenteDerecha':
                buscarDiferenteDerecha();
                break;
            case 'buscarDiferenteIzquierda':
                buscarDiferenteIzquierda();
                break;
        }
        actualizarMaquinaCompuesta(operacion); // Actualiza la máquina compuesta con cada operación
        await new Promise(r => setTimeout(r, 500)); // Espera 500ms entre operaciones
    }
    colaOperaciones = [];
    actualizarListaOperaciones();
}

function moverIzquierda() {
    if (posicionCabezal > 0) {
        posicionCabezal--;
    } else {
        actualizarEstado('El cabezal está al inicio de la cinta.');
    }
    mostrarCinta();
}

function moverDerecha() {
    if (posicionCabezal < cinta.length - 1) {
        posicionCabezal++;
    } else {
        cinta.push('_'); // Añade un espacio en blanco si se mueve fuera de la cinta actual
        posicionCabezal++;
    }
    mostrarCinta();
}

function escribirSimbolo() {
    const simbolo = prompt('Introduce el símbolo a escribir:');
    if (simbolo !== null && simbolo.length === 1) {
        cinta[posicionCabezal] = simbolo;
        mostrarCinta();
    } else {
        actualizarEstado('Símbolo inválido.');
    }
}

function guardarSimbolo() {
    simboloGuardado = cinta[posicionCabezal];
    actualizarEstado(`Símbolo "${simboloGuardado}" guardado.`);
}

function escribirSimboloGuardado() {
    if (simboloGuardado !== '') {
        cinta[posicionCabezal] = simboloGuardado;
        mostrarCinta();
    } else {
        actualizarEstado('No hay símbolo guardado.');
    }
}

function buscarDerecha() {
    while (posicionCabezal < cinta.length - 1 && cinta[posicionCabezal] !== simboloGuardado) {
        moverDerecha();
    }
}

function buscarIzquierda() {
    while (posicionCabezal > 0 && cinta[posicionCabezal] !== simboloGuardado) {
        moverIzquierda();
    }
}

function buscarDiferenteDerecha() {
    let simboloSustitucion = prompt("Introduce el símbolo para sustituir los elementos diferentes al guardado:");

    // Mueve el cabezal hacia la derecha, sustituyendo símbolos diferentes al guardado,
    // deteniéndose al encontrar un espacio en blanco
    while (posicionCabezal < cinta.length && cinta[posicionCabezal] !== ' ') {
        if (cinta[posicionCabezal] !== simboloGuardado) {
            cinta[posicionCabezal] = simboloSustitucion; // Sustituir el símbolo
        }
        moverDerecha();
    }
}


function buscarDiferenteIzquierda() {
    while (posicionCabezal > 0 && cinta[posicionCabezal] === simboloGuardado) {
        moverIzquierda();
    }
}

function actualizarEstado(mensaje) {
    const estadoDiv = document.getElementById('status');
    estadoDiv.textContent = mensaje;
}

function actualizarMaquinaCompuesta(operacion = '') {
    const maquinaDiv = document.getElementById('machineStatus');
    const celda = document.createElement('div');
    celda.classList.add('machine-cell');
    
    let simboloOperacion = '';
    switch (operacion) {
        case 'moverIzquierda':
            simboloOperacion = 'I';
            break;
        case 'moverDerecha':
            simboloOperacion = 'D';
            break;
        case 'escribirSimbolo':
            simboloOperacion = 'E';
            break;
        case 'guardarSimbolo':
            simboloOperacion = 'G';
            break;
        case 'escribirSimboloGuardado':
            simboloOperacion = 'S';
            break;
        case 'buscarDerecha':
            simboloOperacion = 'BD';
            break;
        case 'buscarIzquierda':
            simboloOperacion = 'BI';
            break;
        case 'buscarDiferenteDerecha':
            simboloOperacion = 'BDD';
            break;
        case 'buscarDiferenteIzquierda':
            simboloOperacion = 'BDI';
            break;
    }
    
    celda.textContent = simboloOperacion;
    maquinaDiv.appendChild(celda);
}
