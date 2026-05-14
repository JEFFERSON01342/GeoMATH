// =====================
// VARIABLES GLOBALES
// =====================
let grafica = null;
let cientifica = null;
let metodoActual = null;

// =====================
// TABLA DINÁMICA
// =====================
function crearTabla(tipo) {

    const thead = document.querySelector("#tabla-iteraciones thead");
    const tbody = document.querySelector("#tabla-iteraciones tbody");

    thead.innerHTML = "";
    tbody.innerHTML = "";

    let columnas = [];

    switch (tipo) {

        case "biseccion":
            columnas = ["Iteración","a","c","b","f(a)","f(c)","f(b)","f(a)*f(b)","Ea","Er%"];
            break;

        case "reglaFalsa":
            columnas = ["Iteración","a","b","f(a)","f(b)","f(a)*f(b)","c","f(c)","Er%"];
            break;

        case "newton":
            columnas = ["Iteración","xi","f(xi)","f'(xi)","Er%"];
            break;

        case "secante":
            columnas = ["Iteración","xi-1","xi","f(xi-1)","f(xi)","xi+1","Er%"];
            break;

        case "puntoFijo":
            columnas = ["Iteración","xi","g(xi)","Er%","Decisión"];
            break;
    }

    let fila = "<tr>";

    columnas.forEach(col => {
        fila += `<th>${col}</th>`;
    });

    fila += "</tr>";

    thead.innerHTML = fila;
}

// =====================
// INPUTS DINÁMICOS
// =====================
function mostrarInputs(tipo) {

    const grupoA = document.getElementById("input-a-group");
    const grupoB = document.getElementById("input-b-group");
    const grupoX0 = document.getElementById("input-x0-group");

    grupoA.style.display = "none";
    grupoB.style.display = "none";
    grupoX0.style.display = "none";

    // mostrar gx solo punto fijo
    document.getElementById("gx-box").style.display =
        tipo === "puntoFijo" ? "block" : "none";

    if (tipo === "biseccion" || tipo === "reglaFalsa") {

        grupoA.style.display = "block";
        grupoB.style.display = "block";
    }

    if (tipo === "newton") {

        grupoX0.style.display = "block";
    }

    if (tipo === "secante") {

        grupoA.style.display = "block";
        grupoB.style.display = "block";

        document.querySelector("#input-a-group label").innerText = "x₀:";
        document.querySelector("#input-b-group label").innerText = "x₁:";
    }

    if (tipo === "puntoFijo") {

        grupoX0.style.display = "block";

    } else {

        document.querySelector("#input-a-group label").innerText = "a:";
        document.querySelector("#input-b-group label").innerText = "b:";
    }
}

// =====================
// BOTONES MÉTODOS
// =====================
document.querySelectorAll(".metodo-btn").forEach(btn => {

    btn.addEventListener("click", function () {

        let tipo = this.dataset.metodo;

        metodoActual = tipo;

        crearTabla(tipo);

        mostrarInputs(tipo);

        document.querySelectorAll(".metodo-btn")
            .forEach(b => b.classList.remove("activo"));

        this.classList.add("activo");
    });
});

// =====================
// DESMOS
// =====================
window.addEventListener("load", function () {

    grafica = Desmos.GraphingCalculator(
        document.getElementById("grafica"),
        {
            keypad: false,
            expressions: false,
            settingsMenu: false
        }
    );

    cientifica = Desmos.ScientificCalculator(
        document.getElementById("cientifica")
    );

    cientifica.observeEvent('change', function () {

        let estado = cientifica.getState();

        if (
            estado.expressions &&
            estado.expressions.list.length > 0
        ) {

            let latex = estado.expressions.list[0].latex;

            if (latex && latex.includes("x")) {

                grafica.setExpression({
                    id: 'funcion',
                    latex: latex
                });
            }
        }
    });

    // ocultar gx inicialmente
    document.getElementById("gx-box").style.display = "none";
});

