/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */


class AreaChart {

    constructor(parentElement, data, panel) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.panel = panel;

        this.initVis();


    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 10, bottom: 20, left: 50};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 250 - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(6);

        // Set domains
        let minMaxX = d3.extent(vis.data.map(function (d) { return d.DATE; }));
        vis.x.domain(minMaxX);

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        // Add labels
        vis.svg.append("text")
            .attr("x", -vis.margin.left)
            .attr("y", -vis.margin.top / 4)
            .text("Total Found Animals")

        // Append a path for the area function, so that it is later behind the brush overlay
        vis.timePath = vis.svg.append("path")
            .attr("class", "area");

        // Add Brushing to Chart
        vis.currentBrushRegion = null;
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", function(event) {
                vis.currentBrushRegion = event.selection;
                vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);

                vis.panel.brushed(event);
            });

        vis.brushGroup = vis.svg.append("g")
            .attr("class", "x brush");

        // Add Zooming to chart
        vis.xOrig = vis.x; // save original scale

        vis.zoomFunction = function(event) {
            vis.x = event.transform.rescaleX(vis.xOrig);
            vis.xAxis.scale(vis.x);
            if (vis.currentBrushRegion) {
                vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.x));
            }
            vis.updateVis();
        }

        vis.zoom = d3.zoom()
            .on("zoom", vis.zoomFunction)
            .scaleExtent([1,20]);

        // Define the clipping region
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // disable mousedown and drag in zoom, when you activate zoom (by .call)
        vis.brushGroup.call(vis.zoom)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null);


        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // (1) Group data by date and count survey results for each day
        let counts = d3.rollup(vis.data, v => v.length, d => new Date(d.DATE.getFullYear(), d.DATE.getMonth()));
        vis.displayData = Array.from(counts).map(([key, value]) => ({ date: key, value }));

        // (2) Sort data by day
        vis.displayData.sort((a, b) => a.date - b.date);

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update y domain
        vis.y.domain([0, d3.max(vis.displayData, function (d) {
            return d.value;
        })]);

        vis.brushGroup.call(vis.brush)
            .selectAll("rect")
            .attr("y", 0)
            .attr("height", vis.height);

        // D3 area path generator
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(function (d) {
                return vis.x(d.date);
            })
            .y0(vis.height)
            .y1(function (d) {
                return vis.y(d.value);
            });


        // Call the area function and update the path
        vis.timePath
            .datum(vis.displayData)
            .attr("d", vis.area)
            .attr("fill", "steelblue")
            .attr("clip-path", "url(#clip)");


        // Update axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }
}
