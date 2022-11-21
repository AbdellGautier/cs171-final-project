
/*
 *  AutinMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class AustinMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, initialCoordinates) {
		this.parentElement = parentElement;
		this.displayData = displayData;
		this.initialCoordinates = initialCoordinates;

		this.initVis();
	}


	/*
	 *  Initialize station map
	 */
	initVis() {
		let vis = this;

		// --------------------------------------------------------------------------------------------
		// Optimizing the map for many circles placement later
		// 
		// Credit:  https://stackoverflow.com/a/43019740
		// --------------------------------------------------------------------------------------------
		vis.map = L.map(vis.parentElement, { preferCanvas: true, scrollWheelZoom: false }).setView(vis.initialCoordinates, 10);

		// Set the icon image path
		L.Icon.Default.imagePath = 'images/leaflet/';

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(vis.map);

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData() {
		let vis = this;

		// Filter the intakes for 2022 only
		vis.displayData = vis.displayData.filter(

			(d) => d.DATE >= new Date("01/01/2022") && d.DATE <= new Date("12/31/2022") && d.Latitude != undefined
		);

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.displayData.forEach((intake) => {

			// Construct the popup contents
			let popUpContents = `Type: <strong>${intake["Animal Type"]}</strong><br>
				Age: <strong>${intake["Age upon Intake"]}</strong><br>
				Sex: <strong>${intake["Sex upon Intake"]}</strong><br>
				Color: <strong>${intake["Color"]}</strong><br>`;

			// Create a new marker, based on animal type
			// --------------------------------------------------------------------------------------------
			// Optimizing the map for many circles placement later
			// 
			// Credit:  https://stackoverflow.com/a/43019740
			// --------------------------------------------------------------------------------------------
			if (intake["Animal Type"] == "Dog") {
				L.circleMarker([intake.Latitude, intake.Longitude], { color: '#0000ff', radius: 5, weight: 2 }).addTo(vis.map).bindPopup(popUpContents);
			} else if (intake["Animal Type"] == "Cat") {
				L.circleMarker([intake.Latitude, intake.Longitude], { color: '#ff0000', radius: 5, weight: 2  }).addTo(vis.map).bindPopup(popUpContents);
			} else if (intake["Animal Type"] == "Bird" || intake["Animal Type"] == "Other") {
				L.circleMarker([intake.Latitude, intake.Longitude], { color: '#00aa00', radius: 5, weight: 2  }).addTo(vis.map).bindPopup(popUpContents);
			}
		});
	}
}

