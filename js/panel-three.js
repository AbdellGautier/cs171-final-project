
/*
 * PanelThree - Object constructor function
 * @param intakeData	-- the intake dataset
 * @param outcomeData	-- the outcome dataset
 */

class PanelThree {

    constructor(intakeData, outcomeData) {
        this.intakeData = intakeData;
        this.outcomeData = outcomeData;

        this.initPanel();
    }

    initPanel() {
        let panel = this;

        // Get animal IDs
        let intakeIDs = panel.intakeData.map(d => d["Animal ID"]);
        let outcomeIDs = panel.outcomeData.map(d => d["Animal ID"]);

        // Get intersection of datasets
        let intakeIdSet = new Set(intakeIDs);
        let intersection = new Set(outcomeIDs.filter(outcomeID => intakeIdSet.has(outcomeID)));

        // Filter by intersection
        panel.intakeData = panel.intakeData.filter(d => intersection.has(d["Animal ID"]));
        panel.outcomeData = panel.outcomeData.filter(d => intersection.has(d["Animal ID"]));

        // Define config
        let outcomeConfig = {
            "Adopted": {
                "outcomeTypes": new Set(["Rto-Adopt", "Adoption", "Return to Owner"]),
                "color": "green",
            },
            "Transferred": {
                "outcomeTypes": new Set(["Transfer", "Relocate"]),
                "color": "yellow",
            },
            "Lost": {
                "outcomeTypes": new Set(["Missing", "Stolen", "Lost", ""]),
                "color": "black",
            },
            "Dead": {
                "outcomeTypes": new Set(["Euthanasia", "Died", "Disposal"]),
                "color": "red",
            },
        };

        // Get nodes
        let intakeNodes = Array.from(new Set(panel.intakeData.map(d => d["Animal Type"])));
        let outcomeNodes = Object.keys(outcomeConfig); // Array.from(new Set(panel.outcomeData.map(d => d["Outcome Type"])));

        let nameToIdx = {}
        let nodes = [...intakeNodes, ...outcomeNodes].map((name, idx) => {
            nameToIdx[name] = idx;
            return ({
                "node": idx,
                "name": name,
            })
        });

        // Define links
        let links = []
        intakeNodes.forEach(source => {
            outcomeNodes.forEach(target => {
                links.push({
                    "source": nameToIdx[source],
                    "target": nameToIdx[target],
                    "value": 0,
                    "color": outcomeConfig[target].color,
                });
            });
        });

        // Update link values
        panel.outcomeData.forEach(d => {
            // Get source node
            let source = nameToIdx[d["Animal Type"]];

            // Get target node
            let outcomeNode = outcomeNodes.find(node => outcomeConfig[node].outcomeTypes.has(d["Outcome Type"]));
            let target = nameToIdx[outcomeNode];

            // Update link value
            let idx = links.findIndex(link => link.source === source && link.target === target);
            links[idx].value += 1;
        });

        // Filter out zero-value links
        links = links.filter(link => link.value !== 0);

        // Define data structure for sankey chart
        let data = {
            "nodes": nodes,
            "links": links,
        };

        // Render sankey chart
        new SankeyChart("panel3-sankey", data);
    }
}
