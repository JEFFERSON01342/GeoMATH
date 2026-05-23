// =====================
// MÉTODO PUNTO FIJO
// =====================

window.metodoPuntoFijo = function (
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
    // CONVERTIR g(x)
    // =====================

    const expr =
        window.convertirLatexAJS(
            latex
        );

    // limpiar raíz anterior
    window.eliminarPunto(
        "raiz"
    );

    const tolerancia =
        1e-6;

    const maxIter =
        50;

    let xi = x0;

    // =====================
    // VALIDAR CONVERGENCIA
    // |g'(x0)| < 1
    // =====================

    const derivadaInicial =
        Math.abs(
            window.derivadaNumerica(
                expr,
                x0
            )
        );

    const converge =
        derivadaInicial < 1;

    // =====================
    // ITERACIONES
    // =====================

    for (
        let i = 1;
        i <= maxIter;
        i++
    ) {

        const gx =
            window.evaluarFuncion(
                expr,
                xi
            );

        // =====================
        // VALIDAR
        // =====================

        if (
            !isFinite(gx)
            ||
            isNaN(gx)
        ) {

            resultado.innerText =
                "Divergencia numérica";

            return;
        }

        // =====================
        // ERROR RELATIVO
        // =====================

        const errorRel =
            i === 1
            ? "-"
            : (
                Math.abs(
                    (
                        gx - xi
                    )
                    /
                    gx
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
                ${gx.toFixed(6)}
            </td>

            <td>
                ${errorRel}
            </td>

            <td>
                ${
                    converge
                    ? "Converge"
                    : "Puede divergir"
                }
            </td>

        </tr>
        `;

        // =====================
        // GRAFICAR ITERACIÓN
        // =====================

        window.agregarPunto(
            xi,
            gx,
            `iteracion-${i}`
        );

        // =====================
        // CRITERIO PARO
        // =====================

        if (
            Math.abs(
                gx - xi
            )
            <
            tolerancia
        ) {

            window.agregarPunto(
                gx,
                0,
                "raiz"
            );

            resultado.innerText =
                `
Raíz ≈ ${gx.toFixed(6)}

|g'(x₀)| = ${derivadaInicial.toFixed(6)}

→ ${
    converge
    ? "Converge"
    : "No garantiza convergencia"
}
                `;

            return;
        }

        // =====================
        // EXPLOSIÓN NUMÉRICA
        // =====================

        if (
            Math.abs(gx)
            > 1e10
        ) {

            resultado.innerText =
                "Explosión numérica";

            return;
        }

        // avanzar
        xi = gx;
    }

    // =====================
    // NO CONVERGIÓ
    // =====================

    resultado.innerText =
        "No convergió en 50 iteraciones";
};