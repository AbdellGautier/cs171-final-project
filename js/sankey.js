class SankeyChart {

    // constructor method to initialize SankeyChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 10, right: 10, bottom: 10, left: 80};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // format variables
        vis.formatNumber = d3.format(",.0f"), // zero decimal places
            vis.format = function(d) { return vis.formatNumber(d); },
            vis.color = d3.scaleOrdinal(d3.schemeCategory10);


        // append the svg object to the parentElement
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Set the sankey diagram properties
        vis.sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([vis.width, vis.height]);

        vis.path = vis.sankey.links();
        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.graph = vis.sankey(vis.data);

        // add in the links
        vis.link = vis.svg.append("g").selectAll(".link")
            .data(vis.graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke-width", function(d) { return d.width; })
            .attr("stroke", d => d.color)
            .attr("stroke-opacity", 0.5)
            .attr("fill", "none");

        // add the link titles
        vis.link.append("title")
            .text(function(d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + vis.format(d.value); });

        // add in the nodes
        var node = vis.svg.append("g").selectAll(".node")
            .data(vis.graph.nodes)
            .enter().append("g")
            .attr("class", "node");

        // add the rectangles for the nodes
        node.append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("width", vis.sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = vis.color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) {
                return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + vis.format(d.value); });

        // add in the title for the nodes
        node.append("text")
            .attr("x", function(d) { return d.x0 - 6; })
            .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x0 < vis.width / 2; })
            .attr("x", function(d) { return d.x1 + 6; })
            .attr("text-anchor", "start");

    }
}