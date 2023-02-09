import * as d3 from "d3";


export function makeCanvasContext(canvas) {

    var context = canvas.getContext("2d");
    context.canvas.style.maxWidth = "100%";
    context.canvas.value = context;

    return context;
}

export async function loadData() {
    return await d3.json('/land-110m.json')
}