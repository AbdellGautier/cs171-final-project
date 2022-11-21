//Global Variables for Events
let animalColor;
let animalType = '';
let noOfColors=0;
let selectedCategory='';


// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%m/%d/%Y %H:%I");

// Define datasets to load
let promises = [
	d3.csv("data/Austin_Animal_Center_Intakes.csv", row => {
		row.DATE = parseDate(row.DateTime);
		return row
	}),
	d3.csv("data/Austin_Animal_Center_Outcomes.csv", row => {
		row.DATE = parseDate(row.DateTime);
		return row;
	}),
	d3.csv("data/intakecount_years.csv" ,row => {
		row.month = +row['month'];
		row.year = +row['year'];
		row.count = +row['count'];
		if (row.year==2022 || row.year==2021 || row.year==2020 || row.year==2019){
			return row;
		}
	}),
	d3.csv("data/color_animal.csv", row => {
		row.count = +row['Animal ID'];
		return row
	}),
	d3.csv("data/intake_outcomes.csv", row => {
		row.count = +row['Animal ID'];
		return row
	}),
];

// Load data and draw charts
Promise.all(promises)
	.then(function (data) {
		let intakeCSV = data[0];
		let outcomeCSV = data[1];
		let intakeCountCSV = data[2];
		let animalColorCSV = data[3];
		let outcomes = data[4];

		// Draw animal intakes chart
		drawAreaChart(intakeCountCSV);

		// Draw panel one
		new PanelOne(intakeCSV);

		new AnimalIntakeVisuals(
			"intakecount",
			intakeCSV,
			{
				"title": "",
				"key": "Animal Type"
			}
		)
		animalColor = new AnimalColorBarChart("detailsColor",
			animalColorCSV,outcomes, {
				"title": "Top 5 Colors of Animal",
				"key": "Animal Type"
			})

		// Draw panel three
		new PanelThree(intakeCSV, outcomeCSV);
	})
	.catch(function (err) {
		console.log(err)
	});

function categoryChange() {
	selectedCategory =  document.getElementById('categorySelector').value;
	animalColor.wrangleData(); // maybe you need to change this slightly depending on the name of your MapVis instance
}