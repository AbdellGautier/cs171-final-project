

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
let parseDate = d3.timeParse("%m/%d/%Y %H:%I");




// Initialize data
loadData();

// FIFA world cup
let data;

let y;

let line;

let x;

let rollData;

let series1;

// Load CSV file
function loadData() {
	d3.csv("data/Austin_Animal_Center_Intakes.csv", row => {
		row.DATE = parseDate(row.DateTime);
		//row.AnimalId = +row['ANIMAL ID'];
		return row
	}).then(csv => {

		//rollData=d3.group(csv, v=> v.length)

		//rollData=d3.flatRollup(csv, v => v.length, d => d.DATE.getFullYear(),d=>d.DATE.getMonth());
		rollData=d3.rollup(csv, v => v.length, d => d.DATE.getFullYear(),d=>d.DATE.getMonth());

		console.log('rolldata',rollData);
				// Store csv data in global variable

		/*map1 = new Map([...rollData.entries()].sort((a, b) => b[0] - a[0]));

		// Separately printing only keys
		for (let [key, value] of map1) {
			document.write(key, " ");
		}*/
		data=[]
		for (const [key, value] of rollData) {
			//if (key==2022 || key==2021 || key==2020 || key==2019) {
			if (key==2022 || key==2021 || key==2020 || key==2019){
				year=key;
				sortedMonthMap = new Map([...value.entries()].sort((a, b) => a[0] - b[0]));
				console.log('sorted month map',sortedMonthMap);
				/*for(i=0;i<12;i++){
					let  d1={}
					d1['month']=i
					d1['count']=0;
					d1['year']=0;
					//series1.push(d1)
					data.push(d1)
				}*/
				console.log('Zero data',data);
				for (const [key, value] of sortedMonthMap){
					let  d1={}
					d1['month']=key;
					d1['count']=value;
					d1['year']=year;
					data.push(d1);
				}

				/*for (const [key, value] of sortedMonthMap){
					data.forEach(function (d){
						console.log(d['year'])
						if(year!=d['year'] && key==d['month']){
							d['month']=key;
							d['count']=value;
							d['year']=year;
						}
					});
					//var d1={month:key,count:value}
					//series.push(d1);
				}*/
				console.log(data)
				//data.push(series1)
			}
		}
		//data = csv;
		console.log(data);

		//console.log(data.forEach(data, d=> console.log(d)))
		// Draw the visualization for the first time
		initialize(data)
		//updateVisualization(data);
		//showEdition(data[0]);
	});
}

//let maxDate;
//let minDate;

let maxMonth;
let minMonth;

