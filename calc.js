import { createEffect, createMemo, createSignal } from "solid-js";
import { untrack } from "solid-js/web";

const OP_ADD = 0;
const OP_SUB = 1;
const OP_MUL = 2;
const OP_DIV = 3;

/** @type {Record<number, (a: number, b: number) => number>} */
const operations = {
    [OP_ADD]: (a, b) => a + b,
    [OP_SUB]: (a, b) => a - b,
    [OP_MUL]: (a, b) => a * b,
    [OP_DIV]: (a, b) => a / b,
};

const [bufferAlpha, setBufferAlpha] = createSignal(
    /** @type {number|undefined} */ (undefined)
);
const [bufferBeta, setBufferBeta] = createSignal(
    /** @type {number|undefined} */ (undefined)
);
const [operation, setOperation] = createSignal(
    /** @type {number|undefined} */ (undefined)
);

function clear() {
    setBufferAlpha(undefined);
    setBufferBeta(undefined);
    setOperation(undefined);
}

function calc() {
    const op = operation();
    if (op == null) return;
    const fn = operations[op];
    if (fn == null) return;
    const a = bufferAlpha();
    const b = bufferBeta();
    if (a == null || b == null) return;

    setBufferAlpha(fn(a, b));
    setBufferBeta(undefined);
    setOperation(undefined);
}

const display = createMemo(() => {
    /** @type {string[]} */
    let str = [];

    const a = bufferAlpha();
    if (a != null) {
        str.push(a + "");
    }

    const op = operation();
    if (op != null) {
        str.push(OP_STR_MAP[op]);
    }

    const b = bufferBeta();
    if (b != null) {
        str.push(b + "");
    }

    return str.join(" ");
});

const screen = /** @type {HTMLInputElement} */ (
    document.getElementById("ecran")
);

createEffect(() => {
    screen.value = display();
});

/** @type {Record<string, number>} */
const STR_OP_MAP = {
    "+": OP_ADD,
    "-": OP_SUB,
    "*": OP_MUL,
    "/": OP_DIV,
};

const OP_STR_MAP = Object.entries(STR_OP_MAP).reduce((map, [str, num]) => {
    map[num] = str;
    return map;
}, /** @type {Record<number, string>} */ ({}));

/**
 * @param {string} str
 */
export function ajouterChiffre(str) {
    untrack(() => {
        if (operation() != null) {
            setBufferBeta(parseFloat((bufferBeta() ?? "") + str));
        } else {
            setBufferAlpha(parseFloat((bufferAlpha() ?? "") + str));
        }
    });
}

/**
 * @param {string} str
 */
export function ajouterOperateur(str) {
    const op = STR_OP_MAP[str];
    if (op != null) {
        setOperation(op);
    }
}

export { clear as effacer, calc as calculer };
