
/*
 * PanelInnovative - Object constructor function
 * @param _data				-- the dataset
 */

class PanelInnovative {

    constructor(_intakeData, _outcomeData) {
        this.intakeData = _intakeData;
        this.outcomeData = _outcomeData;

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

        // Filter and sort
        visData = visData.filter(d => d.timeInShelter && d.timeInShelter > 0);
        visData = visData.sort((a, b) => a.intakeTime - b.intakeTime);

        // Find min intake time
        let minIntakeTime = d3.min(visData, d => d.intakeTime);

        // Initialize the visualization
        let matrix = new InnovativeMatrix("innovative-matrix", visData, 20, 25);

        // Toggle to pause visualization
        // visData = visData.splice(0, 100)

        // Update the visualization in real-time based on animal intakes and outcomes
        visData.forEach(function(d, i) {
            // Wait until intake
            setTimeout(() => {
                // Once intake, handle enter
                matrix.intakeAnimal(d);

                // Wait until outcome
                setTimeout(() => {
                    // Once outcome, handle remove
                    matrix.removeAnimal(d)

                }, ((d.intakeTime - minIntakeTime) / 3600) * 100);
            }, ((d.intakeTime - minIntakeTime) / 3600) * 100);
        });
    }
}
