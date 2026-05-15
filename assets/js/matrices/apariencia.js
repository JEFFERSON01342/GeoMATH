/* ===================== */
/* SIDEBAR NAVIGATION */
/* ===================== */
const sidebarButtons =
    document.querySelectorAll(
        ".sidebar-option"
    );

const screens =
    document.querySelectorAll(
        ".screen"
    );

sidebarButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                /* REMOVE ACTIVE */
                sidebarButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );

                /* ACTIVE BUTTON */
                button.classList.add(
                    "active"
                );

                /* HIDE SCREENS */
                screens.forEach(
                    screen => {

                        screen.classList.remove(
                            "active-screen"
                        );

                    }
                );

                /* SHOW TARGET SCREEN */
                const target =
                    button.dataset.screen;

                document
                    .getElementById(
                        `screen-${target}`
                    )
                    .classList.add(
                        "active-screen"
                    );

            }
        );

    }
);

/* ===================== */
/* DOM REFERENCES */
/* ===================== */
const matrixContainer =
    document.getElementById(
        "matrix-container"
    );

const matrixSizeDisplay =
    document.getElementById(
        "matrix-size-display"
    );

const addSizeBtn =
    document.getElementById(
        "add-size"
    );

const removeSizeBtn =
    document.getElementById(
        "remove-size"
    );

/* ===================== */
/* GLOBAL MATRIX STATE */
/* ===================== */
let matrixSize = 3;

let matrixData = [];

/* ===================== */
/* RENDER MATRIX */
/* ===================== */
function renderMatrix(){

    if(
        matrixData.length === 0
    ){

        matrixData =
            createMatrixData(
                matrixSize
            );
    }

    matrixContainer.innerHTML =
        "";

    matrixContainer.style
        .gridTemplateColumns =
        `repeat(${matrixSize}, auto)`;

    for(
        let i = 0;
        i < matrixSize;
        i++
    ){

        for(
            let j = 0;
            j < matrixSize;
            j++
        ){

            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "text";

            input.className =
                "matrix-input";

            input.placeholder =
                "0";

            input.value =
                matrixData[i][j];

            input.addEventListener(
                "input",
                () => {

                    const value =
                        input.value.trim();

                    try{

                        new Fraction(
                            value || 0
                        );

                        input.style.borderColor =
                            "#fecaca";

                        matrixData[i][j] =
                            value;

                    }
                    catch{

                        input.style.borderColor =
                            "red";
                    }

                }
            );

            matrixContainer
                .appendChild(
                    input
                );
        }
    }

    matrixSizeDisplay.textContent =
        `${matrixSize} × ${matrixSize}`;
}

/* ===================== */
/* ADD MATRIX SIZE */
/* ===================== */
addSizeBtn.addEventListener(
    "click",
    () => {

        if(matrixSize >= 10)
            return;

        matrixSize++;

        matrixData.push(
            Array(matrixSize)
            .fill("")
        );

        matrixData.forEach(
            row => {

                while(
                    row.length <
                    matrixSize
                ){

                    row.push("");

                }

            }
        );

        renderMatrix();

    }
);

/* ===================== */
/* REMOVE MATRIX SIZE */
/* ===================== */
removeSizeBtn.addEventListener(
    "click",
    () => {

        if(matrixSize <= 1)
            return;

        matrixSize--;

        matrixData.pop();

        matrixData.forEach(
            row => {

                row.pop();

            }
        );

        renderMatrix();

    }
);

/* ===================== */
/* GET MATRIX */
/* ===================== */
function getMatrix(){

    return matrixData.map(
        row =>

            row.map(
                value => {

                    try{

                        return new Fraction(
                            value || 0
                        );

                    }
                    catch{

                        return new Fraction(0);

                    }

                }
            )
    );
}

/* ===================== */
/* RENDER LATEX MATRIX */
/* ===================== */
function renderLatexMatrix(matrix){

    return `
    $$
    ${matrixToLatex(matrix)}
    $$
    `;
}

/* ===================== */
/* RENDER PROCEDURE */
/* ===================== */
function renderProcedure(result){

    const procedureContainer =

        document.getElementById(
            "procedure-content"
        );

    const resultContainer =

        document.getElementById(
            "determinant-result"
        );

    /* CLEAR */
    procedureContainer.innerHTML =
        "";

    /* FINAL RESULT */
    resultContainer.innerHTML =

    `
    <div class="result-card">

        <h3>
            Determinante
        </h3>

        <div class="result-value">

            $$
            ${fractionToLatex(
                result.determinant
            )}
            $$

        </div>

    </div>
    `;

    /* STEPS */
    result.steps.forEach(
        (step, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "step-card";

            card.innerHTML =

            `
            <div class="step-header">

                <div class="step-number">
                    ${index}
                </div>

                <div class="step-title">

                    ${step.operation === "Matriz inicial"

                        ? "Matriz inicial"

                        : `Paso ${index}`}

                </div>

            </div>

            <div class="pivot-info">

                Pivote actual:
                F${step.pivot}

            </div>

            <div class="step-description">

                ${step.description}

            </div>

            <div class="step-operation">

                $$
                ${step.operation}
                $$

            </div>

            <div class="step-latex-matrix">

                ${renderLatexMatrix(
                    step.matrix
                )}

            </div>
            `;

            procedureContainer
                .appendChild(card);

        }
    );

    /* RENDER LATEX */
    if(window.MathJax){

        MathJax.typesetPromise();
    }
}

/* ===================== */
/* SOLVE DETERMINANT */
/* ===================== */
/* ===================== */
/* SOLVE DETERMINANT */
/* ===================== */
const solveButton =

    document.getElementById(
        "solve-determinant"
    );

solveButton.addEventListener(
    "click",
    () => {

        const matrix =
            getMatrix();

        const method =
            document.getElementById(
                "determinant-method"
            ).value;

        let result;

        /* ===================== */
        /* EXPANSION */
        /* ===================== */
        if(method === "cramer"){

            result =

                determinantExpansion(
                    matrix
                );

            renderDeterminantExpansion(
                result
            );

            return;
        }

        /* ===================== */
        /* METODO GAUSS */
        /* ===================== */
        if(method === "gauss"){

            result =

                determinantGaussian(
                    matrix
                );

            renderProcedure(
                result
            );

            return;
        }

        /* ===================== */
        /* TRIANGULACION */
        /* ===================== */
        if(method === "triangulation"){

            result =

                determinantTriangulation(
                    matrix
                );

            renderProcedure(
                result
            );

            return;
        }

    }
);

/* ===================== */
/* MAIN CONTROLLER */
/* ===================== */
document
.getElementById(
    "solve-system"
)
.addEventListener(
    "click",
    () => {

        const method =
            document.getElementById(
                "system-method"
            ).value;

        const A =
            getSystemMatrix();

        const B =
            getSystemVector();

        /* ===================== */
        /* CRAMER */
        /* ===================== */
        if(method === "cramer"){

            solveCramer(A, B);

            return;
        }

        /* ===================== */
        /* GAUSS JORDAN */
        /* ===================== */
        if(method === "gauss-jordan"){

            const result =
                solveGaussJordan(
                    A,
                    B
                );

            renderGaussJordan(
                result
            );

            return;
        }

        /* ===================== */
        /* TRIANGULACION */
        /* ===================== */
        if(method === "gaussian"){

            const result =
                solveGaussianElimination(
                    A,
                    B
                );

            renderGaussianElimination(
                result
            );

            return;
        }
    }
);

/* ===================== */
/* INIT */
/* ===================== */
renderMatrix();