
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

    let colors = ["#f46a9b", "#ef9b20", "#9b19f5", "#00bfa0"]; // '#FF0000','#3c948b','#0000FF','#A52A2A']

    let sumstat = Array.from(d3.group(data, d => d.year), ([key, value]) => ({key, value}))

    linearray = []
    sumstat.forEach(function(d){
        linearray.push(d.value)
    })

    let circArrayData=linearray.flat();

    var year = sumstat.map(d => d.key)
    var color = d3.scaleOrdinal().domain(year).range(colors)


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

    //var monthMap = [];


    let monthMap={1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',
        9:'September',10:'October',11:'November',12:'December'};


    let xAxis = d3.axisBottom().scale(x)
        .tickFormat(function(d) {
            return months[d-1];
        });

    let yAxisGroup = svg.append("g")
        .attr("class", "y-axis axis");
    let xAxisGroup = svg.append("g")
        .attr("class", "x-axis axis");

    //tooltip
    tooltip = d3.select("body").append('div')
        .attr('class', "tooltip")
        .attr('id', 'pieTooltip')

/*    var t = d3.transition()
        .duration(1500)
        .ease(d3.easeLinear);*/


    let yAxis = d3.axisLeft().scale(y);
    svg.select(".y-axis").call(yAxis);

    svg.select(".x-axis")
        .call(xAxis)
        .attr("transform", "translate(0," + height + ")")

    svg.append("text")
        .attr("x", 5)
        .attr("y", 12)
        .text("Count");

    console.log(linearray);

    let t=d3.transition()
        .delay(function(d, i) {
            return i * 100;
        })
        .duration(300)
    //new code

    var city = svg.selectAll(".line")
        .data(linearray)
        .enter().append("g")
        .attr("class", "line");

    city.append("path")
        .attr("class", "line");

    d3.transition().selectAll(".line")
        //.duration(7500)
        //.delay(function(d, i) { return i * 800; })
        .attr("d", function(d){return line(d); })
        .style("stroke", function(d) {return color(d[0]['year']); })
        .attr("fill","none")
        .attr("stroke-width", 2)
        .duration(8000)
        .delay(function(d, i) { return i * 800; })










    /* lines.enter()
         .append("path")
         .attr("class", "line")
         .merge(lines)
         .transition()
         .duration(100)
         .attr("x1", function (d, i) {return x(d.month) })
         .attr("y1", function (d, i) { return y(d.count) })*/


    /*d3.select("g").selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(linearray)
        //.attr("d", function(d){return line(d.values); })
        .enter()
        .append("path")
        .attr("d", line)
        .attr("fill","none")
        .attr("stroke", function(d,i){
            return color(d[0]['year']);
        })
        .attr("stroke-width", 2)*/

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Intake Count Vs Last 4 Years Comparison");


    let circ = svg.select("g").selectAll("circle")
        .data(circArrayData);

    circ.enter().append("circle")
        .merge(circ)
        .attr('id', 'dot')
        //.attr("class", "dot")
        .attr("class", "tooltip-circle")
        .attr('r', 3)
        .style('fill', 'black')
        .attr('cx', (d)=>{
            return x(d.month);
        })
        .attr('cy', (d)=> {
                return y(d.count);
        })
        .on("mouseover", function(event,d){
            d3.select(this).style("fill", "red")
                console.log(d);
            tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + "px")
                .html(`
             <div style="border: thin solid grey; border-radius: 3px; background: lightgrey; padding: 10px">                 
                 <h4> <b>Month:</b> `+monthMap[d.month]+`</h4>
                 <h4> <b>Intake Count:</b> `+d3.format(',')(d.count)+`</h4>
                 <h4> <b>Year:</b> `+d.year+`</h4>                             
             </div>`);

            })
            .on('mouseout', function(event, d){
                d3.select(this).style("fill", "black")
            tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);

            })

    circ.exit().remove();

    var legend = svg.selectAll('g.legend')
        .data(sumstat)
        .enter()
        .append("g")
        .attr("class", "legend");

    legend.append("circle")
        .attr("cx", 515+25)
        .attr('cy', (d, i) => i * 20 + 43)
        .attr("r", 6)
        .style("fill", d => color(d.key))


    legend.append("text")
        .attr("x", 487)
        .attr("y", (d, i) => i * 20+50)
        .text(d => d.key)
}
