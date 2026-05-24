// =====================
// PARSER.JS
// TAYLOR
// LATEX → JS
// =====================


// =====================
// CONVERTIR LATEX
// =====================

window.convertirLatexAJS =
function (latex) {

    try {

        if (!latex) {

            return "";
        }

        // =====================
        // LIMPIAR
        // =====================

        let expr =
            latex;

        // quitar espacios
        expr =
            expr.replace(/\s+/g, "");

        // =====================
        // FRACCIONES
        // \frac{a}{b}
        // =====================

        while (
            expr.includes("\\frac")
        ) {

            expr =
                expr.replace(

                    /\\frac\{([^{}]+)\}\{([^{}]+)\}/g,

                    "($1)/($2)"
                );
        }

        // =====================
        // RAÍCES
        // =====================

        expr =
            expr.replace(

                /\\sqrt\{([^{}]+)\}/g,

                "sqrt($1)"
            );

        // =====================
        // PI
        // =====================

        expr =
            expr.replace(
                /\\pi/g,
                "pi"
            );

        // =====================
        // EULER
        // =====================

        expr =
            expr.replace(
                /\\left/g,
                ""
            );

        expr =
            expr.replace(
                /\\right/g,
                ""
            );

        // =====================
        // FUNCIONES
        // =====================

        expr =
            expr.replace(
                /\\sin/g,
                "sin"
            );

        expr =
            expr.replace(
                /\\cos/g,
                "cos"
            );

        expr =
            expr.replace(
                /\\tan/g,
                "tan"
            );

        expr =
            expr.replace(
                /\\ln/g,
                "log"
            );

        expr =
            expr.replace(
                /\\log/g,
                "log10"
            );

        expr =
            expr.replace(
                /\\exp/g,
                "exp"
            );

        // =====================
        // POTENCIAS
        // =====================

        expr =
            expr.replace(
                /\^/g,
                "**"
            );

        // =====================
        // MULTIPLICACIÓN IMPLÍCITA
        // 2x → 2*x
        // =====================

        expr =
            expr.replace(
                /(\d)([a-zA-Z])/g,
                "$1*$2"
            );

        // =====================
        // x(
        // =====================

        expr =
            expr.replace(
                /([a-zA-Z])\(/g,
                "$1*("
            );

        // =====================
        // )( 
        // =====================

        expr =
            expr.replace(
                /\)\(/g,
                ")*("
            );

        // =====================
        // )x
        // =====================

        expr =
            expr.replace(
                /\)([a-zA-Z])/g,
                ")*$1"
            );

        // =====================
        // CONSTANTES
        // =====================

        expr =
            expr.replace(
                /\bpi\b/g,
                "Math.PI"
            );

        expr =
            expr.replace(
                /\be\b/g,
                "Math.E"
            );

        // =====================
        // FUNCIONES JS
        // =====================

        expr =
            expr.replace(
                /\bsin\(/g,
                "Math.sin("
            );

        expr =
            expr.replace(
                /\bcos\(/g,
                "Math.cos("
            );

        expr =
            expr.replace(
                /\btan\(/g,
                "Math.tan("
            );

        expr =
            expr.replace(
                /\bsqrt\(/g,
                "Math.sqrt("
            );

        expr =
            expr.replace(
                /\blog\(/g,
                "Math.log("
            );

        expr =
            expr.replace(
                /\blog10\(/g,
                "Math.log10("
            );

        expr =
            expr.replace(
                /\bexp\(/g,
                "Math.exp("
            );

        console.log(
            "LATEX:",
            latex
        );

        console.log(
            "JS:",
            expr
        );

        return expr;

    }
    catch (error) {

        console.error(
            "ERROR PARSER:",
            error
        );

        return "";
    }
};


// =====================
// EVALUAR FUNCIÓN
// =====================

window.evaluarFuncionTaylor =
function (

    expr,
    x

) {

    try {

        const funcion =
            new Function(

                "x",

                `
                return ${expr};
                `
            );

        const resultado =
            funcion(x);

        if (

            isNaN(resultado)

            ||

            !isFinite(resultado)

        ) {

            return NaN;
        }

        return resultado;

    }
    catch (error) {

        console.error(
            "ERROR EVALUANDO:",
            error
        );

        return NaN;
    }
};


// =====================
// FACTORIAL
// =====================

window.factorial =
function (n) {

    if (n <= 1) {

        return 1;
    }

    let resultado =
        1;

    for (

        let i = 2;
        i <= n;
        i++

    ) {

        resultado *= i;
    }

    return resultado;
};


// =====================
// FORMATEAR NÚMERO
// =====================

window.formatearNumero =
function (valor) {

    if (

        isNaN(valor)

        ||

        !isFinite(valor)

    ) {

        return "NaN";
    }

    return Number(valor)
        .toFixed(10)
        .replace(/\.?0+$/, "");
};