/* ===================== */
/* SYSTEM STATE */
/* ===================== */
let systemSize = 3;

let systemMatrix = [];

let systemVector = [];

/* ===================== */
/* REFERENCES */
/* ===================== */
const systemMatrixContainer =
    document.getElementById(
        "system-matrix-container"
    );

const systemVectorContainer =
    document.getElementById(
        "system-vector-container"
    );

const systemSizeDisplay =
    document.getElementById(
        "system-size-display"
    );

/* ===================== */
/* CREATE EMPTY */
/* ===================== */
function createSystemData(size){

    return Array.from(
        { length:size },
        () => Array(size).fill("")
    );
}

/* ===================== */
/* RENDER SYSTEM */
/* ===================== */
function renderSystem(){

    if(systemMatrix.length === 0){

        systemMatrix =
            createSystemData(
                systemSize
            );

        systemVector =
            Array(systemSize)
            .fill("");
    }

    systemMatrixContainer.innerHTML = "";
    systemVectorContainer.innerHTML = "";

    systemMatrixContainer.style.gridTemplateColumns =
        `repeat(${systemSize}, auto)`;

    systemVectorContainer.style.gridTemplateColumns =
        `repeat(1, auto)`;

    for(let i=0;i<systemSize;i++){

        for(let j=0;j<systemSize;j++){

            const input =
                document.createElement(
                    "input"
                );

            input.type = "text";

            input.className =
                "matrix-input";

            input.value =
                systemMatrix[i][j];

            input.placeholder = "0";

            input.addEventListener(
                "input",
                () => {

                    systemMatrix[i][j] =
                        input.value;
                }
            );

            systemMatrixContainer
                .appendChild(input);
        }

        const vectorInput =
            document.createElement(
                "input"
            );

        vectorInput.type = "text";

        vectorInput.className =
            "matrix-input";

        vectorInput.placeholder = "0";

        vectorInput.value =
            systemVector[i];

        vectorInput.addEventListener(
            "input",
            () => {

                systemVector[i] =
                    vectorInput.value;
            }
        );

        systemVectorContainer
            .appendChild(vectorInput);
    }

    systemSizeDisplay.textContent =
        `${systemSize} × ${systemSize}`;
}

/* ===================== */
/* SIZE BUTTONS */
/* ===================== */
document
.getElementById(
    "add-system-size"
)
.addEventListener(
    "click",
    () => {

        if(systemSize >= 6)
            return;

        systemSize++;

        renderSystem();
    }
);

document
.getElementById(
    "remove-system-size"
)
.addEventListener(
    "click",
    () => {

        if(systemSize <= 2)
            return;

        systemSize--;

        renderSystem();
    }
);

/* ===================== */
/* GET SYSTEM */
/* ===================== */
function getSystemMatrix(){

    return systemMatrix.map(
        row =>

            row.map(
                value =>

                    parseFloat(
                        value || 0
                    )
            )
    );
}

function getSystemVector(){

    return systemVector.map(
        value =>

            parseFloat(
                value || 0
            )
    );
}

/* ===================== */
/* DETERMINANT */
/* ===================== */
function determinant(matrix){

    const n = matrix.length;

    if(n === 1)
        return matrix[0][0];

    if(n === 2){

        return (
            matrix[0][0] *
            matrix[1][1]

            -

            matrix[0][1] *
            matrix[1][0]
        );
    }

    let det = 0;

    for(let col=0;col<n;col++){

        let sub = [];

        for(let i=1;i<n;i++){

            let row = [];

            for(let j=0;j<n;j++){

                if(j !== col){

                    row.push(
                        matrix[i][j]
                    );
                }
            }

            sub.push(row);
        }

        det +=
            ((col % 2 === 0)
            ? 1 : -1)

            *

            matrix[0][col]

            *

            determinant(sub);
    }

    return det;
}

/* ===================== */
/* REPLACE COLUMN */
/* ===================== */
function replaceColumn(
    matrix,
    vector,
    column
){

    return matrix.map(
        (row, i) =>

            row.map(
                (value, j) =>

                    j === column
                    ? vector[i]
                    : value
            )
    );
}

/* ===================== */
/* MATRIX LATEX */
/* ===================== */
function matrixToLatexNumbers(matrix){

    const rows = matrix.map(
        row =>

            row.join(" & ")

    ).join(" \\\\ ");

    return `
    \\begin{bmatrix}
    ${rows}
    \\end{bmatrix}
    `;
}

/* ===================== */
/* SOLVE CRAMER */
/* ===================== */
function solveCramer(A,B){

    const resultContainer =
        document.getElementById(
            "system-result"
        );

    const procedure =
        document.getElementById(
            "system-procedure"
        );

    procedure.innerHTML = "";

    const D =
        determinant(A);

    resultContainer.innerHTML = `

    <div class="result-card">

        <h3>
            Determinante principal
        </h3>

        <div class="result-value">

            $$
            D=${D}
            $$

        </div>

    </div>
    `;

    if(D === 0){

        procedure.innerHTML = `

        <div class="procedure-placeholder">

            <h4>
                El sistema no
                tiene solución única.
            </h4>

        </div>
        `;

        MathJax.typesetPromise();

        return;
    }

    const vars =
        ["x","y","z","w","v","u"];

    for(let i=0;i<systemSize;i++){

        const replaced =
            replaceColumn(
                A,
                B,
                i
            );

        const Di =
            determinant(
                replaced
            );

        const solution =
            Di / D;

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "step-card";

        card.innerHTML = `

        <div class="step-header">

            <div class="step-number">
                ${i+1}
            </div>

            <div class="step-title">

                Variable
                ${vars[i]}

            </div>

        </div>

        <div class="step-description">

            Se reemplaza la columna
            ${i+1} de la matriz A
            por el vector B.

        </div>

        <div class="step-operation">

            $$
            D_${vars[i]}
            =
            ${Di}
            $$

        </div>

        <div class="step-latex-matrix">

            $$
            ${matrixToLatexNumbers(replaced)}
            $$

        </div>

        <div class="pivot-info">

            $$
            ${vars[i]}
            =
            \\frac{
                ${Di}
            }{
                ${D}
            }
            =
            ${solution}
            $$

        </div>
        `;

        procedure.appendChild(
            card
        );
    }

    MathJax.typesetPromise();
}

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

        const A =
            getSystemMatrix();

        const B =
            getSystemVector();

        const method =
            document.getElementById(
                "system-method"
            ).value;

        /* ===================== */
        /* CRAMER */
        /* ===================== */
        if(method === "cramer"){

            solveCramer(
                A,
                B
            );
        }

        /* ===================== */
        /* GAUSS JORDAN */
        /* ===================== */
        else if(
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
        }
    }
);

/* ===================== */
/* INIT */
/* ===================== */
renderSystem();