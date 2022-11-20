
class AnimalColorBarChart {

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
        vis.margin = {top: 30, right: 10, bottom: 25, left: 0};

        // Set width and height
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 250 - vis.margin.top - vis.margin.bottom;

        // Create SVG
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("class", "barchart")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')

        vis.svg.append('g')
            .attr('class', 'heading')


            /*.append('text')
            .text('Top 5 Colors of Dog')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');*/

        vis.defs = vis.svg.append('svg:defs');


        // Scales and axes
        /*vis.x = d3.scaleLinear()
            .range([0, vis.width]);*/

        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.1);


        vis.colorScale = d3.scaleLinear()
            //vis.colorScale = d3.scaleBand()
            //.range([vis.colors[0],vis.colors[3]]);
            .range(vis.colors)


        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        /*vis.xAxis = d3.axisBottom()
            .scale(vis.x);*/

        vis.svg.append("g")
            .attr("class", "xaxis axis")
            .attr("transform", "translate(0," + 196 + ")");

        /*vis.svg.append("g")
            .attr("class", "y-axis axis");*/

         //Add title


        // (Filter, aggregate, modify data)
        vis.displayData = vis.data

        vis.wrangleData();
    }


    wrangleData() {
        let vis = this;

        // Group data by key variable and count
        //let counts = d3.rollup(vis.displayData, v => v.length, d => d[vis.config.key],d => d['Color']);
        //vis.displayData = Array.from(counts).map(([key, value]) => ({ key, value }));

        let dataByDate = Array.from(d3.group(vis.data, d => d['Animal Type']), ([key, value]) => ({key, value}))
        console.log(dataByDate)
        console.log('From event', animalType);
        if(animalType==''){
            animalType="Dog";
        }
        dataByDate.forEach(function(d){
            if(animalType==d.key){
                console.log('Number of Colors ',d.value.length)
                noOfColors=d.value.length
                vis.displayData=d.value;
            }
        })

        //sort the data
        vis.displayData=vis.displayData.sort((a, b) => b.count - a.count).slice(0,5);
        // Sort columns descending
        console.log('Color Data', vis.displayData);

        // Update the visualization
        vis.updateVis();
    }


    updateVis() {
        let vis = this;

        //vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);

        //vis.colorScale.domain([0,  d3.max(vis.displayData, d=> d.value)]);

        //console.log('TESTING DATA ', vis.displayData.map(d=> d.Color));

        vis.x.domain(vis.displayData.map(d=> d.Color));

        vis.y.domain([0, d3.max(vis.displayData, d=> d.count)]);

        vis.title = vis.svg.select("g.heading").selectAll("text")
            .data(vis.displayData);

        /*vis.svg.append("text")
            .attr("x", 200)
            .attr("y", -5)
            .text(vis.config.title)
            .attr('text-anchor', 'middle');*/

        vis.title.enter()
            .append("text")
            .merge(vis.title)
            .transition()
            .duration(1000)
            .text(function(d){
                return "Top 5 Colors of " + d['Animal Type'] + " Out of " + noOfColors
            })
            .attr("x", 200)
            .attr("y", -5)
            .attr('text-anchor', 'middle')
        vis.title.exit().remove()




        vis.text = vis.svg.select("g").selectAll("text")
            .data(vis.displayData);

        vis.text.enter()
            .append("text")
            .merge(vis.text)
            .transition()
            .duration(1000)
            .text(d=>d.count)
            .attr('x', d=>vis.x(d.Color)+10)
            .attr('y', d=>vis.y(d.count))

        vis.text.exit().remove()

        vis.xAxis = d3.axisBottom().scale(vis.x);
        vis.svg.select(".xaxis")
            .transition()
            //.duration(1000)
            .call(vis.xAxis)
            //.attr("transform", "translate(0," + vis.height + ")")

        vis.barchart = vis.svg.select("g").selectAll("rect")
            .data(vis.displayData);

        vis.barchart.enter()
            .append("rect")
            .merge(vis.barchart)
            .transition()
            .duration(1000)
            //.attr("fill","#3C948B")
            .attr("fill", "grey")
            .attr('x', d=>vis.x(d.Color))
            .attr('y', d=>vis.y(d.count))
            .attr('height', (d)=>{
                    return (vis.height-vis.y(d.count));
                    //return (vis.y(d.count));
            })
            //.attr('height', (d)=>height-y(d.stores))
            .attr('width', vis.x.bandwidth())
            //.attr('width', 25)
        //.attr('class','bar')
        vis.barchart.exit().remove()

        /*let maxValue=d3.max(vis.displayData, d => d.value)
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
                .attr("stroke",vis.colorScale(d.value))
                .style("fill", "url(#grump_avatar" + i + ")")
                .on('mouseover', function(){
                    console.log(d.img);
                    console.log(d.value);

                })
        })*/

        //100 50



    }
}
