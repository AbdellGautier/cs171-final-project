

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

class BarChart {

    constructor(_parentElement, _data, _config) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = _data;
        this.config = _config;

        this.initVis();
    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */
    initVis() {
        let vis = this;

        // Set margin
        vis.margin = {top: 25, right: 50, bottom: 20, left: 100};

        // Set width and height
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 150 - vis.margin.top - vis.margin.bottom;

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




    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        console.log("wrange")

        console.log(vis.data);

        // (1) Group data by key variable (e.g. 'electricity') and count leaves
        let counts = d3.rollup(vis.displayData, v => v.length, d => d[vis.config.key]);
        vis.displayData = Array.from(counts).map(([key, value]) => ({ key, value }));

        // (2) Sort columns descending
        vis.displayData.sort((a, b) => a.value - b.value);

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;

        // (1) Update domains
        vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
        vis.y.domain(vis.displayData.map(d => d.key));

        // (2) Draw rectangles
        let bars = vis.svg.selectAll(".barchart")
            .data(vis.displayData, d => d.key);

        bars.enter()
            .append("rect")
            .attr("class", "barchart")
            .merge(bars)
            .attr("x", 0)
            .attr("height", vis.y.bandwidth())
            .attr("fill", "steelblue")
            .transition()
            .attr("y", d => vis.y(d.key))
            .attr("width", d => vis.x(d.value));

        bars.exit().remove();

        // (2) Draw labels
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
}
