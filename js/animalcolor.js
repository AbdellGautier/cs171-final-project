
class AnimalColorBarChart {

    constructor(_parentElement, _data, _data2, _config) {

        this.parentElement = _parentElement;
        this.data = _data;
        this.outcomedata = _data2;
        this.backup_outcome = _data2;
        this.displayData = _data;
        this.config = _config;

        this.colors = ['#EBF4F3', '#3c948b'];

        this.initVis();
    }

    initVis() {

        let vis = this;

        // Set margin
        vis.margin = { top: 20, right: 10, bottom: 25, left: 0 };

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

        // Add title
        vis.svg.append('g')
            .attr('class', 'title bar-title');

        vis.svg.append('g')
            .attr('class', 'heading')

        vis.defs = vis.svg.append('svg:defs');

        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.1);

        vis.colorScale = d3.scaleLinear()
            .range(vis.colors);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.svg.append("g")
            .attr("class", "xaxis axis")
            .attr("transform", "translate(0," + 155 + ")");

        // (Filter, aggregate, modify data)
        vis.displayData = vis.data;

        vis.wrangleData();
    }


    wrangleData() {

        let vis = this;

        selectedCategory = "Adoption";

        let dataByDate = Array.from(d3.group(vis.data, d => d['Animal Type']), ([key, value]) => ({ key, value }));

        if (animalType == '') {
            animalType = "Dog";
        }

        if (selectedCategory == 'animalintake') {
            dataByDate.forEach(function (d) {
                if (animalType == d.key) {
                    noOfColors = d.value.length
                    vis.displayData = d.value;
                }
            });
        }
        else {

            let outcomeData = Array.from(d3.group(vis.backup_outcome, d => d['Animal Type']), ([key, value]) => ({ key, value }));
            let animalData;

            outcomeData.forEach(function (d) {
                if (animalType == d.key) {
                    noOfColors = d.value.length
                    animalData = d.value;
                }
            });

            let finalData = Array.from(d3.group(animalData, d => d['Outcome Type']), ([key, value]) => ({ key, value }));

            finalData.forEach(function (d) {
                if (selectedCategory == d.key) {
                    noOfColors = d.value.length
                    vis.displayData = d.value;
                }
            });

        }
        // Sort the data
        vis.displayData = vis.displayData.sort((a, b) => b.count - a.count);

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {

        let vis = this;

        vis.x.domain(vis.displayData.map(d => d['Sex upon Outcome']));
        vis.y.domain([0, d3.max(vis.displayData, d => d.count)]);

        vis.title = vis.svg.select("g.heading").selectAll("text")
            .data(vis.displayData);

        vis.title.enter()
            .append("text")
            .merge(vis.title)
            .attr("fill", "black")
            .text(function (d) {
                if (d['Animal Type'] == 'Other') {
                    return "Gender of Other Adopted Animals"
                } else {
                    return "Gender of Adopted " + d['Animal Type']
                }

            })
            .attr("x", 300)
            .attr("y", -5)
            .attr('text-anchor', 'middle');

        vis.title.exit().remove();

        vis.text = vis.svg.select("g").selectAll("text")
            .data(vis.displayData);

        vis.text.enter()
            .append("text")
            .merge(vis.text)
            .transition()
            .duration(1000)
            .text(d => (d.count))
            .attr("class", "count-animal-intakes")
            .attr('x', function (d) {
                return vis.x(d['Sex upon Outcome']) + vis.x.bandwidth() / 2;
            })
            .attr("dy", -5)
            .attr('y', d => vis.y(d.count))
            .attr('text-anchor', 'middle');

        vis.text.exit().remove();

        vis.xAxis = d3.axisBottom().scale(vis.x);

        vis.svg.select(".xaxis")
            .transition()
            .call(vis.xAxis);

        vis.barchart = vis.svg.select("g").selectAll("rect")
            .data(vis.displayData);

        vis.barchart.enter()
            .append("rect")
            .merge(vis.barchart)
            .transition()
            .duration(1000)
            .attr("class", "rectangle")
            .attr('x', d => vis.x(d['Sex upon Outcome']))
            .attr('y', d => vis.y(d.count))
            .attr('height', (d) => {
                return (vis.height - vis.y(d.count));
            })
            .attr('width', vis.x.bandwidth());

        vis.barchart.exit().remove();


    }
}
