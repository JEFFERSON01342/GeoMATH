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

                /* SHOW TARGET */
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

let matrixData =
    createMatrixData(
        matrixSize
    );

/* ===================== */
/* RENDER MATRIX */
/* ===================== */
function renderMatrix(){

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
                matrixData[i][j] ?? "";

            input.addEventListener(
                "input",
                () => {

                    const value =
                        input.value.trim();

                    try{

                        new Fraction(
                            value || 0
                        );

                        input.style
                            .borderColor =
                            "#fecaca";

                        matrixData[i][j] =
                            value;
                    }
                    catch{

                        input.style
                            .borderColor =
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

        const newSize =
            matrixSize + 1;

        const newMatrix =
            createMatrixData(
                newSize
            );

        /* COPY DATA */
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

                newMatrix[i][j] =
                    matrixData[i]?.[j]
                    ?? "";
            }
        }

        matrixSize =
            newSize;

        matrixData =
            newMatrix;

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

        const newSize =
            matrixSize - 1;

        const newMatrix =
            createMatrixData(
                newSize
            );

        /* COPY DATA */
        for(
            let i = 0;
            i < newSize;
            i++
        ){

            for(
                let j = 0;
                j < newSize;
                j++
            ){

                newMatrix[i][j] =
                    matrixData[i]?.[j]
                    ?? "";
            }
        }

        matrixSize =
            newSize;

        matrixData =
            newMatrix;

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

                        return new Fraction(
                            0
                        );
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

    /* RESULT */
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
                    ${index + 1}
                </div>

                <div class="step-title">

                    ${
                        step.operation ===
                        "Matriz inicial"

                        ? "Matriz inicial"

                        : `Paso ${index + 1}`
                    }

                </div>

            </div>

            <div class="pivot-info">

                Pivote actual:
                F${step.pivot ?? "-"}

            </div>

            <div class="step-description">

                ${
                    step.description
                    ?? ""
                }

            </div>

            <div class="step-operation">

                $$
                ${
                    step.operation
                    ?? ""
                }
                $$

            </div>

            <div class="step-latex-matrix">

                ${
                    renderLatexMatrix(
                        step.matrix
                    )
                }

            </div>
            `;

            procedureContainer
                .appendChild(
                    card
                );
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

        if(
            method ===
            "triangulation"
        ){

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
/* SYSTEM CONTROLLER */
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

        if(method === "cramer"){

            solveCramer(
                A,
                B
            );

            return;
        }

        if(
            method ===
            "gauss-jordan"
        ){

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

        if(
            method ===
            "gaussian"
        ){

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

        if(method === "LU"){

            const result =
                solveLU(
                    A,
                    B
                );

            renderLU(
                result
            );

            return;
        }

        if(
            method ===
            "jacobi"
        ){

            const result =
                solveJacobi(
                    A,
                    B
                );

            renderJacobi(
                result
            );
        }

        if(
    method ===
    "gauss-seidel"
){

    const result =
        solveGaussSeidel(
            A,
            B
        );

    renderGaussSeidel(
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