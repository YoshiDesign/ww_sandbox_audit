import * as d3 from "d3";
import * as topojson from "topojson-client";

/**
 * This is a template file for making a new map.
 * It has color schemes to make a bivariate chloropleth
 */

const path = d3.geoPath()
const svg = d3.create("svg")
    .attr("viewBox", [0, 0, 975, 610])

const labels = ["low", "", "high"]
const schemes = [
    {
      name: "RdBu", 
      colors: [
        "#e8e8e8", "#e4acac", "#c85a5a",
        "#b0d5df", "#ad9ea5", "#985356",
        "#64acbe", "#627f8c", "#574249"
      ]
    },
    {
      name: "BuPu", 
      colors: [
        "#e8e8e8", "#ace4e4", "#5ac8c8",
        "#dfb0d6", "#a5add3", "#5698b9", 
        "#be64ac", "#8c62aa", "#3b4994"
      ]
    },
    {
      name: "GnBu", 
      colors: [
        "#e8e8e8", "#b5c0da", "#6c83b5",
        "#b8d6be", "#90b2b3", "#567994",
        "#73ae80", "#5a9178", "#2a5a5b"
      ]
    },
    {
      name: "PuOr", 
      colors: [
        "#e8e8e8", "#e4d9ac", "#c8b35a",
        "#cbb8d7", "#c8ada0", "#af8e53",
        "#9972af", "#976b82", "#804d36"
      ]
    }
  ]

format = (value) => {
    if (!value) return "N/A";
    let [a, b] = value;
    return `${a}% ${data.title[0]}${labels[x(a)] && ` (${labels[x(a)]})`}
            ${b}% ${data.title[1]}${labels[y(b)] && ` (${labels[y(b)]})`}`
}

color = () => {
    return value => {
        if (!value) return "#ccc";
        let [a, b] = value;
        return colors[y(b) + x(a) * n]
    }
}

// access = () => ({
//     loquo : ''
// })

async function makeMapThree () {

    // All Topologies
    var geoData = await d3.json('./../../datas/new_albers.json');
    // Generate Mesh for States
    const usMesh = topojson.mesh(geoData, geoData.objects.states, (a, b) => a !== b)
    const coTopology = topojson.feature(geoData, geoData.objects.counties).features
    const data = {}

    const loquoAccessor = d => {}
    const pkAccessor = d => {}


    // svg.append(legend)
    //     .attr("transform", "translate(870,450)");

    // Render the county features
    svg.append("g")
        .selectAll("path")
        .data(coTopology)
        .join("path")
            // .attr("fill", d => color(data.get(d.id)))
            .attr("fill", "transparent")
            .attr("d", path)
            // .append("title")
            //     .text(d => `${d.properties.name}, ${usMesh.get(d.id.slice(0, 2)).name}
            //                 ${format(data.get(d.id))}`);

    // Render the state outlines
    svg.append("path")
        .datum(usMesh)
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

        svg.call(zoom);
        document.getElementById("mapThreeAnchor").append(svg.node())

}