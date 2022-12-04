
/*
 * PanelInnovative - Object constructor function
 * @param _intakeData		-- the intake dataset
 * @param _outcomeData		-- the outcome dataset
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

        // Prepare data for visualization
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
        panel.visData = Object.entries(animalDataByID).map(d => ({ animalID: d[0], ...d[1] }));

        // Initialize the visualization
        panel.matrix = new InnovativeMatrix("innovative-matrix",20, 30);

        // Update the visualization once user selects a date
        d3.select(`#innovative-matrix-start`).on("change", function (e) {
            // Reset visualization
            panel.resetVis();

            d3.select("#matrix-reset-btn").attr("disabled", null);

            panel.startVis(e.target.value);
        });

        // Reset the visualization once user clicks reset
        d3.select("#matrix-reset-btn").on("click", function() {
            panel.resetVis();
            document.getElementById("innovative-matrix-start").value = '';
            d3.select(this).attr("disabled", "true");
        })
    }


    // Reset the visualization to its initial state
    resetVis() {
        let panel = this;
        panel.timeouts.forEach(timeout => clearTimeout(timeout));
        panel.matrix.reset();
    }

    // Start the visualization
    startVis(selectedDate) {
        let panel = this;

        // Parse date
        let parseDate = d3.timeParse("%Y-%m-%d");
        let startTime = parseDate(selectedDate).getTime() / 1000;

        // Filter and sort
        panel.visData = panel.visData.filter(d => d.timeInShelter && d.timeInShelter > 0 && d.intakeTime >= startTime);
        panel.visData = panel.visData.sort((a, b) => a.intakeTime - b.intakeTime);

        // Find min intake time
        let minIntakeTime = d3.min(panel.visData, d => d.intakeTime);

        // Update the visualization in real-time based on animal intakes and outcomes
        panel.visData.forEach(function(d) {
            // Wait until intake
            let intakeTimeout = setTimeout(() => {
                // Once intake, add the animal to the vis
                panel.matrix.intakeAnimal(d);

                // Wait until outcome
                let outcomeTimeout = setTimeout(() => {
                    // Once outcome, remove animal from vis
                    panel.matrix.removeAnimal(d)

                }, ((d.outcomeTime - minIntakeTime) / 3600) * 100);

                // Store timeout
                panel.timeouts.push(outcomeTimeout);
            }, ((d.intakeTime - minIntakeTime) / 3600) * 100);

            // Store timeout
            panel.timeouts.push(intakeTimeout);
        });
    }
}
