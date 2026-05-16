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
    // EXPRESIÓN PARA ALGEBRITE
    // =====================

    let exprAlgebrite = latex;

    // quitar left/right
    exprAlgebrite =
        exprAlgebrite.replace(
            /\\left/g,
            ""
        );

    exprAlgebrite =
        exprAlgebrite.replace(
            /\\right/g,
            ""
        );

    // =====================
    // FUNCIONES LATEX → ALGEBRITE
    // =====================

    exprAlgebrite =
        exprAlgebrite.replace(
            /\\sin/g,
            "sin"
        );

    exprAlgebrite =
        exprAlgebrite.replace(
            /\\cos/g,
            "cos"
        );

    exprAlgebrite =
        exprAlgebrite.replace(
            /\\tan/g,
            "tan"
        );

    exprAlgebrite =
        exprAlgebrite.replace(
            /\\ln/g,
            "log"
        );

    // =====================
    // e^{x} → exp(x)
    // =====================

    exprAlgebrite =
        exprAlgebrite.replace(
            /e\^\{([^{}]+)\}/g,
            "exp($1)"
        );

    // =====================
    // MULTIPLICACIÓN IMPLÍCITA
    // 2x → 2*x
    // =====================

    exprAlgebrite =
        exprAlgebrite.replace(
            /(\d)(x)/g,
            "$1*$2"
        );

    exprAlgebrite =
        exprAlgebrite.replace(
            /(x)\(/g,
            "$1*("
        );

    exprAlgebrite =
        exprAlgebrite.replace(
            /\)(x)/g,
            ")*$1"
        );

    console.log(
        "EXPRESION ALGEBRITE:",
        exprAlgebrite
    );

    // =====================
    // DERIVAR
    // =====================

    const derivada =
        Algebrite.run(
            `d(${exprAlgebrite},x)`
        );

    console.log(
        "DERIVADA:",
        derivada
    );

    // =====================
    // CONVERTIR A LATEX
    // =====================

    derivadaLatex =
        Algebrite.run(
            `printlatex(${derivada})`
        );

    console.log(
        "DERIVADA LATEX:",
        derivadaLatex
    );

    // =====================
    // VALIDAR
    // =====================

    if (
        !derivadaLatex
        ||
        derivadaLatex === "nil"
    ) {

        derivadaLatex =
            "\\text{No disponible}";
    }

} catch (error) {

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
        margin-bottom:20px;
        padding:15px;
        border-radius:12px;
        background:#111827;
        color:white;
    ">

        <h3 style="
            margin-bottom:10px;
            color:#60a5fa;
        ">
            Derivada algebraica
        </h3>

        <div style="
            font-size:24px;
            overflow-x:auto;
            color:white;
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


// =====================
// DERIVADA → LATEX
// =====================

function convertirDerivadaALatex(
    expr
) {

    if (!expr) {

        return "";
    }

    let latex = expr;

    // =====================
    // FUNCIONES
    // =====================

    latex =
        latex.replace(
            /sin/g,
            "\\sin"
        );

    latex =
        latex.replace(
            /cos/g,
            "\\cos"
        );

    latex =
        latex.replace(
            /tan/g,
            "\\tan"
        );

    // =====================
    // EXPONENCIAL
    // =====================

    latex =
        latex.replace(
            /exp\((.*?)\)/g,
            "e^{$1}"
        );

    // =====================
    // RAÍZ
    // =====================

    latex =
        latex.replace(
            /sqrt\((.*?)\)/g,
            "\\sqrt{$1}"
        );

    // =====================
    // POTENCIAS
    // =====================

    latex =
        latex.replace(
            /\^/g,
            "^"
        );

    // =====================
    // FRACCIONES
    // =====================

    latex =
        latex.replace(
            /([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/g,
            "\\frac{$1}{$2}"
        );

    // =====================
    // MULTIPLICACIÓN
    // =====================

    latex =
        latex.replace(
            /\*/g,
            " \\cdot "
        );

    return latex;
}