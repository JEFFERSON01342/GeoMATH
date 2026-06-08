// =====================
// MÉTODO BAIRSTOW
// =====================

window.metodoBarirstow = function (
    coeficientes,
    r,
    s
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

    const tolerancia =
        1e-6;

    const maxIter =
        50;

    let n = coeficientes.length - 1;
    let ri = r;
    let si = s;

    // =====================
    // ITERACIONES
    // =====================

    for (
        let iter = 1;
        iter <= maxIter;
        iter++
    ) {

        // =====================
        // CALCULAR b Y c
        // =====================

        const b = new Array(n + 1);
        const c = new Array(n + 1);

        b[n] = coeficientes[n];
        b[n - 1] =
            coeficientes[n - 1] + ri * b[n];

        c[n] = b[n];
        c[n - 1] =
            b[n - 1] + ri * c[n];

        for (let i = n - 2; i >= 0; i--) {

            b[i] =
                coeficientes[i] +
                ri * b[i + 1] +
                si * b[i + 2];

            c[i] =
                b[i] +
                ri * c[i + 1] +
                si * c[i + 2];
        }

        // =====================
        // ERRORES
        // =====================

        const b0 = b[0];
        const b1 = b[1];
        const c1 = c[1];
        const c2 = c[2];

        // =====================
        // CALCULAR INCREMENTOS
        // =====================

        const c3 = c[3] || 0;

        const denom =
            c2 * c2 -
            c1 * c3;

        if (Math.abs(denom) < 1e-15) {

            resultado.innerText =
                "❌ Denominador muy pequeño";

            return;
        }

        const deltaR =
            (b0 * c2 - b1 * c1) /
            denom;

        const deltaS =
            (b1 * c1 - b0 * c2) /
            denom;

        // =====================
        // ACTUALIZAR r y s
        // =====================

        ri += deltaR;
        si += deltaS;

        // =====================
        // ERROR RELATIVO
        // =====================

        const errorR =
            Math.abs(deltaR) > 0
            ? Math.abs(deltaR / ri) * 100
            : 0;

        const errorS =
            Math.abs(deltaS) > 0
            ? Math.abs(deltaS / si) * 100
            : 0;

        const errorMax =
            Math.max(errorR, errorS);

        // =====================
        // TABLA
        // =====================

        tbody.innerHTML += `
        <tr>

            <td>
                ${iter}
            </td>

            <td>
                ${ri.toFixed(6)}
            </td>

            <td>
                ${si.toFixed(6)}
            </td>

            <td>
                ${b0.toExponential(4)}
            </td>

            <td>
                ${b1.toExponential(4)}
            </td>

            <td>
                ${deltaR.toExponential(4)}
            </td>

            <td>
                ${deltaS.toExponential(4)}
            </td>

            <td>
                ${errorMax.toFixed(6)}
            </td>

        </tr>
        `;

        // =====================
        // CRITERIO PARO
        // =====================

        if (errorMax < tolerancia) {

            const discriminante =
                ri * ri + 4 * si;

            let raices = "";

            if (discriminante >= 0) {

                const sqrt_disc =
                    Math.sqrt(discriminante);

                const x1 =
                    (ri + sqrt_disc) / 2;

                const x2 =
                    (ri - sqrt_disc) / 2;

                raices = `
x₁ = ${x1.toFixed(6)}
x₂ = ${x2.toFixed(6)}
                `;

            } else {

                const real =
                    ri / 2;

                const imag =
                    Math.sqrt(
                        -discriminante
                    ) / 2;

                raices = `
x₁ = ${real.toFixed(6)} + ${imag.toFixed(6)}i
x₂ = ${real.toFixed(6)} - ${imag.toFixed(6)}i
                `;
            }

            resultado.innerText =
                `
✓ Convergió en ${iter} iteraciones

Factor cuadrático: x² - ${ri.toFixed(6)}x + ${si.toFixed(6)}

Raíces del factor:
${raices}

Error máximo: ${errorMax.toExponential(4)}
            `;

            return;
        }

        // =====================
        // VALIDACIÓN NUMÉRICA
        // =====================

        if (
            !isFinite(ri) ||
            !isFinite(si) ||
            !isFinite(deltaR) ||
            !isFinite(deltaS)
        ) {

            resultado.innerText =
                "❌ Error numérico - divergencia";

            return;
        }
    }

    // =====================
    // NO CONVERGIÓ
    // =====================

    resultado.innerText =
        `
⚠ No convergió en ${maxIter} iteraciones

Últimos valores:
r = ${ri.toFixed(6)}
s = ${si.toFixed(6)}

Factor: x² - ${ri.toFixed(6)}x + ${si.toFixed(6)}
        `;
};
