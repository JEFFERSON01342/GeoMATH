// =====================
// MÉTODO NEWTON
// =====================

window.metodoNewton = function (
    latex,
    x0
) {

    const tbody =
        document.querySelector(
            "#tabla-iteraciones tbody"
        );

    const resultado =
        document.getElementById(
            "resultado-text"
        );

    tbody.innerHTML = "";

    resultado.innerText =
        "Calculando...";

    // =====================
    // CONVERTIR FUNCIÓN
    // =====================

    const expr =
        window.convertirLatexAJS(
            latex
        );

    // limpiar raíz previa
    window.eliminarPunto(
        "raiz"
    );

    const tolerancia =
        1e-6;

    const maxIter =
        50;

    let xi = x0;

    // =====================
    // ITERACIONES
    // =====================

    for (
        let i = 1;
        i <= maxIter;
        i++
    ) {

        const fxi =
            window.evaluarFuncion(
                expr,
                xi
            );

        const dfxi =
            window.derivadaNumerica(
                expr,
                xi
            );

        // =====================
        // VALIDAR
        // =====================

        if (
            !isFinite(fxi)
            ||
            !isFinite(dfxi)
        ) {

            resultado.innerText =
                "Error evaluando la función";

            return;
        }

        // derivada cero
        if (
            Math.abs(dfxi)
            < 1e-12
        ) {

            resultado.innerText =
                "Derivada cercana a cero";

            return;
        }

        // =====================
        // FÓRMULA NEWTON
        // =====================

        const xiSiguiente =
            xi -
            (
                fxi / dfxi
            );

        // =====================
        // ERROR RELATIVO
        // =====================

        const errorRel =
            i === 1
            ? "-"
            : (
                Math.abs(
                    (
                        xiSiguiente
                        -
                        xi
                    )
                    /
                    xiSiguiente
                )
                * 100
            ).toFixed(6);

        // =====================
        // TABLA
        // =====================

        tbody.innerHTML += `
        <tr>

            <td>
                ${i}
            </td>

            <td>
                ${xi.toFixed(6)}
            </td>

            <td>
                ${fxi.toFixed(6)}
            </td>

            <td>
                ${dfxi.toFixed(6)}
            </td>

            <td>
                ${errorRel}
            </td>

        </tr>
        `;

        // =====================
        // GRAFICAR ITERACIÓN
        // =====================

        window.agregarPunto(
            xi,
            fxi,
            `iteracion-${i}`
        );

        // =====================
        // CRITERIO DE PARO
        // =====================

        if (
            Math.abs(fxi)
            <
            tolerancia
        ) {

            window.agregarPunto(
                xi,
                0,
                "raiz"
            );

            resultado.innerText =
                `Raíz ≈ ${xi.toFixed(6)}`;

            return;
        }

        // =====================
        // VALIDAR DIVERGENCIA
        // =====================

        if (
            !isFinite(
                xiSiguiente
            )
            ||
            isNaN(
                xiSiguiente
            )
            ||
            Math.abs(
                xiSiguiente
            ) > 1e10
        ) {

            resultado.innerText =
                "Divergencia numérica";

            return;
        }

        // avanzar
        xi =
            xiSiguiente;
    }

    // =====================
    // NO CONVERGIÓ
    // =====================

    window.agregarPunto(
        xi,
        0,
        "raiz"
    );

    resultado.innerText =
        `Raíz aproximada ≈ ${xi.toFixed(6)}
        (máximo de iteraciones alcanzado)`;
};