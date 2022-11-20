
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

        let data = {
            "nodes":[
                {"node":0,"name":"node0"},
                {"node":1,"name":"node1"},
                {"node":2,"name":"node2"},
                {"node":3,"name":"node3"},
                {"node":4,"name":"node4"}
            ],
            "links":[
                {"source":0,"target":2,"value":2},
                {"source":1,"target":2,"value":2},
                {"source":1,"target":3,"value":2},
                {"source":0,"target":4,"value":2},
                {"source":2,"target":3,"value":2},
                {"source":2,"target":4,"value":2},
                {"source":3,"target":4,"value":4}
            ]};

        new SankeyChart("panel3-sankey", data);
    }
}