// =====================
// LATEX → JS
// =====================
function convertirLatexAJS(latex) {

    let expr = latex;

    expr = expr.replace(/\\left|\\right/g, '');
    expr = expr.replace(/\s+/g, '');

    expr = expr.replace(/\\cdot/g, '*');

    expr = expr.replace(
        /\\frac{([^}]*)}{([^}]*)}/g,
        '($1)/($2)'
    );

    expr = expr.replace(
        /\\sqrt{([^}]*)}/g,
        'Math.sqrt($1)'
    );

    expr = expr.replace(
        /e\^{([^}]*)}/g,
        'Math.exp($1)'
    );

    expr = expr.replace(/\\sin/g, 'Math.sin');
    expr = expr.replace(/\\cos/g, 'Math.cos');
    expr = expr.replace(/\\tan/g, 'Math.tan');
    expr = expr.replace(/\\ln/g, 'Math.log');

    // nuevas trigonométricas
    expr = expr.replace(/\\arcsin/g, 'Math.asin');
    expr = expr.replace(/\\arccos/g, 'Math.acos');
    expr = expr.replace(/\\arctan/g, 'Math.atan');

    expr = expr.replace(/\^\{([^}]*)\}/g, '^($1)');
    expr = expr.replace(/\^/g, '**');

    expr = expr.replace(/(\d)(x)/g, '$1*$2');
    expr = expr.replace(/(x)(\d)/g, '$1*$2');
    expr = expr.replace(/(x)(Math\.)/g, '$1*$2');
    expr = expr.replace(/(\d)(Math\.)/g, '$1*$2');
    expr = expr.replace(/\)(x)/g, ')*$1');
    expr = expr.replace(/(x)\(/g, '$1*(');
    expr = expr.replace(/\)\(/g, ')*(');

    console.log("LATEX:", latex);
    console.log("JS:", expr);

    return expr;
}

// =====================
// EVALUAR FUNCIÓN
// =====================
function evaluarFuncion(expr, x) {

    try {

        let resultado =
            Function("x", "return " + expr)(x);

        if (
            isNaN(resultado) ||
            !isFinite(resultado)
        ) {
            return NaN;
        }

        return resultado;

    } catch (e) {

        console.error(expr);

        return NaN;
    }
}

// =====================
// DERIVADA NUMÉRICA
// =====================
function derivadaNumerica(expr, x) {

    let h = 1e-6;

    return (
        evaluarFuncion(expr, x + h)
        -
        evaluarFuncion(expr, x - h)
    ) / (2 * h);
}

