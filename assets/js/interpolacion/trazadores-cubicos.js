// =====================
// TRAZADORES CÚBICOS
// INTERPOLACIÓN
// =====================


// =====================
// RESOLVER TRAZADORES
// =====================

window.resolverTrazadores =
function () {

    const datos =
        obtenerDatosTabla();

    if (
        datos.length < 2
    ) {
        alert(
            "Ingrese al menos 2 puntos."
        );
        return;
    }

    // =====================
    // VALIDAR X DUPLICADOS
    // =====================

    const xValues =
        datos.map(
            d => d.x
        );

    const xUnicos =
        new Set(xValues);

    if (
        xUnicos.size !==
        xValues.length
    ) {
        alert(
            "Error: No puede haber valores de x duplicados."
        );
        return;
    }

    // Ordenar por x
    datos.sort(
        (a, b) =>
            a.x - b.x
    );

    const n =
        datos.length;

    // =====================
    // LIMPIAR PASOS
    // =====================

    document.getElementById(
        "procedimiento-diferencias"
    ).innerHTML = "";

    document.getElementById(
        "tabla-newton-container"
    ).innerHTML = "";

    document.getElementById(
        "coeficientes-container"
    ).innerHTML = "";

    document.getElementById(
        "construccion-container"
    ).innerHTML = "";

    // =====================
    // CALCULAR TRAZADORES
    // =====================

    const splines =
        calcularSplines(
            datos
        );

    // =====================
    // MOSTRAR ECUACIONES
    // =====================

    mostrarEcuacionesSplines(
        datos,
        splines
    );

    // =====================
    // MOSTRAR COEFICIENTES
    // =====================

    mostrarCoeficientesSplines(
        splines
    );

    // =====================
    // VERIFICACIÓN
    // =====================

    verificarTrazadores(
        datos,
        splines
    );
}


// =====================
// CALCULAR SPLINES
// =====================

function calcularSplines(datos) {

    const n =
        datos.length;

    const h = [];

    for (
        let i = 0;
        i < n - 1;
        i++
    ) {
        h[i] =
            datos[i + 1].x -
            datos[i].x;
    }

    // Sistema tridiagonal
    const alpha = [0];

    for (
        let i = 1;
        i < n - 1;
        i++
    ) {

        alpha[i] =
            (3 / h[i]) *
            (datos[i + 1].fx -
             datos[i].fx) -
            (3 / h[i - 1]) *
            (datos[i].fx -
             datos[i - 1].fx);
    }

    alpha[n - 1] = 0;

    // Resolver sistema tridiagonal
    const l = [];
    const mu = [];
    const z = [];

    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;

    for (
        let i = 1;
        i < n - 1;
        i++
    ) {

        l[i] =
            2 *
            (h[i - 1] + h[i]) -
            h[i - 1] * mu[i - 1];

        if (Math.abs(l[i]) < 1e-10) {
            l[i] = 1e-10;
        }

        mu[i] =
            h[i] / l[i];

        z[i] =
            (alpha[i] -
             h[i - 1] * z[i - 1]) /
            l[i];
    }

    l[n - 1] = 1;
    z[n - 1] = 0;

    const c = [];
    c[n - 1] = 0;

    for (
        let j = n - 2;
        j >= 0;
        j--
    ) {

        c[j] =
            z[j] -
            mu[j] * c[j + 1];
    }

    // Calcular a, b, d
    const splines = [];

    for (
        let i = 0;
        i < n - 1;
        i++
    ) {

        const a =
            datos[i].fx;

        const b =
            (datos[i + 1].fx -
             datos[i].fx) /
            h[i] -
            h[i] *
            (c[i + 1] + 2 * c[i]) /
            3;

        const d =
            (c[i + 1] - c[i]) /
            (3 * h[i]);

        splines.push({
            x0: datos[i].x,
            x1: datos[i + 1].x,
            a,
            b,
            c: c[i],
            d,
            h: h[i]
        });
    }

    return splines;
}


