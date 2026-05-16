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

    resultado.innerHTML =
        "Calculando...";

    // =====================
    // CONVERTIR FUNCIÓN
    // =====================

    const expr =
        window.convertirLatexAJS(
            latex
        );

    console.log(
        "EXPRESION JS:",
        expr
    );

    // =====================
    // DERIVADA ALGEBRAICA
    // =====================

    let derivadaLatex =
        "\\text{No disponible}";

    try {

        // =====================
        // EXPRESIÓN JS
        // =====================

        const exprDerivada =
            window.convertirLatexAJS(
                latex
            );

        console.log(
            "EXPRESION DERIVAR:",
            exprDerivada
        );

        // =====================
        // DERIVAR CON MATHJS
        // =====================

        const derivada =
            math
            .derivative(
                exprDerivada,
                "x"
            );

        console.log(
            "DERIVADA:",
            derivada.toString()
        );

        // =====================
        // CONVERTIR A LATEX
        // =====================

        derivadaLatex =
            derivada.toTex({
                parenthesis: "keep"
            });

        console.log(
            "DERIVADA LATEX:",
            derivadaLatex
        );

    }
    catch(error){

        console.error(
            "ERROR DERIVADA:",
            error
        );

        derivadaLatex =
            "\\text{No disponible}";
    }

    // =====================
    // MOSTRAR DERIVADA
    // =====================

    resultado.innerHTML = `
<div style="
    margin-bottom:24px;
    padding:22px;
    border-radius:22px;

    background:
    linear-gradient(
        145deg,
        #991b1b,
        #7f1d1d
    );

    border:2px solid #ef4444;

    box-shadow:
        0 10px 30px rgba(239,68,68,0.18);

    position:relative;

    overflow:hidden;
">

    <!-- brillo decorativo -->
    <div style="
        position:absolute;
        top:-40px;
        right:-40px;

        width:140px;
        height:140px;

        background:
        radial-gradient(
            circle,
            rgba(255,255,255,0.15),
            transparent
        );

        border-radius:50%;
    "></div>

    <!-- título -->
    <div style="
        display:flex;
        align-items:center;
        gap:12px;
        margin-bottom:18px;
    ">

        <div style="
            width:42px;
            height:42px;

            border-radius:12px;

            background:
            rgba(255,255,255,0.12);

            display:flex;
            align-items:center;
            justify-content:center;

            font-size:22px;
        ">
            ∂
        </div>

        <div>

            <h3 style="
                margin:0;
                color:white;
                font-size:22px;
                font-weight:700;
            ">
                Derivada algebraica
            </h3>

            <p style="
                margin:4px 0 0 0;
                color:#fecaca;
                font-size:14px;
            ">
                Derivada simbólica de la función
            </p>

        </div>

    </div>

    <!-- fórmula -->
    <div style="
        padding:18px;

        border-radius:18px;

        background:
        rgba(255,255,255,0.08);

        border:
        1px solid rgba(255,255,255,0.12);

        overflow-x:auto;

        color:white;

        font-size:28px;

        text-align:center;
    ">

        $$f'(x)=${derivadaLatex}$$

    </div>

</div>
    `;

    // =====================
    // REFRESCAR MATHJAX
    // =====================

    if (
        window.MathJax
    ) {

        MathJax.typesetPromise();
    }

    // =====================
    // LIMPIAR PUNTOS
    // =====================

    window.eliminarPunto(
        "raiz"
    );

    // =====================
    // LIMPIAR ITERACIONES
    // =====================

    if (
        window.limpiarIteraciones
    ) {

        window.limpiarIteraciones();
    }

    // =====================
    // CONFIG
    // =====================

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

            resultado.innerHTML += `
                <p style="
                    color:red;
                    margin-top:10px;
                ">
                    Error evaluando la función
                </p>
            `;

            return;
        }

        // =====================
        // DERIVADA CERO
        // =====================

        if (
            Math.abs(dfxi)
            < 1e-12
        ) {

            resultado.innerHTML += `
                <p style="
                    color:red;
                    margin-top:10px;
                ">
                    Derivada cercana a cero
                </p>
            `;

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
        // GRAFICAR
        // =====================

        window.agregarPunto(
            xi,
            fxi,
            `iteracion-${i}`
        );

        // =====================
        // CRITERIO PARO
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

            resultado.innerHTML += `
                <p style="
                    margin-top:15px;
                    font-size:18px;
                    color:#22c55e;
                ">
                    Raíz ≈ ${xi.toFixed(6)}
                </p>
            `;

            return;
        }

        // =====================
        // DIVERGENCIA
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

            resultado.innerHTML += `
                <p style="
                    color:red;
                    margin-top:10px;
                ">
                    Divergencia numérica
                </p>
            `;

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

    resultado.innerHTML += `
        <p style="
            margin-top:15px;
            color:orange;
        ">
            Raíz aproximada ≈
            ${xi.toFixed(6)}

            <br>

            (máximo de iteraciones alcanzado)
        </p>
    `;
};