// =====================
// BISECCIÓN
// =====================
function metodoBiseccion(latex, a, b) {

    const tbody =
        document.querySelector("#tabla-iteraciones tbody");

    const resultado =
        document.getElementById("resultado-text");

    tbody.innerHTML = "";

    let expr = convertirLatexAJS(latex);

    let fa = evaluarFuncion(expr, a);
    let fb = evaluarFuncion(expr, b);

    if (fa * fb > 0) {

        alert("El intervalo no encierra raíz");

        return;
    }

    let c, fc;

    for (let i = 1; i <= 50; i++) {

        let c_old = c;

        c = (a + b) / 2;

        fc = evaluarFuncion(expr, c);

        let fab = fa * fb;

        let error =
            i === 1
            ? "-"
            : Math.abs((c - c_old) / c) * 100;

        tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${a.toFixed(6)}</td>
            <td>${c.toFixed(6)}</td>
            <td>${b.toFixed(6)}</td>
            <td>${fa.toFixed(6)}</td>
            <td>${fc.toFixed(6)}</td>
            <td>${fb.toFixed(6)}</td>
            <td>${fab.toFixed(6)}</td>
            <td>${i===1?"-":Math.abs(c-c_old).toFixed(6)}</td>
            <td>${i===1?"-":error.toFixed(4)}</td>
        </tr>
        `;

        if (Math.abs(fc) < 1e-6) break;

        if (fa * fc < 0) {

            b = c;
            fb = fc;

        } else {

            a = c;
            fa = fc;
        }
    }

    resultado.innerText =
        `Raíz ≈ ${c.toFixed(6)}`;
}

// =====================
// REGLA FALSA
// =====================
function metodoReglaFalsa(latex, a, b) {

    const tbody =
        document.querySelector("#tabla-iteraciones tbody");

    const resultado =
        document.getElementById("resultado-text");

    tbody.innerHTML = "";

    let expr = convertirLatexAJS(latex);

    let fa = evaluarFuncion(expr, a);
    let fb = evaluarFuncion(expr, b);

    if (fa * fb > 0) {

        alert("El intervalo no encierra raíz");

        return;
    }

    let c, fc;

    for (let i = 1; i <= 50; i++) {

        let c_old = c;

        c =
            b -
            (fb * (a - b)) /
            (fa - fb);

        fc = evaluarFuncion(expr, c);

        let fab = fa * fb;

        let error =
            i === 1
            ? "-"
            : Math.abs((c - c_old) / c) * 100;

        tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${a.toFixed(6)}</td>
            <td>${b.toFixed(6)}</td>
            <td>${fa.toFixed(6)}</td>
            <td>${fb.toFixed(6)}</td>
            <td>${fab.toFixed(6)}</td>
            <td>${c.toFixed(6)}</td>
            <td>${fc.toFixed(6)}</td>
            <td>${i===1?"-":error.toFixed(4)}</td>
        </tr>
        `;

        if (Math.abs(fc) < 1e-6) break;

        if (fa * fc < 0) {

            b = c;
            fb = fc;

        } else {

            a = c;
            fa = fc;
        }
    }

    resultado.innerText =
        `Raíz ≈ ${c.toFixed(6)}`;
}

// =====================
// NEWTON
// =====================
function metodoNewton(latex, x0) {

    const tbody =
        document.querySelector("#tabla-iteraciones tbody");

    const resultado =
        document.getElementById("resultado-text");

    tbody.innerHTML = "";

    let expr = convertirLatexAJS(latex);

    let xi = x0;

    for (let i = 1; i <= 50; i++) {

        let fxi = evaluarFuncion(expr, xi);

        let dfxi = derivadaNumerica(expr, xi);

        let xi_next =
            xi - (fxi / dfxi);

        let error =
            i === 1
            ? "-"
            : Math.abs((xi_next - xi) / xi_next) * 100;

        tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${xi.toFixed(6)}</td>
            <td>${fxi.toFixed(6)}</td>
            <td>${dfxi.toFixed(6)}</td>
            <td>${i===1?"-":error.toFixed(4)}</td>
        </tr>
        `;

        if (Math.abs(fxi) < 1e-6) break;

        xi = xi_next;
    }

    resultado.innerText =
        `Raíz ≈ ${xi.toFixed(6)}`;
}

// =====================
// SECANTE
// =====================
function metodoSecante(latex, x0, x1) {

    const tbody =
        document.querySelector("#tabla-iteraciones tbody");

    const resultado =
        document.getElementById("resultado-text");

    tbody.innerHTML = "";

    let expr = convertirLatexAJS(latex);

    let xi_1 = x0;
    let xi = x1;

    for (let i = 1; i <= 50; i++) {

        let fxi_1 =
            evaluarFuncion(expr, xi_1);

        let fxi =
            evaluarFuncion(expr, xi);

        let xi_next =
            xi -
            (fxi * (xi - xi_1))
            /
            (fxi - fxi_1);

        let error =
            i === 1
            ? "-"
            : Math.abs((xi_next - xi) / xi_next) * 100;

        tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${xi_1.toFixed(6)}</td>
            <td>${xi.toFixed(6)}</td>
            <td>${fxi_1.toFixed(6)}</td>
            <td>${fxi.toFixed(6)}</td>
            <td>${xi_next.toFixed(6)}</td>
            <td>${i===1?"-":error.toFixed(4)}</td>
        </tr>
        `;

        if (Math.abs(fxi) < 1e-6) break;

        xi_1 = xi;
        xi = xi_next;
    }

    resultado.innerText =
        `Raíz ≈ ${xi.toFixed(6)}`;
}

