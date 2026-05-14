/* ===================== */
/* DETERMINANTE */
/* METODO DE GAUSS */
/* ===================== */
function determinantGaussian(originalMatrix){

    const n =
        originalMatrix.length;

    const A =
        cloneMatrix(originalMatrix);

    const steps = [];

    let determinant =
        new Fraction(1);

    let swaps = 0;

    /* ===================== */
    /* MATRIZ INICIAL */
    /* ===================== */
    steps.push({

        operation:
            "Matriz inicial",

        description:
            "Se comienza con la matriz original.",

        matrix:
            cloneMatrix(A),

        pivot:
            1
    });

    /* ===================== */
    /* ELIMINACION */
/* ===================== */
    for(
        let i = 0;
        i < n;
        i++
    ){

        /* ===================== */
        /* PIVOTEO PARCIAL */
        /* ===================== */
        let pivotRow = i;

        for(
            let j = i + 1;
            j < n;
            j++
        ){

            if(

                Math.abs(
                    A[j][i].valueOf()
                ) >

                Math.abs(
                    A[pivotRow][i].valueOf()
                )

            ){

                pivotRow = j;
            }
        }

        /* ===================== */
        /* MATRIZ SINGULAR */
        /* ===================== */
        if(
            A[pivotRow][i]
            .equals(0)
        ){

            return {

                determinant:
                    new Fraction(0),

                steps
            };
        }

        /* ===================== */
        /* INTERCAMBIO FILAS */
        /* ===================== */
        if(
            pivotRow !== i
        ){

            [
                A[i],
                A[pivotRow]
            ] =

            [
                A[pivotRow],
                A[i]
            ];

            swaps++;

            steps.push({

                operation:
                    `F${i+1} \\leftrightarrow F${pivotRow+1}`,

                description:
                    "Se intercambian filas para obtener un mejor pivote.",

                matrix:
                    cloneMatrix(A),

                pivot:
                    i + 1
            });
        }

        /* ===================== */
        /* ELIMINAR ABAJO */
        /* ===================== */
        for(
            let j = i + 1;
            j < n;
            j++
        ){

            if(
                A[j][i]
                .equals(0)
            ){
                continue;
            }

            const factor =

                A[j][i].div(
                    A[i][i]
                );

            for(
                let k = i;
                k < n;
                k++
            ){

                A[j][k] =

                    A[j][k].sub(

                        factor.mul(
                            A[i][k]
                        )
                    );
            }

            steps.push({

                operation:
                `F${j+1} = F${j+1} - (${factor.toFraction(true)})F${i+1}`,

                description:
                    "Se elimina el valor debajo del pivote para triangular la matriz.",

                matrix:
                    cloneMatrix(A),

                pivot:
                    i + 1
            });
        }
    }

    /* ===================== */
    /* PRODUCTO DIAGONAL */
    /* ===================== */
    for(
        let i = 0;
        i < n;
        i++
    ){

        determinant =

            determinant.mul(
                A[i][i]
            );
    }

    /* ===================== */
    /* CAMBIO DE SIGNO */
    /* ===================== */
    if(
        swaps % 2 !== 0
    ){

        determinant =
            determinant.mul(-1);
    }

    /* ===================== */
    /* RETORNAR RESULTADO */
    /* ===================== */
    return {

        determinant,

        steps
    };
}