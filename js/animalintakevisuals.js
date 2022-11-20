
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

        this.colors = ['#EBF4F3','#3c948b']


        this.initVis();
    }


    initVis() {
        let vis = this;

        // Set margin
        vis.margin = {top: 30, right: 10, bottom: 0, left: 5};

        // Set width and height
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

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
        .range(vis.colors)

        //Legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(178,220)`)

        vis.color = d3.scaleLinear()
            .range(vis.colors)


        vis.svg.append("g")
            .attr("class", "xaxis axis");

        vis.xlegend=d3.scaleLinear()
            //.domain(vis.colors)
            .range([148,0])


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
        vis.displayData.sort((a, b) => b.value - a.value);

        console.log(vis.displayData);

        vis.displayData.forEach(function(d){
            if (d.key=='Dog'){
                d.img="images/dog.jpg"
                d.posx= 5
                d.posy= 100
            }
            if (d.key=='Cat'){
                d.img="images/cat.png"
                d.posx= 120
                d.posy= 100
            }
            if (d.key=='Livestock'){
                d.img="images/livestock.jpg"
                d.posx= 500
                d.posy= 100
            }
            if (d.key=='Bird'){
                d.img="images/birds.jpg"
                d.posx= 375
                d.posy= 100
            }
            if (d.key=='Other'){
                d.img="images/other.jpg"
                d.posx= 250
                d.posy= 100
            }

        });

        // Update the visualization
        vis.updateVis();
    }


    updateVis() {
        let vis = this;

        console.log("Animal Intake Visuals", vis.displayData);

        //vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
        vis.color.domain([0,  d3.max(vis.displayData, d=> d.value)]);
        vis.xlegend.domain([0, d3.max(vis.displayData, d=> d.value)]);
        vis.xAxislegend = d3.axisBottom().scale(vis.xlegend).tickValues([d3.max(vis.displayData, d=> d.value),d3.min(vis.displayData, d=> d.value)])//.tickFormat(d => parseInt(d/1000) + "k");
        vis.svg.select(".xaxis").call(vis.xAxislegend)
            .attr("transform", "translate("+400+"," + 240 + ")");

        vis.colorScale.domain([0,  d3.max(vis.displayData, d=> d.value)]);
        let maxValue=d3.max(vis.displayData, d => d.value)
        let minValue=d3.min(vis.displayData, d => d.value)
        var rScale = d3.scaleLinear().domain([ minValue, maxValue ]).range([ 25, 100]);


        vis.displayData.forEach(function(d, i) {
            vis.defs.append("svg:pattern")
                .attr("id", "grump_avatar" + i)
                .attr("width", 100)
                .attr("height", 100)
                .attr("patternUnits", "userSpaceOnUse")
                .append("svg:image")
                .attr("xlink:href", d.img)
                .attr("width", 100)
                .attr("height", 100)
                .attr("x", 0)
                .attr("y", 0);

            var circle = vis.svg.append("circle")
                .attr("transform", "translate(" + d.posx + "," + d.posy + ")")
                .attr("cx", 100 / 2)
                .attr("cy", 100 / 2)
                .attr("r", 100 / 2)
                //.style("fill", "#fff")
                .attr("stroke-width",'5px' )
                //.attr("background-color",'red' )
                .attr("stroke",vis.colorScale(d.value))
                .style("fill", "url(#grump_avatar" + i + ")")
                .on('mouseover', function(){
                    console.log(d.img);
                    console.log(d.value);
                    console.log(d.key);
                    animalType=d.key;
                    animalColor.wrangleData();
                })
        })

        vis.legendcolor = vis.svg.select(".legend").selectAll("rect")
            .data(vis.displayData);

        vis.legendcolor
            .enter().append("rect")
            .merge(vis.legendcolor)
            //.attr("x", 100)
            .attr("x", function(d,i){ return 220 + (i*2)})
            //.attr("y", function(d,i){ return 100 + i*(20+5)})
            //.attr("y",220)
            .attr("width", 142)
            .attr("height", 20)
            .attr("fill",
                function(d,i){
                    console.log(d.value);
                    let assignColor=" ";
                    assignColor=vis.color(d.value);
                    return assignColor;
                });
            vis.legendcolor.exit().remove()
    }
}