// =====================
// GENERAR gx
// =====================
function generarCandidatas(fexpr) {

    let candidatas = [];

    // =====================
    // RELAJACIONES GENERALES
    // =====================
    let lambdas = [
        1,
        0.5,
        0.1,
        0.05,
        0.01,
        0.001
    ];

    lambdas.forEach(l => {

        candidatas.push({

            latex:
                `g(x)=x-${l}f(x)`,

            expr:
                `(x - ${l}*(${fexpr}))`
        });
    });

    // =====================
    // DESPEJES POLINÓMICOS
    // =====================

    // x³
    if (fexpr.includes("x**3")) {

        // ejemplo:
        // x^3 + 2x - 63

        candidatas.push({

            latex:
                `g(x)=\\sqrt[3]{63-2x}`,

            expr:
                `Math.cbrt(63 - 2*x)`
        });

        candidatas.push({

            latex:
                `g(x)=\\sqrt[3]{-2x}`,

            expr:
                `Math.cbrt(-2*x)`
        });

        candidatas.push({

            latex:
                `g(x)=x-0.05f(x)`,

            expr:
                `(x - 0.05*(${fexpr}))`
        });
    }

    // x²
    if (fexpr.includes("x**2")) {

        candidatas.push({

            latex:
                `g(x)=\\sqrt{|x|}`,

            expr:
                `Math.sqrt(Math.abs(x))`
        });

        candidatas.push({

            latex:
                `g(x)=\\sqrt{63-2x}`,

            expr:
                `Math.sqrt(Math.abs(63 - 2*x))`
        });

        candidatas.push({

            latex:
                `g(x)=-\\sqrt{63-2x}`,

            expr:
                `-Math.sqrt(Math.abs(63 - 2*x))`
        });
    }

    // x⁴
    if (fexpr.includes("x**4")) {

        candidatas.push({

            latex:
                `g(x)=\\sqrt[4]{x}`,

            expr:
                `Math.pow(Math.abs(x),1/4)`
        });
    }

    // =====================
    // EXPONENCIALES
    // =====================
    if (fexpr.includes("Math.exp")) {

        candidatas.push({

            latex:
                `g(x)=\\ln(x+1)`,

            expr:
                `Math.log(Math.abs(x)+1)`
        });

        candidatas.push({

            latex:
                `g(x)=x-e^x`,

            expr:
                `(x - Math.exp(x))`
        });
    }

    // =====================
    // SENO
    // =====================
    if (fexpr.includes("Math.sin")) {

        // sin(x)
        candidatas.push({

            latex:
                `g(x)=\\sin(x)`,

            expr:
                `Math.sin(x)`
        });

        // x + sin(x)
        candidatas.push({

            latex:
                `g(x)=x+\\sin(x)`,

            expr:
                `(x + Math.sin(x))`
        });

        // x - sin(x)
        candidatas.push({

            latex:
                `g(x)=x-\\sin(x)`,

            expr:
                `(x - Math.sin(x))`
        });

        // relajada
        candidatas.push({

            latex:
                `g(x)=x-0.5f(x)`,

            expr:
                `(x - 0.5*(${fexpr}))`
        });

        // asin
        candidatas.push({

            latex:
                `g(x)=\\arcsin(x)`,

            expr:
                `Math.asin(x)`
        });
    }

    // =====================
    // COSENO
    // =====================
    if (fexpr.includes("Math.cos")) {

        candidatas.push({

            latex:
                `g(x)=\\cos(x)`,

            expr:
                `Math.cos(x)`
        });

        candidatas.push({

            latex:
                `g(x)=x+\\cos(x)`,

            expr:
                `(x + Math.cos(x))`
        });

        candidatas.push({

            latex:
                `g(x)=x-\\cos(x)`,

            expr:
                `(x - Math.cos(x))`
        });

        candidatas.push({

            latex:
                `g(x)=\\arccos(x)`,

            expr:
                `Math.acos(x)`
        });

        candidatas.push({

            latex:
                `g(x)=x-0.3f(x)`,

            expr:
                `(x - 0.3*(${fexpr}))`
        });
    }

    // =====================
    // TANGENTE
    // =====================
    if (fexpr.includes("Math.tan")) {

        candidatas.push({

            latex:
                `g(x)=\\tan(x)`,

            expr:
                `Math.tan(x)`
        });

        candidatas.push({

            latex:
                `g(x)=x+\\tan(x)`,

            expr:
                `(x + Math.tan(x))`
        });

        candidatas.push({

            latex:
                `g(x)=\\arctan(x)`,

            expr:
                `Math.atan(x)`
        });
    }

    // =====================
    // LOGARITMOS
    // =====================
    if (fexpr.includes("Math.log")) {

        candidatas.push({

            latex:
                `g(x)=e^x`,

            expr:
                `Math.exp(x)`
        });

        candidatas.push({

            latex:
                `g(x)=x-\\ln(x)`,

            expr:
                `(x - Math.log(Math.abs(x)+1e-6))`
        });
    }

    // =====================
    // SUAVIZADA UNIVERSAL
    // =====================
    candidatas.push({

        latex:
            `g(x)=x-\\frac{f(x)}{|f(x)|+1}`,

        expr:
            `(x - (${fexpr})/(Math.abs(${fexpr}) + 1))`
    });

    // =====================
    // RELAJACIÓN HIPERSUAVE
    // =====================
    candidatas.push({

        latex:
            `g(x)=x-0.0001f(x)`,

        expr:
            `(x - 0.0001*(${fexpr}))`
    });

    return candidatas;
}

