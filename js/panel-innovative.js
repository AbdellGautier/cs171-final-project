
/*
 * PanelInnovative - Object constructor function
 * @param _data				-- the dataset
 */

class PanelInnovative {

    constructor(_intakeData, _outcomeData) {
        this.intakeData = _intakeData;
        this.outcomeData = _outcomeData;

        this.timeouts = [];

        this.initPanel();
    }

    initPanel() {
        let panel = this;

        // Wrangle data
        let animalDataByID = {};

        panel.intakeData.forEach(d => {
            animalDataByID[d["Animal ID"]] = {
                animalType: d["Animal Type"],
                breed: d["Breed"],
                sex: d["Sex upon Intake"],
                age: d["Age upon Intake"],
                intakeTime: d.DATE.getTime() / 1000,
                name: null,
                outcomeTime: null,
            };
        })

        panel.outcomeData.forEach(d => {
            let id = d["Animal ID"];
            if (animalDataByID[id]) {
                animalDataByID[id].outcomeTime = d.DATE.getTime() / 1000;
                animalDataByID[id].name = d["Name"] ? d["Name"] : "unknown";
            }
        });

        Object.keys(animalDataByID).forEach(animalID => {
            if (animalDataByID[animalID].outcomeTime) {
                animalDataByID[animalID].timeInShelter = animalDataByID[animalID].outcomeTime - animalDataByID[animalID].intakeTime;
            }

        })

        let visData = Object.entries(animalDataByID).map(d => {
            return ({
                animalID: d[0],
                ...d[1],
            });
        });

        // Initialize the visualization
        let matrix = new InnovativeMatrix("innovative-matrix",20, 30);

        // Update the visualization once user selects a date
        d3.select(`#innovative-matrix-start`).on("change", function (e) {
            // Reset visualization
            panel.timeouts.forEach(timeout => clearTimeout(timeout));
            matrix.reset();

            let parseDate = d3.timeParse("%Y-%m-%d");
            let startTime = parseDate(e.target.value).getTime() / 1000;

            // Filter and sort
            visData = visData.filter(d => d.timeInShelter && d.timeInShelter > 0 && d.intakeTime >= startTime);
            visData = visData.sort((a, b) => a.intakeTime - b.intakeTime);

            // Find min intake time
            let minIntakeTime = d3.min(visData, d => d.intakeTime);

            // Update the visualization in real-time based on animal intakes and outcomes
            visData.forEach(function(d) {
                // Wait until intakes
                let intakeTimeout = setTimeout(() => {
                    // Once intake, add the animal to the vis
                    matrix.intakeAnimal(d);

                    // Wait until outcome
                    let outcomeTimeout = setTimeout(() => {
                        // Once outcome, remove animal from vis
                        matrix.removeAnimal(d)

                    }, ((d.outcomeTime - minIntakeTime) / 3600) * 100);

                    // Store timeout
                    panel.timeouts.push(outcomeTimeout);
                }, ((d.intakeTime - minIntakeTime) / 3600) * 100);

                // Store timeout
                panel.timeouts.push(intakeTimeout);
            });
        });
    }
}
