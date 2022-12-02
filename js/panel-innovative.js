
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

        let animalDataByID = {};


        panel.intakeData.forEach(d => {
            animalDataByID[d["Animal ID"]] = {
                animalType: d["Animal Type"],
                intakeTime: d.DATE.getTime() / 1000,
                outcomeTime: null,
            };
        })

        panel.outcomeData.forEach(d => {
            let id = d["Animal ID"];
            if (animalDataByID[id]) {
                animalDataByID[id].outcomeTime = d.DATE.getTime() / 1000;
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

        d3.select(`#innovative-matrix-start`).on("change", function (e) {
            // Reset visualization
            panel.timeouts.forEach(timeout => {
                clearTimeout(timeout);
            });

            matrix.reset();

            let parseDate = d3.timeParse("%Y-%m-%d");
            let startTime = parseDate(e.target.value).getTime() / 1000;

            // Filter and sort
            visData = visData.filter(d => d.timeInShelter && d.timeInShelter > 0 && d.intakeTime >= startTime);
            visData = visData.sort((a, b) => a.intakeTime - b.intakeTime);

            // Find min intake time
            let minIntakeTime = d3.min(visData, d => d.intakeTime);
            matrix.setStartTime(minIntakeTime);

            // Update the visualization in real-time based on animal intakes and outcomes
            visData.forEach(function(d, i) {
                // Wait until intake
                let intakeTimeout = setTimeout(() => {
                    // Once intake, handle enter
                    matrix.intakeAnimal(d);

                    // Wait until outcome
                    let outcomeTimeout = setTimeout(() => {
                        // Once outcome, handle remove
                        matrix.removeAnimal(d)

                    }, ((d.outcomeTime - minIntakeTime) / 3600) * 100);

                    panel.timeouts.push(outcomeTimeout);
                }, ((d.intakeTime - minIntakeTime) / 3600) * 100);

                panel.timeouts.push(intakeTimeout);
            });
        });
    }




}