// =====================
// MOSTRAR gx
// =====================
function mostrarGX(candidatas, mejorExpr, x0) {

    const gxList =
        document.getElementById("gx-list");

    gxList.innerHTML = "";

    candidatas.forEach((g, index) => {

        let derivada =
            Math.abs(
                derivadaNumerica(g.expr, x0)
            );

        let converge =
            derivada < 1;

        gxList.innerHTML += `

        <div class="gx-item ${g.expr === mejorExpr ? 'gx-best' : ''}">

            <div class="gx-formula">

                \\[
                ${g.latex}
                \\]

            </div>

            <div class="gx-badge ${converge ? 'gx-ok' : 'gx-bad'}">

                ${
                    converge
                    ? 'Convergencia probable'
                    : 'Posible divergencia'
                }

                |g'(x₀)| =
                ${derivada.toFixed(4)}

            </div>

        </div>
        `;
    });

    // render latex
    if (window.MathJax) {
        MathJax.typeset();
    }
}

// =====================
// PUNTO FIJO INTELIGENTE
// =====================
function metodoPuntoFijoAuto(latex, x0) {

    const tbody =
        document.querySelector("#tabla-iteraciones tbody");

    const resultado =
        document.getElementById("resultado-text");

    tbody.innerHTML = "";

    resultado.innerText = "";

    let fexpr =
        convertirLatexAJS(latex);

    let candidatas =
        generarCandidatas(fexpr);

    let mejor = null;

    let mejorScore = Infinity;

    // =====================
    // EVALUAR CANDIDATAS
    // =====================
    candidatas.forEach(g => {

        try {

            let derivada =
                Math.abs(
                    derivadaNumerica(g.expr, x0)
                );

            let xi = x0;

            let estable = true;

            let errorTotal = 0;

            for (let i = 0; i < 8; i++) {

                let siguiente =
                    evaluarFuncion(g.expr, xi);

                if (
                    !isFinite(siguiente)
                ) {
                    estable = false;
                    break;
                }

                let error =
                    Math.abs(siguiente - xi);

                errorTotal += error;

                // explosión
                if (error > 1e5) {

                    estable = false;

                    break;
                }

                xi = siguiente;
            }

            if (
                estable &&
                derivada < 1 &&
                errorTotal < mejorScore
            ) {

                mejorScore =
                    errorTotal;

                mejor =
                    g.expr;
            }

        } catch {}
    });

    // mostrar
    mostrarGX(
        candidatas,
        mejor,
        x0
    );

    // no encontró
    if (!mejor) {

        resultado.innerText =
            "No se encontró una g(x) estable";

        return;
    }

    // =====================
    // ITERAR
    // =====================
    let xi = x0;

    for (let i = 1; i <= 50; i++) {

        let xi_next =
            evaluarFuncion(mejor, xi);

        if (!isFinite(xi_next)) {

            resultado.innerText =
                "Divergencia numérica";

            return;
        }

        let error =
            Math.abs(xi_next - xi);

        let errorRel =
            i === 1
            ? "-"
            : (
                Math.abs(
                    (xi_next - xi)
                    /
                    xi_next
                ) * 100
            ).toFixed(4);

        let decision =
            error < 1e-6
            ? "Converge"
            : "Iterando";

        tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${xi.toFixed(6)}</td>
            <td>${xi_next.toFixed(6)}</td>
            <td>${errorRel}</td>
            <td>${decision}</td>
        </tr>
        `;

        if (error < 1e-6) {

            resultado.innerText =
                `Raíz ≈ ${xi_next.toFixed(6)}`;

            return;
        }

        if (Math.abs(xi_next) > 1e10) {

            resultado.innerText =
                "Explosión numérica";

            return;
        }

        xi = xi_next;
    }

    resultado.innerText =
        "No convergió en 50 iteraciones";
}

// =====================
// BOTÓN EJECUTAR
// =====================
document
.getElementById("btn-iterar")
.addEventListener("click", () => {

    let estado =
        cientifica.getState();

    if (
        !estado.expressions ||
        estado.expressions.list.length === 0
    ) {

        alert("Escribe una función");

        return;
    }

    let latex =
        estado.expressions.list[0].latex;

    if (!latex.includes("x")) {

        alert("La función debe tener x");

        return;
    }

    // BISECCIÓN / REGLA FALSA
    if (
        metodoActual === "biseccion" ||
        metodoActual === "reglaFalsa"
    ) {

        let a =
            parseFloat(
                document.getElementById("input-a").value
            );

        let b =
            parseFloat(
                document.getElementById("input-b").value
            );

        if (isNaN(a) || isNaN(b)) {

            alert("Ingresa valores válidos");

            return;
        }

        if (metodoActual === "biseccion")
            metodoBiseccion(latex, a, b);

        if (metodoActual === "reglaFalsa")
            metodoReglaFalsa(latex, a, b);
    }

    // NEWTON
    if (metodoActual === "newton") {

        let x0 =
            parseFloat(
                document.getElementById("input-x0").value
            );

        metodoNewton(latex, x0);
    }

    // SECANTE
    if (metodoActual === "secante") {

        let x0 =
            parseFloat(
                document.getElementById("input-a").value
            );

        let x1 =
            parseFloat(
                document.getElementById("input-b").value
            );

        metodoSecante(latex, x0, x1);
    }

    // PUNTO FIJO
    if (metodoActual === "puntoFijo") {

        let x0 =
            parseFloat(
                document.getElementById("input-x0").value
            );

        if (isNaN(x0)) {

            alert("Ingresa x₀");

            return;
        }

        metodoPuntoFijoAuto(
            latex,
            x0
        );
    }
});