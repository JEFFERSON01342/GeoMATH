// =====================
// ESTADO GLOBAL
// =====================

let metodoActual =
    null;


// =====================
// INICIALIZACIÓN
// =====================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "RAICES INICIADO"
        );

        // =====================
        // DESMOS
        // =====================

        setTimeout(
            () => {

                iniciarDesmos();

            },
            100
        );

        // =====================
        // BOTONES MÉTODOS
        // =====================

        inicializarBotones();

        // =====================
        // BOTÓN EJECUTAR
        // =====================

        const botonIterar =
            document.getElementById(
                "btn-iterar"
            );

        if (botonIterar) {

            botonIterar.addEventListener(
                "click",
                ejecutarMetodo
            );
        }
    }
);


// =====================
// BOTONES DE MÉTODO
// =====================

function inicializarBotones() {

    const botones =
        document.querySelectorAll(
            ".metodo-btn"
        );

    botones.forEach(
        btn => {

            btn.addEventListener(
                "click",
                function () {

                    const tipo =
                        this.dataset.metodo;

                    metodoActual =
                        tipo;

                    // =====================
                    // UI
                    // =====================

                    crearTabla(
                        tipo
                    );

                    mostrarInputs(
                        tipo
                    );

                    activarBotonMetodo(
                        botones,
                        this
                    );
                }
            );
        }
    );
}


// =====================
// CONTROLADOR CENTRAL
// =====================

function ejecutarMetodo() {

    // =====================
    // VALIDAR FUNCIÓN
    // =====================

    const latex =
        obtenerLatex();

    if (!latex) {

        alert(
            "Escribe una función"
        );

        return;
    }

    // validar x
    if (
        !latex.includes(
            "x"
        )
    ) {

        alert(
            "La función debe contener x"
        );

        return;
    }

    // =====================
    // VALIDAR MÉTODO
    // =====================

    if (
        !metodoActual
    ) {

        alert(
            "Selecciona un método"
        );

        return;
    }

    // =====================
    // OBTENER INPUTS
    // =====================

    const valores =
        obtenerValoresMetodo();

    // =====================
    // ROUTER MÉTODOS
    // =====================

    switch (
        metodoActual
    ) {

        // =====================
        // BISECCIÓN
        // =====================

        case "biseccion":

            if (
                valores.a == null
                ||
                valores.b == null
            ) {

                alert(
                    "Ingresa a y b"
                );

                return;
            }

            metodoBiseccion(
                latex,
                valores.a,
                valores.b
            );

            break;


        // =====================
        // REGLA FALSA
        // =====================

        case "reglaFalsa":

            if (
                valores.a == null
                ||
                valores.b == null
            ) {

                alert(
                    "Ingresa a y b"
                );

                return;
            }

            metodoReglaFalsa(
                latex,
                valores.a,
                valores.b
            );

            break;


        // =====================
        // NEWTON
        // =====================

        case "newton":

            if (
                valores.x0 == null
            ) {

                alert(
                    "Ingresa x₀"
                );

                return;
            }

            metodoNewton(
                latex,
                valores.x0
            );

            break;


        // =====================
        // SECANTE
        // =====================

        case "secante":

            if (
                valores.a == null
                ||
                valores.b == null
            ) {

                alert(
                    "Ingresa x₀ y x₁"
                );

                return;
            }

            metodoSecante(
                latex,
                valores.a,
                valores.b
            );

            break;


        // =====================
        // PUNTO FIJO
        // =====================

        case "puntoFijo":

            if (
                valores.x0 == null
            ) {

                alert(
                    "Ingresa x₀"
                );

                return;
            }

            metodoPuntoFijo(
                latex,
                valores.x0
            );

            break;


        // =====================
        // DEFAULT
        // =====================

        default:

            alert(
                "Método no reconocido"
            );

            break;
    }
}