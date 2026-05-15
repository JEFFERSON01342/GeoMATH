// =====================
// EVALUAR FUNCIÓN
// =====================

function evaluarFuncion(
    expr,
    x
) {

    try {

        // =====================
        // VALIDAR ENTRADAS
        // =====================

        if (
            expr === undefined ||
            expr === null ||
            expr === ""
        ) {

            return NaN;
        }

        if (
            !isFinite(x)
        ) {

            return NaN;
        }

        // =====================
        // CONTEXTO MATH
        // =====================

        const scope = {

            x,

            PI:
                Math.PI,

            E:
                Math.E,

            sin:
                Math.sin,

            cos:
                Math.cos,

            tan:
                Math.tan,

            asin:
                Math.asin,

            acos:
                Math.acos,

            atan:
                Math.atan,

            sinh:
                Math.sinh,

            cosh:
                Math.cosh,

            tanh:
                Math.tanh,

            sqrt:
                Math.sqrt,

            abs:
                Math.abs,

            floor:
                Math.floor,

            ceil:
                Math.ceil,

            round:
                Math.round,

            log:
                Math.log,

            log10:
                Math.log10
                    ? Math.log10
                    : function (n) {

                        return (
                            Math.log(n)
                            /
                            Math.LN10
                        );
                    },

            exp:
                Math.exp,

            pow:
                Math.pow,

            min:
                Math.min,

            max:
                Math.max
        };

        // =====================
        // CREAR FUNCIÓN
        // =====================

        const funcion =
            Function(

                ...Object.keys(scope),

                `
                "use strict";
                return (${expr});
                `
            );

        // =====================
        // EVALUAR
        // =====================

        const resultado =
            funcion(
                ...Object.values(scope)
            );

        // =====================
        // VALIDACIÓN
        // =====================

        if (
            resultado === undefined ||
            resultado === null ||
            !isFinite(resultado) ||
            isNaN(resultado)
        ) {

            return NaN;
        }

        return Number(resultado);

    } catch (error) {

        console.error(
            "Error evaluando:",
            expr,
            "x =",
            x,
            error
        );

        return NaN;
    }
}


// =====================
// DERIVADA NUMÉRICA
// DIFERENCIAS CENTRALES
// =====================

function derivadaNumerica(
    expr,
    x
) {

    try {

        // =====================
        // h ADAPTATIVO
        // =====================

        const h =
            Math.max(
                1e-6,
                Math.abs(x) * 1e-6
            );

        const fxh1 =
            evaluarFuncion(
                expr,
                x + h
            );

        const fxh2 =
            evaluarFuncion(
                expr,
                x - h
            );

        // =====================
        // VALIDAR
        // =====================

        if (
            isNaN(fxh1) ||
            isNaN(fxh2)
        ) {

            return NaN;
        }

        // =====================
        // DIFERENCIA CENTRAL
        // =====================

        const derivada =
            (
                fxh1
                -
                fxh2
            )
            /
            (
                2 * h
            );

        // =====================
        // VALIDAR RESULTADO
        // =====================

        if (
            !isFinite(
                derivada
            ) ||
            isNaN(
                derivada
            )
        ) {

            return NaN;
        }

        return derivada;

    } catch (error) {

        console.error(
            "Error derivada:",
            error
        );

        return NaN;
    }
}


// =====================
// SEGUNDA DERIVADA
// =====================

function segundaDerivada(
    expr,
    x
) {

    try {

        const h =
            1e-5;

        const fxh1 =
            evaluarFuncion(
                expr,
                x + h
            );

        const fx =
            evaluarFuncion(
                expr,
                x
            );

        const fxh2 =
            evaluarFuncion(
                expr,
                x - h
            );

        // =====================
        // VALIDAR
        // =====================

        if (
            isNaN(fxh1) ||
            isNaN(fx) ||
            isNaN(fxh2)
        ) {

            return NaN;
        }

        // =====================
        // SEGUNDA DERIVADA
        // =====================

        const resultado =
            (
                fxh1
                -
                (2 * fx)
                +
                fxh2
            )
            /
            (
                h * h
            );

        if (
            !isFinite(resultado) ||
            isNaN(resultado)
        ) {

            return NaN;
        }

        return resultado;

    } catch (error) {

        console.error(
            "Error segunda derivada:",
            error
        );

        return NaN;
    }
}


// =====================
// VALIDAR INTERVALO
// f(a) * f(b) < 0
// =====================

function validarIntervalo(
    expr,
    a,
    b
) {

    const fa =
        evaluarFuncion(
            expr,
            a
        );

    const fb =
        evaluarFuncion(
            expr,
            b
        );

    if (
        isNaN(fa) ||
        isNaN(fb)
    ) {

        return false;
    }

    return (
        fa * fb
    ) < 0;
}


// =====================
// BUSCAR CAMBIO SIGNO
// =====================

function buscarIntervalos(
    expr,
    inicio = -10,
    fin = 10,
    paso = 1
) {

    const intervalos = [];

    for (
        let x = inicio;
        x < fin;
        x += paso
    ) {

        const fx1 =
            evaluarFuncion(
                expr,
                x
            );

        const fx2 =
            evaluarFuncion(
                expr,
                x + paso
            );

        if (
            isNaN(fx1) ||
            isNaN(fx2)
        ) {

            continue;
        }

        // raíz exacta
        if (
            fx1 === 0
        ) {

            intervalos.push({

                a: x,
                b: x
            });

            continue;
        }

        // cambio de signo
        if (
            fx1 * fx2 < 0
        ) {

            intervalos.push({

                a: x,
                b: x + paso
            });
        }
    }

    return intervalos;
}