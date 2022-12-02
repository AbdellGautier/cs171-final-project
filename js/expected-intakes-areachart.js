
/*
 * StackedAreaChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

class StackedAreaChartExpectedIntakes {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.colors = ['#F29361', '#1f78b4'];

        this.dataCategories = ["expected", "actual"]

        // Set ordinal color scale
        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(this.colors);

        this.initVis();
    }


    /*
     * Method that initializes the visualization (static content, e.g. SVG area or axes)
     */
    initVis(){
        let vis = this;

        vis.margin = {top: 50, right: 85, bottom: 60, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Overlay with path clipping
        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")

            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, d => d.date));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

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
            .attr("x", vis.width / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .text("Your Expectations vs Reality: Found Animals in Austin, TX");

        // Add legend
        let legendData = this.dataCategories.map((d, i) => ({
            data: d, color: this.colors[i]
        })).reverse();

        vis.svg.selectAll(".intake-areachart-legend-rect")
            .data(legendData)
            .enter()
            .append("rect")
            .attr("class", "intake-areachart-legend-rect")
            .attr("x", 10 + vis.width)
            .attr("y", (_, i) => vis.height / 2 + i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => d.color);

        vis.svg.selectAll(".intake-areachart-legend-text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("class", "intake-areachart-legend-text")
            .attr("x", 25 + vis.width)
            .attr("y", (_, i) => vis.height / 2 + 9 + i * 20)
            .text(d => d.data[0].toUpperCase() + d.data.slice(1))

        // Initialize stack layout
        let stack = d3.stack()
            .keys(vis.dataCategories);

        // Stack data
        vis.stackedData = stack(vis.data);

        // Stacked area layout
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(d => vis.x(d.data.date))
            .y0(d => vis.y(d[0]))
            .y1(d => vis.y(d[1]));

        vis.wrangleData();

    }

    /*
     * Data wrangling
     */
    wrangleData(){
        let vis = this;

        vis.displayData = vis.stackedData;


        // Update the visualization
        vis.updateVis();
    }

    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */
    updateVis(){
        let vis = this;

        // Update domain
        // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
        vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
        ]);

        vis.displayData[0] = vis.displayData[0].sort((a, b) => a.data.date - b.data.date);
        vis.displayData[1] = vis.displayData[1].sort((a, b) => a.data.date - b.data.date);

        // Draw the layers
        let categories = vis.svg.selectAll(".area")
            .data(vis.displayData);

        categories.enter().append("path")
            .attr("class", "area")
            .merge(categories)
            .style("fill", d => {
                return vis.colorScale(d)
            })
            .attr("d", d => vis.area(d))


        categories.exit().remove();

        // Add tooltip
        // Create tooltip group
        let tooltip = vis.svg.append("g")
            .style("display", "none");

        // Draw tooltip vertical bar
        tooltip.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", vis.height)
            .attr("width", 0.25)
            .attr("stroke", "black");

        // Add tooltip label
        let tooltipLabel = tooltip.append("text")
            .attr("y", 10)
            .attr("x", 10)
            .attr("id", "expected-intakes-tooltip-label")
            .text("Label");

        // Add tooltip sub-label
        let tooltipActual = tooltip.append("text")
            .attr("y", 25)
            .attr("x", 10)
            .attr("class", "expected-intakes-tooltip-sublabel")
            .text("Sub-label");

        let tooltipExpected = tooltip.append("text")
            .attr("y", 35)
            .attr("x", 10)
            .attr("class", "expected-intakes-tooltip-sublabel")
            .text("Sub-label");

        // Add listener for area chart that updates the tooltip
        // group based on mouse position
        vis.svg.append("rect")
            .attr("class", "listener-rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", vis.height)
            .attr("width", vis.width)
            .attr("fill-opacity", "0")
            .on("mouseover", _ => tooltip.style("display", null))
            .on("mouseout", _ => tooltip.style("display", "none"))
            .on("mousemove", (event) => {
                // Get data element with the closest date to the mouse position
                let mousePos = d3.pointer(event)[0];
                let dateAtMousePos = vis.x.invert(mousePos);

                let bisectDate = d3.bisector(d => d.data.date).left;

                let closestElementIdx = bisectDate(vis.displayData[0], dateAtMousePos);

                let d = vis.displayData[0][closestElementIdx];

                // Update tooltip with the population and date from element
                tooltipLabel.text(d.data.date.toLocaleDateString("en-US"));
                tooltipActual.text(`${Math.round(d.data.actual + d.data.expected)} actual animals`);
                tooltipExpected.text(`${Math.round(d.data.expected)} expected animals`);

                tooltip.attr("transform", `translate(${mousePos}, 0)`);
            });

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}