// =====================
// MOSTRAR ECUACIONES
// =====================

function mostrarEcuacionesSplines(
    datos,
    splines
) {

    let html =
        `<div class="splines-ecuaciones">`;

    splines.forEach(
        (s, i) => {

            const xi =
                s.x0.toFixed(2);

            const xi1 =
                s.x1.toFixed(2);

            const a =
                s.a.toFixed(4);

            const b =
                s.b.toFixed(6);

            const c =
                s.c.toFixed(6);

            const d =
                s.d.toFixed(6);

            html +=
                `
                <div class="spline-paso">
                    <h3>
                        S<sub>${i}</sub>(x) para x ∈ [${xi}, ${xi1}]
                    </h3>
                    <div class="latex-box">
                        $$S_${i}(x) = ${a} + ${b}(x-${xi}) + ${c}(x-${xi})^2 + ${d}(x-${xi})^3$$
                    </div>
                    <p style="font-size: 13px; color: #666; margin-top: 8px;">
                        a = ${a}, b = ${b}, c = ${c}, d = ${d}
                    </p>
                </div>
                `;
        }
    );

    html += `</div>`;

    document.getElementById(
        "procedimiento-diferencias"
    ).innerHTML = html;

    refrescarMathJax();
}


// =====================
// MOSTRAR COEFICIENTES
// =====================

function mostrarCoeficientesSplines(
    splines
) {

    let html =
        `<div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Intervalo</th>
                        <th>a</th>
                        <th>b</th>
                        <th>c</th>
                        <th>d</th>
                    </tr>
                </thead>
                <tbody>`;

    splines.forEach(
        (s, i) => {

            html +=
                `
                <tr>
                    <td>[${s.x0.toFixed(2)}, ${s.x1.toFixed(2)}]</td>
                    <td>${s.a.toFixed(6)}</td>
                    <td>${s.b.toFixed(6)}</td>
                    <td>${s.c.toFixed(6)}</td>
                    <td>${s.d.toFixed(6)}</td>
                </tr>
                `;
        }
    );

    html +=
        `
                </tbody>
            </table>
        </div>`;

    document.getElementById(
        "coeficientes-container"
    ).innerHTML = html;
}


// =====================
// VERIFICACIÓN
// =====================

function verificarTrazadores(
    datos,
    splines
) {

    try {

        let html =
            `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>x</th>
                            <th>f(x)</th>
                            <th>S(x)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

        datos.forEach(
            punto => {

                let valor = 0;

                // Encontrar el spline correcto
                for (
                    let s of splines
                ) {

                    if (
                        punto.x >=
                        s.x0 &&
                        punto.x <=
                        s.x1
                    ) {

                        const dx =
                            punto.x -
                            s.x0;

                        valor =
                            s.a +
                            s.b * dx +
                            s.c * dx * dx +
                            s.d * dx * dx * dx;

                        break;
                    }
                }

                html +=
                    `
                    <tr>
                        <td>${punto.x.toFixed(4)}</td>
                        <td>${punto.fx.toFixed(4)}</td>
                        <td>${valor.toFixed(4)}</td>
                    </tr>
                    `;
            }
        );

        html +=
            `
                    </tbody>
                </table>
            </div>
            `;

        document.getElementById(
            "verificacion-container"
        ).innerHTML = html;

    }
    catch (error) {

        console.error(
            "Error en verificación:",
            error
        );
    }
}


// =====================
// EVALUAR EN UN PUNTO
// =====================

window.evaluarTrazador =
function (x, splines) {

    for (
        let s of splines
    ) {

        if (
            x >= s.x0 &&
            x <= s.x1
        ) {

            const dx =
                x - s.x0;

            const valor =
                s.a +
                s.b * dx +
                s.c * dx * dx +
                s.d * dx * dx * dx;

            return valor;
        }
    }

    return null;
}