
/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data				-- the dataset
 * @param _config			-- variable from the dataset and title for each bar chart
 */

class BarChart {

    constructor(_parentElement, _data, _config) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = _data;
        this.config = _config;

        this.initVis();
    }


    initVis() {
        let vis = this;

        // Set margin
        vis.margin = {top: 25, right: 50, bottom: 10, left: 125};

        // Set width and height
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.config.height - vis.margin.top - vis.margin.bottom;

        // Create SVG
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("class", "barchart")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .range([vis.height, 0])
            .padding(0.15);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Add title
        vis.svg.append("text")
            .attr("x", -vis.margin.left)
            .attr("y", -vis.margin.top / 4)
            .text(vis.config.title)

        // (Filter, aggregate, modify data)
        vis.displayData = vis.data
        vis.wrangleData();
    }


    wrangleData() {
        let vis = this;

        // Group data by key variable and count
        let counts = d3.rollup(vis.displayData, v => v.length, d => d[vis.config.key]);
        vis.displayData = Array.from(counts).map(([key, value]) => ({ key, value }));

        // Sort columns descending
        vis.displayData.sort((a, b) => a.value - b.value);

        // Update the visualization
        vis.updateVis();
    }


    updateVis() {
        let vis = this;

        // Update domains
        vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
        vis.y.domain(vis.displayData.map(d => d.key));

        // Draw rectangles
        let bars = vis.svg.selectAll(".barchart")
            .data(vis.displayData, d => d.key);

        bars.enter()
            .append("rect")
            .attr("class", "barchart")
            .merge(bars)
            .attr("x", 0)
            .attr("height", vis.y.bandwidth())
            .attr("fill", "#6699cc")
            .transition()
            .attr("y", d => vis.y(d.key))
            .attr("width", d => vis.x(d.value));

        bars.exit().remove();

        // Draw labels
        let labels = vis.svg.selectAll(".barlabel")
            .data(vis.displayData, d => d.key);

        labels.enter()
            .append("text")
            .attr("class", "barlabel")
            .merge(labels)
            .text(d => d.value)
            .transition()
            .attr("x", d => vis.x(d.value) + 3)
            .attr("y", d => vis.y(d.key) + vis.y.bandwidth() / 1.25);

        labels.exit().remove();

        // Update the y-axis
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    selectionChanged(brushRegion) {
        let vis = this;

        // Filter data accordingly without changing the original data
        vis.displayData = vis.data.filter(d => brushRegion[0] <= d.DATE && d.DATE <= brushRegion[1]);

        // Update the visualization
        vis.wrangleData();
    }
}
