
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 600 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");


// Initialize data
loadData();

// FIFA world cup
let data;

// Scales


// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", row => {
		row.YEAR = parseDate(row.YEAR);
		row.TEAMS = +row.TEAMS;
		row.MATCHES = +row.MATCHES;
		row.GOALS = +row.GOALS;
		row.AVERAGE_GOALS = +row.AVERAGE_GOALS;
		row.AVERAGE_ATTENDANCE = +row.AVERAGE_ATTENDANCE;
		return row
	}).then(csv => {

		// Store csv data in global variable
		data = csv;

		// Draw the visualization for the first time
		updateVisualization();
	});
}


// Render visualization
function updateVisualization() {
	
	console.log(data);
	current_selection=d3.select("#chartdata").property("value");

	var maxDate=d3.max(data, function(d){return d.YEAR;});
	var minDate=d3.min(data, function(d){return d.YEAR;});
	let x=d3.scaleTime()
		.domain([minDate,maxDate])
		.range([0, width])


	/*let x = d3.scaleLinear()
		//let x = d3.scaleBand()
		.domain(data.map(d=> formatDate(d.YEAR)).reverse())
		.domain([d3.min(data, d=> +formatDate(d.YEAR)), d3.max(data, d=> +formatDate(d.YEAR))])
		.range([0, width])
		//.paddingInner(15);
			//.padding(15)*/



	let y = d3.scaleLinear()
		.domain([0, d3.max(data, function(d){return d.GOALS})])
		.range([height, 0]);

	let yAxisGroup = svg.append("g")
		.attr("class", "y-axis axis");

	let xAxisGroup = svg.append("g")
		.attr("class", "x-axis axis");


//axis
	let yAxis = d3.axisLeft().scale(y);
	//let xAxis = d3.axisBottom().scale(x).tickValues([1940,1950,1960,1970,1980,1990,2000,2010]).tickFormat(d3.format("d"));;
	//let xAxis = d3.axisBottom().scale(x).tickValues(['1940','1950','1960','1970','1980','1990','2000','2010'])
	let xAxis = d3.axisBottom().scale(x).ticks(8)
	//let xAxis = d3.axisBottom().scale(x).tickArguments([d3.timeMinute.every(10)]);

	svg.select(".y-axis")
		.call(yAxis);

	svg.select(".x-axis")
		.call(xAxis)
		.attr("transform", "translate(0," + height + ")")

	const line = d3.line()
		//.curve(d3.curveLinear)
		.x(d => x(d.YEAR))
		.y(d => y(d.GOALS))

	//let linechart = d3.select("g").selectAll("path").attr('d',line(data))

	//svg.append('path').attr('d',line(data)).attr('class',"line")
	svg.append('path').datum(data).attr('d',line).attr('class',"line")

	//need to work on this

	svg
		.selectAll("circle")
		.data(data)
		.enter().append("circle")
		.attr('id', 'dot')
		.attr("class", "dot")
		.attr('cx', (d)=>{
			return x(d.YEAR);
		})
		.attr('cy', (d)=> {
			return y(d.GOALS);
		})
		.attr('r', 5)
		.style('fill', 'green');
}


// Show details for a specific FIFA World Cup
function showEdition(d){
	
}