function initialize(data) {

	/*maxMonth=d3.max(data, function(d){return d.month;});
	console.log(maxMonth)
	minMonth=d3.min(data, function(d){return d.month;});
	console.log(minMonth)*/

	let colors = ['#FF0000','#3c948b','#0000FF','#A52A2A']

	/*var sumstat = d3.nest()
		.key(d => d.year)
		.entries(data);*/

	//sumstat=d3.rollup(data, v => v.length, d => d.year);

	let sumstat = Array.from(d3.group(data, d => d.year), ([key, value]) => ({key, value}))

	linearray=[]
	sumstat.forEach(function(d){
		console.log(d.value)
		linearray.push(d.value)
	})

	//sumstat=d3.groups(data, d => d.year, d => d.month)

	console.log('sumstat',sumstat)

	var year = sumstat.map(d => d.key)
	var color = d3.scaleOrdinal().domain(year).range(colors)
	//console.log('color', color);
	console.log(year);


	x=d3.scaleLinear()
		.domain([0,11])
		.range([0, width])

	y = d3.scaleLinear()
		.domain([0, d3.max(data,d=>d.count)])
		.range([height, 0]);


	line = d3.line()
		.x(d => x(d.month))
		.y(d => y(d.count))

	//let xAxis = d3.axisBottom().scale(x).tickFormat(['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']);

	let months= ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']

	let xAxis = d3.axisBottom().scale(x)
		.tickFormat(function(d) {
			//console.log(d)
			return months[d];
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
	//d3.select("g").append("path").data(data).attr("class", "line").attr('d', line)

	//working
	//d3.select("g").append("path").data(data).attr("class", "line").attr('d', line)

	//d3.select("g").data(data).enter().append("path").attr("class", "line").attr('d', line)

	d3.select("g").selectAll(".line")
		.append("g")
		.attr("class", "line")
		.data(linearray)
		.enter()
		.append("path")
		.attr("d", line)
		.attr("fill","none")
		.attr("stroke", function(d,i){
			console.log(d[0]['year'])
			//return colors[i];
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

	/*d3.select("g").selectAll(".line")
		.append("g")
		.attr("class", "line")
		.data(sumstat)
		.enter()
		.append("path")
		//.attr("d", line)
		.attr("d", function (d) {
			return d3.line()
				.x(d => x(d.value.month))
				.y(d => y(d.value.count))
		})
		.attr("fill","none")
		.attr("stroke", "blue")
		.attr("stroke-width", 2)*/







}

function updateVisual(){
	d=data;
	//updateVisualization(d)
}

// Render visualization
function updateVisualization(data) {

	var t = d3.transition()
		.duration(1500)
		.ease(d3.easeLinear);

	console.log(data);
	current_selection=d3.select("#chartdata").property("value");
	var maxDate=d3.max(data, function(d){return d.YEAR;});
	var minDate=d3.min(data, function(d){return d.YEAR;});
	x.domain([minDate,maxDate])
	let xAxis = d3.axisBottom().scale(x)
	svg.select(".x-axis")
		.call(xAxis)
		.attr("transform", "translate(0," + height + ")")

	if(current_selection=='goals'){
			y.domain([0, d3.max(data, function(d){return d.GOALS})])
			let yAxis = d3.axisLeft().scale(y);
			svg.select(".y-axis").call(yAxis);
		line = d3.line()
			.x(d => x(d.YEAR))
			.y(d => y(d.GOALS))
	}
	else if (current_selection=='avggoals'){
		y.domain([0, d3.max(data, function(d){return d.AVERAGE_GOALS})])
		let yAxis = d3.axisLeft().scale(y);
		svg.select(".y-axis").call(yAxis);

		line = d3.line()
			.x(d => x(d.YEAR))
			.y(d => y(d.AVERAGE_GOALS))
	}
	else if (current_selection=='matches'){
		y.domain([0, d3.max(data, function(d){return d.MATCHES})])
		let yAxis = d3.axisLeft().scale(y);
		svg.select(".y-axis").call(yAxis);
		line = d3.line()
			.x(d => x(d.YEAR))
			.y(d => y(d.MATCHES))
	}
	else if (current_selection=='teams'){
		y.domain([0, d3.max(data, function(d){return d.TEAMS})])
		let yAxis = d3.axisLeft().scale(y);
		svg.select(".y-axis").call(yAxis);
		line = d3.line()
			.x(d => x(d.YEAR))
			.y(d => y(d.TEAMS))
	}
	else if (current_selection=='avgattendance'){
		y.domain([0, d3.max(data, function(d){return d.AVERAGE_ATTENDANCE})])
		let yAxis = d3.axisLeft().scale(y);
		svg.select(".y-axis").call(yAxis);
		line = d3.line()
			.x(d => x(d.YEAR))
			.y(d => y(d.AVERAGE_ATTENDANCE))
	}

	// Update the path
	d3.select(".line")
		//.transition(t)
		.transition(t)
		.attr("d", line(data))


	//circles


	let circ = d3.select("g").selectAll("circle")
		.data(data);

	circ.enter().append("circle")
		.merge(circ)
		.attr('id', 'dot')
		//.attr("class", "dot")
		.attr("class", "tooltip-circle")
		.attr('r', 5)
		.style('fill', 'green')
		.attr('cx', (d)=>{
			return x(d.YEAR);
		})
		.attr('cy', (d)=> {
			if(current_selection=="goals") {
				return y(d.GOALS);
			}else if (current_selection=="avggoals"){
				return y(d.AVERAGE_GOALS);
			}
			else if (current_selection=="matches"){
				return y(d.MATCHES);
			}
			else if (current_selection=="teams"){
				return y(d.TEAMS);
			}
			else if (current_selection=="avgattendance"){
				return y(d.AVERAGE_ATTENDANCE);
			}

		})
		.on("click", function(event,d){
			//console.log(d);
				showEdition(d)
		}
		);


		circ.exit()
			.transition(t).remove();
}

// Show details for a specific FIFA World Cup
function showEdition(d){
	console.log(d.AVERAGE_ATTENDANCE)

	document.getElementById("heading").innerHTML='<br>&nbsp;&nbsp;'+d.EDITION +'</br>';
	document.getElementById("winner").innerHTML=d.WINNER;
	document.getElementById("goals").innerHTML=d.GOALS;
	document.getElementById("avggoals").innerHTML=d.AVERAGE_GOALS;
	document.getElementById("matches").innerHTML=d.MATCHES;
	document.getElementById("teams").innerHTML=d.TEAMS;
	document.getElementById("avgattend").innerHTML=d.AVERAGE_ATTENDANCE;
}


// var slider = document.getElementById('slider');
// //let start=+formatDate(data[0].YEAR)
// noUiSlider.create(slider, {
// 	start: [1930, 2014],
// 	connect: true,
// 	margin:30,
// 	range: {
// 		'min': 1930,
// 		'max': 2014
// 	}
// });
// slider.noUiSlider.on('slide', function (values, handle) {
// 	console.log("start year " + Math.round(values[0]));
// 	console.log("end year" + Math.round(values[1]));
// 	start=Math.round(values[0]);
// 	end=Math.round(values[1]);

// 	document.getElementById("start").innerHTML=start;
// 	document.getElementById("end").innerHTML=end;

// 	dataForYears=getDataForYears(parseDate(start),parseDate(end))
// 	console.log(dataForYears);
// 	updateVisualization(dataForYears)
// });

function getDataForYears(start,end) {
	dataSortedYears=[];
	data.forEach((element) => {
		if(element.YEAR>=start && element.YEAR<=end)
				dataSortedYears.push(element);
		});
	return dataSortedYears;
}
