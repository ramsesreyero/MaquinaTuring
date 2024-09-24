let cinta = [];
let posicionCabezal = 0;
let simboloGuardado = '';
let colaOperaciones = [];

function iniciarMaquinaTuring() {
    let cadenaEntrada = document.getElementById('inputString').value;
    posicionCabezal = parseInt(document.getElementById('headPosition').value);
    
    // Agregar dos guiones bajos al final de la cadena de entrada
    cadenaEntrada += '__'; // Esto añade dos espacios representados por '_'
    
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
            case 'copiarCadena':
                copiarCadena();
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

function moverDerecha(agregarEspacio = true) {
    if (posicionCabezal < cinta.length - 1) {
        posicionCabezal++;
    } else if (agregarEspacio) {
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
    let contador = 0;

    // Mover el cabezal a la derecha hasta que encuentre el PRIMER simbolo similiar al guardado (sin contar el del cabezal inicial)
    while (posicionCabezal < cinta.length) {
        if (cinta[posicionCabezal] === simboloGuardado) {
            contador++; // Contar cada vez que se encuentra el símbolo guardado
        }

        if (contador === 2) {
            console.log("Segundo símbolo encontrado en la posición: " + posicionCabezal);
            mostrarCinta(); // Actualiza la cinta con la nueva posición del cabezal
            return; // Termina la función cuando se encuentra el segundo símbolo
        }
        moverDerecha(false); // Seguir moviéndose a la derecha
    }
    console.log("No se encontró el segundo símbolo en la cinta.");
}

function buscarIzquierda() {
    let contador = 0;

    // Mover el cabezal a la izquierda hasta que encuentre el segundo símbolo similar al guardado
    while (posicionCabezal >= 0) {
        if (cinta[posicionCabezal] === simboloGuardado) {
            contador++; // Contar cada vez que se encuentra el símbolo guardado
        }

        if (contador === 2) {
            console.log("Segundo símbolo encontrado en la posición: " + posicionCabezal);
            mostrarCinta(); // Actualiza la cinta con la nueva posición del cabezal
            return; // Termina la función cuando se encuentra el segundo símbolo
        }

        moverIzquierda(); // Seguir moviéndose a la izquierda
    }

    console.log("No se encontró el segundo símbolo en la cinta.");
    mostrarCinta(); // Actualiza la cinta después de terminar la búsqueda
}

function buscarDiferenteDerecha() {
    let simboloSustitucion = prompt("Introduce el símbolo para sustituir los elementos diferentes al guardado:");

    let iteraciones = 0; // Contador para evitar bucle infinito
    const maxIteraciones = 30; // Límite máximo de iteraciones

    // Mueve el cabezal a la derecha hasta encontrar un símbolo diferente al guardado
    while (posicionCabezal < cinta.length && cinta[posicionCabezal] === simboloGuardado) {
        if (iteraciones++ > maxIteraciones) {
            console.error("Bucle infinito detectado en buscarDiferenteDerecha (primer bucle).");
            break;
        }
        moverDerecha(false); // No agregar espacio en blanco
    }
    
    iteraciones = 0; // Reiniciar el contador para el segundo bucle
    // Sustituye los símbolos diferentes al guardado hasta encontrar un espacio en blanco
    while (posicionCabezal < cinta.length && cinta[posicionCabezal] !== ' ') {
        if (iteraciones++ > maxIteraciones) {
            console.error("Bucle infinito detectado en buscarDiferenteDerecha (segundo bucle).");
            break;
        }

        if (cinta[posicionCabezal] !== simboloGuardado) {
            cinta[posicionCabezal] = simboloSustitucion; // Sustituir el símbolo
        }
        moverDerecha(false); // No agregar espacio en blanco
    }
    
    mostrarCinta(); // Actualiza la cinta para reflejar los cambios
}

function buscarDiferenteIzquierda() {
    let simboloSustitucion = prompt("Introduce el símbolo para sustituir los elementos diferentes al guardado:");

    let iteraciones = 0; // Contador para evitar bucle infinito
    const maxIteraciones = 30; // Límite máximo de iteraciones

    // Mueve el cabezal a la izquierda hasta encontrar un símbolo diferente al guardado
    while (posicionCabezal >= 0 && cinta[posicionCabezal] === simboloGuardado) {
        if (iteraciones++ > maxIteraciones) {
            console.error("Bucle infinito detectado en buscarDiferenteIzquierda (primer bucle).");
            break;
        }
        moverIzquierda(false); // No agregar espacio en blanco
    }
    
    iteraciones = 0; // Reiniciar el contador para el segundo bucle
    // Sustituye los símbolos diferentes al guardado hasta encontrar un espacio en blanco
    while (posicionCabezal >= 0 && cinta[posicionCabezal] !== ' ') {
        if (iteraciones++ > maxIteraciones) {
            console.error("Bucle infinito detectado en buscarDiferenteIzquierda (segundo bucle).");
            break;
        }

        if (cinta[posicionCabezal] !== simboloGuardado) {
            cinta[posicionCabezal] = simboloSustitucion; // Sustituir el símbolo
        }
        moverIzquierda(false); // No agregar espacio en blanco
    }
    
    mostrarCinta(); // Actualiza la cinta para reflejar los cambios
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
        case 'copiarCadena':
            simboloOperacion = 'CC';
            break;
    }
    
    celda.textContent = simboloOperacion;
    maquinaDiv.appendChild(celda);
}

function copiarCadena() 
{
    if(cinta[posicionCabezal] != "_")
    {
    guardarSimbolo();
    escribirMarcador();
    guardarSimboloMarcador();
    encontrar2doBlanco();
    escribirSimboloGuardado();
    moverDerecha();
    agregarSegundoBlanco();
    buscarMarcadorIzquierda();
    moverDerecha();
    }
    else
    {
        actualizarEstado('Se ecnontro en el primer blanco')
    }

}
function guardarSimboloCC()
{
    if(cinta[posicionCabezal] != "_")
    {
        simboloGuardado = cinta[posicionCabezal];
        actualizarEstado(`Símbolo "${simboloGuardado}" guardado.`);
    }
    else
    {
        actualizarEstado('El simbolo a copiar es un espacio en blanco')
    }
    
}
function agregarSegundoBlanco()
{
    simboloBlanco = "_"
    if (simboloBlanco !== '') {
        cinta[posicionCabezal] = simboloBlanco;
        mostrarCinta();
    } else {
        actualizarEstado('No hay símbolo guardado.');
    }
}

function encontrar2doBlanco()
{
    let contador = 0;

     while (posicionCabezal < cinta.length) {
        if (cinta[posicionCabezal] === "_") {
            contador++; 
         }

        if (contador === 2) {
            mostrarCinta(); 
            return; 
        }
        moverDerecha(false); 
    }
    console.log("No se encontró el segundo símbolo en la cinta.");
}

function escribirMarcador()
{
    const simbolo = prompt('Introduce el símbolo a sustituir:');
    if (simbolo !== null && simbolo.length === 1) {
        cinta[posicionCabezal] = simbolo;
        mostrarCinta();
    } else {
        actualizarEstado('Símbolo inválido.');
    }
}

function guardarSimboloMarcador()
{
    simboloMarcadorGuardado = cinta[posicionCabezal];
    actualizarEstado(`Símbolo "${simboloMarcadorGuardado}" guardado.`);
}

function escribirSimboloMarcadorGaurdado()
{
    if (simboloMarcadorGuardado !== '') {
        cinta[posicionCabezal] = simboloMarcadorGuardado;
        mostrarCinta();
    } else {
        actualizarEstado('No hay símbolo guardado.');
    }
}

function buscarMarcadorIzquierda() {
    let encontrado = false;

     while (posicionCabezal >= 0) {
        if (cinta[posicionCabezal] === simboloMarcadorGuardado) {
            encontrado = true;
            console.log("Símbolo encontrado en la posición: " + posicionCabezal);
            escribirSimboloGuardado();
            mostrarCinta(); 
             return; 
            }

        moverIzquierda(); 
    }

    if (!encontrado) {
        console.log("No se encontró el símbolo en la cinta.");
    }
    mostrarCinta();
}

