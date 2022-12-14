
/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data				-- the dataset
 * @param _config			-- variable from the dataset and title for each bar chart
 */

class AnimalIntakeVisuals {

    constructor(_parentElement, _data, _config) {

        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = _data;
        this.config = _config;

        this.colors = ['#85d2e2'];

        // Holds the reference to our animal images
        this.animalImages = [
            {
                key: 'Dog',
                img: "images/dog.png",
                posx: 2,
                posy: -1
            },
            {
                key: 'Cat',
                img: "images/cat.png",
                posx: 120,
                posy: -1
            },
            {
                key: 'Other',
                img: "images/other.png",
                posx: 250,
                posy: -1
            },
            {
                key: 'Bird',
                img: "images/bird.png",
                posx: 375,
                posy: -1
            },
            {
                key: 'Livestock',
                img: "images/livestock.png",
                posx: 500,
                posy: -1
            }
        ];

        this.initVis();
    }


    initVis() {

        let vis = this;

        // Set margin
        vis.margin = { top: 20, right: 0, bottom: 0, left: 0 };

        // Set width and height
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 200 - vis.margin.top - vis.margin.bottom;

        // Create SVG
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("class", "barchart")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.defs = vis.svg.append('svg:defs');

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.colorScale = d3.scaleLinear()
            .range(vis.colors);

        // Legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(178,220)`);

        vis.color = d3.scaleLinear()
            .range(vis.colors);

        vis.svg.append("g")
            .attr("class", "xaxis axis");

        vis.xlegend = d3.scaleLinear()
            .range([148, 0]);

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
            .text(vis.config.title);

        // (Filter, aggregate, modify data)
        vis.displayData = vis.data;

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // Group data by key variable and count
        let counts = d3.rollup(vis.displayData, v => v.length, d => d[vis.config.key]);

        vis.displayData = Array.from(counts).map(([key, value]) => ({ key, value }));
        
        // Sort columns descending
        vis.displayData.sort((a, b) => b.value - a.value);

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip');

        vis.colorScale.domain([0, d3.max(vis.displayData, d => d.value)]);

        let otherString = '';

        vis.petgroup = vis.svg.append("g")
            .attr("transform", "translate(275," + 40 + ")");

        vis.displayData.forEach(function (d, i) {

            vis.defs.append("svg:pattern")
                .attr("id", "grump_avatar" + i)
                .attr("width", 100)
                .attr("height", 100)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", vis.animalImages.find((animal) => animal.key == d.key).img)
                .attr("width", 100)
                .attr("height", 100)
                .attr("x", 0)
                .attr("y", 0);

            var circle = vis.petgroup.append("circle")
                .attr("transform", "translate(" + vis.animalImages.find((animal) => animal.key == d.key).posx + "," + vis.animalImages.find((animal) => animal.key == d.key).posy + ")")
                .attr("cx", 100 / 2)
                .attr("cy", 100 / 2)
                .attr("r", 100 / 2)
                .style("fill", "url(#grump_avatar" + i + ")")
                .on('mouseover', function (event) {

                    if (d.key == 'Other') {
                        otherString = 'Other Animals';
                    }
                    else {
                        otherString = d.key;
                    }

                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                        <div class="tooltip-animals">                 
                        <h4> <b>`+ otherString + `</h4>                                                    
                        </div>`);

                    d3.select(this)
                        .attr('class', 'animal-circle');

                    animalType = d.key;
                    animalColor.wrangleData();
                })
                .on('mouseout', function () {

                    vis.tooltip
                        .style("opacity", 0)
                        .html(``);

                    d3.select(this)
                        .attr('class', '');
                });
        });
    }
}
