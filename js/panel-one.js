
// Chart variables
let areachart;
let barcharts;

/*
 * PanelOne - Object constructor function
 * @param _data				-- the dataset
 */

class PanelOne {

    constructor(_data) {
        this.data = _data;

        this.initPanel();
    }

    initPanel() {
        let barchartConfigs = [
            {
                parentElement: "panel1-animal-type-barchart",
                config: {
                    "title": "Found Animal Types",
                    "key": "Animal Type",
                    "height": 125,
                },
            },
            {
                parentElement: "panel1-intake-type-barchart",
                config: {
                    "title": "Found Animal Intake Type",
                    "key": "Intake Type",
                    "height": 150,
                },
            },
            {
                parentElement: "panel1-intake-condition-barchart",
                config: {
                    "title": "Found Animal Intake Condition",
                    "key": "Intake Condition",
                    "height": 350,
                },
            },
        ];


        areachart = new AreaChart("panel1-intake-areachart", this.data, this);
        barcharts = barchartConfigs.map(barchart => new BarChart(barchart.parentElement, this.data, barchart.config));
    }

    brushed() {
        let selectionRange = d3.brushSelection(d3.select(".brush").node());

        let selectionDomain = selectionRange.map(areachart.x.invert);

        barcharts.forEach(barchart => barchart.selectionChanged(selectionDomain));
    }
}
