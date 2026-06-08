// =====================
// TABLA DINÁMICA
// =====================

function crearTabla(tipo) {

    const thead =
        document.querySelector(
            "#tabla-iteraciones thead"
        );

    const tbody =
        document.querySelector(
            "#tabla-iteraciones tbody"
        );

    thead.innerHTML = "";
    tbody.innerHTML = "";

    let columnas = [];

    switch (tipo) {

        case "biseccion":

            columnas = [
                "Iteración",
                "a",
                "c",
                "b",
                "f(a)",
                "f(c)",
                "f(b)",
                "f(a)·f(b)",
                "Ea",
                "Er%"
            ];

            break;


        case "reglaFalsa":

            columnas = [
                "Iteración",
                "a",
                "b",
                "f(a)",
                "f(b)",
                "f(a)·f(b)",
                "c",
                "f(c)",
                "Er%"
            ];

            break;


        case "newton":

            columnas = [
                "Iteración",
                "xi",
                "f(xi)",
                "f'(xi)",
                "Er%"
            ];

            break;


        case "secante":

            columnas = [
                "Iteración",
                "xi-1",
                "xi",
                "f(xi-1)",
                "f(xi)",
                "xi+1",
                "Er%"
            ];

            break;


        case "puntoFijo":

            columnas = [
                "Iteración",
                "xi",
                "g(xi)",
                "Er%",
                "Estado |g'(xi)|"
            ];

            break;
    }

    let fila = "<tr>";

    columnas.forEach(col => {

        fila += `
            <th>
                ${col}
            </th>
        `;
    });

    fila += "</tr>";

    thead.innerHTML = fila;
}


// =====================
// CAMBIAR CATEGORÍA
// =====================

function cambiarCategoria(categoria) {

    // Actualizar botones categoría
    const botonesCat =
        document.querySelectorAll(
            ".categoria-btn"
        );

    botonesCat.forEach(btn => {

        btn.classList.remove(
            "activo"
        );
    });

    document.querySelector(
        `.categoria-btn[data-categoria="${categoria}"]`
    ).classList.add("activo");

    // Mostrar/ocultar grupos
    const grupos =
        document.querySelectorAll(
            ".categoria-grupo"
        );

    grupos.forEach(grupo => {

        grupo.classList.add("oculto");
    });

    document.querySelector(
        `.categoria-grupo[data-categoria="${categoria}"]`
    ).classList.remove("oculto");

    // Limpiar selección
    const botones =
        document.querySelectorAll(
            ".metodo-btn:not([disabled])"
        );

    botones.forEach(btn => {

        btn.classList.remove(
            "activo"
        );
    });

    metodoActual =
        null;

    limpiarResultados();
}


// =====================
// MOSTRAR INPUTS
// =====================

function mostrarInputs(tipo) {

    const grupoA =
        document.getElementById(
            "input-a-group"
        );

    const grupoB =
        document.getElementById(
            "input-b-group"
        );

    const grupoX0 =
        document.getElementById(
            "input-x0-group"
        );

    const titulo =
        document.getElementById(
            "titulo-funcion"
        );

    // ocultar todo
    grupoA.style.display =
        "none";

    grupoB.style.display =
        "none";

    grupoX0.style.display =
        "none";

    // reset labels
    document.querySelector(
        "#input-a-group label"
    ).innerText = "a:";

    document.querySelector(
        "#input-b-group label"
    ).innerText = "b:";

    // reset título
    titulo.innerText =
        "Escriba f(x):";

    switch (tipo) {

        // =====================
        // BISECCIÓN
        // =====================

        case "biseccion":

            grupoA.style.display =
                "block";

            grupoB.style.display =
                "block";

            break;


        // =====================
        // REGLA FALSA
        // =====================

        case "reglaFalsa":

            grupoA.style.display =
                "block";

            grupoB.style.display =
                "block";

            break;


        // =====================
        // NEWTON
        // =====================

        case "newton":

            grupoX0.style.display =
                "block";

            break;


        // =====================
        // SECANTE
        // =====================

        case "secante":

            grupoA.style.display =
                "block";

            grupoB.style.display =
                "block";

            document.querySelector(
                "#input-a-group label"
            ).innerText = "x₀:";

            document.querySelector(
                "#input-b-group label"
            ).innerText = "x₁:";

            break;


        // =====================
        // PUNTO FIJO
        // =====================

        case "puntoFijo":

            grupoX0.style.display =
                "block";

            titulo.innerText =
                "Escriba g(x) (sin poner x =)";

            break;
    }
}


// =====================
// ACTIVAR BOTÓN
// =====================

function activarBotonMetodo(
    botones,
    botonActivo
) {

    botones.forEach(btn => {

        btn.classList.remove(
            "activo"
        );
    });

    botonActivo.classList.add(
        "activo"
    );
}


// =====================
// OBTENER INPUTS
// =====================

function obtenerValoresMetodo() {

    const a = parseFloat(
        document.getElementById(
            "input-a"
        ).value
    );

    const b = parseFloat(
        document.getElementById(
            "input-b"
        ).value
    );

    const x0 = parseFloat(
        document.getElementById(
            "input-x0"
        ).value
    );

    return {

        a:
            isNaN(a)
            ? null
            : a,

        b:
            isNaN(b)
            ? null
            : b,

        x0:
            isNaN(x0)
            ? null
            : x0
    };
}


// =====================
// LIMPIAR RESULTADOS
// =====================

function limpiarResultados() {

    document.querySelector(
        "#tabla-iteraciones tbody"
    ).innerHTML = "";

    document.getElementById(
        "resultado-text"
    ).innerText =
        "Aquí aparecerá la raíz aproximada...";
}