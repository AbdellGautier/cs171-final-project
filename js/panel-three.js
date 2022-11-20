
/*
 * PanelThree - Object constructor function
 * @param _data				-- the dataset
 */

class PanelThree {

    constructor(intakeData, outcomeData) {
        this.intakeData = intakeData;
        this.outcomeData = outcomeData;

        this.initPanel();
    }

    initPanel() {
        let panel = this;

        console.log(panel.intakeData);

        let intakeIDs = panel.intakeData.map(d => d["Animal ID"]);
        let outcomeIDs = panel.outcomeData.map(d => d["Animal ID"]);
        console.log(intakeIDs)
        console.log(outcomeIDs);

        let intakeIdSet = new Set(intakeIDs);
        let count = 0;
        outcomeIDs.forEach(outcomeID => {
            if (intakeIdSet.has(outcomeID)) {
                count += 1;
            }
        })
        console.log("total intakes: " + intakeIDs.length);
        console.log("total outcomes: " + outcomeIDs.length);
        console.log(count);

        let outcomeTypes = new Set(panel.outcomeData.map(d => d["Outcome Type"]))
        console.log(outcomeTypes);

        let roll = d3.rollup(panel.outcomeData, v => v.length, d => d["Outcome Type"]);
        console.log(roll);
    }
}
