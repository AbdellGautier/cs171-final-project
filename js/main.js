//Global Variables for Events
let animalColor;
let animalType = '';
let noOfColors=0;


// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%m/%d/%Y %H:%I");

// Define datasets to load
let promises = [
	d3.csv("data/Austin_Animal_Center_Intakes.csv", row => {
		row.DATE = parseDate(row.DateTime);
		return row
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
];

// Load data and draw charts
Promise.all(promises)
	.then(function (data) {
		let rawCSV = data[0];
		let intakeCountCSV = data[1];
		let rawCSV1 = data[2];

		// Draw animal intakes chart
		drawAreaChart(intakeCountCSV);

		// Draw panel one
		new PanelOne(rawCSV);

		new AnimalIntakeVisuals(
			"intakecount",
			rawCSV,
			{
				"title": "Animal Intakes Count",
				"key": "Animal Type"
			}
		)
		animalColor=new AnimalColorBarChart("detailsColor",
			rawCSV1, {
				"title": "Top 5 Colors of Animal",
				"key": "Animal Type"
			})
	})
	.catch(function (err) {
		console.log(err)
	});


function brushed() {

}
