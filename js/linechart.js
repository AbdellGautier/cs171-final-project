
let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 600 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// FIFA world cup
let data;

let y;

let line;

let x;

let rollData;

function drawAreaChart(data) {

    let svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let colors = ['#FF0000','#3c948b','#0000FF','#A52A2A']

    let sumstat = Array.from(d3.group(data, d => d.year), ([key, value]) => ({key, value}))

    linearray = []
    sumstat.forEach(function(d){
        console.log(d.value)
        linearray.push(d.value)
    })

    var year = sumstat.map(d => d.key)
    var color = d3.scaleOrdinal().domain(year).range(colors)
    console.log(year);


    x = d3.scaleLinear()
        .domain([1,12])
        .range([0, width])

    y = d3.scaleLinear()
        .domain([0, d3.max(data,d=>d.count)])
        .range([height, 0]);


    line = d3.line()
        .x(d => x(d.month))
        .y(d => y(d.count))

    let months= ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']

    let xAxis = d3.axisBottom().scale(x)
        .tickFormat(function(d) {
            return months[d-1];
        });

    let yAxisGroup = svg.append("g")
        .attr("class", "y-axis axis");
    let xAxisGroup = svg.append("g")
        .attr("class", "x-axis axis");

    let yAxis = d3.axisLeft().scale(y);
    svg.select(".y-axis").call(yAxis);

    svg.select(".x-axis")
        .call(xAxis)
        .attr("transform", "translate(0," + height + ")")


    svg.append("text")
        .attr("x", 5)
        .attr("y", 12)
        .text("Count");

    d3.select("g").selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(linearray)
        .enter()
        .append("path")
        .attr("d", line)
        .attr("fill","none")
        .attr("stroke", function(d,i){
            return color(d[0]['year']);
        })
        .attr("stroke-width", 2)

    var legend = d3.select("svg")
        .selectAll('g.legend')
        .data(sumstat)
        .enter()
        .append("g")
        .attr("class", "legend");

    legend.append("circle")
        .attr("cx", 510+23)
        .attr('cy', (d, i) => i * 20 + 45)
        .attr("r", 6)
        .style("fill", d => color(d.key))


    legend.append("text")
        .attr("x", 487)
        .attr("y", (d, i) => i * 20+50)
        .text(d => d.key)
}
