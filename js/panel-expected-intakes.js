
// Chart variables
/*
 * PanelExpectedIntakes - Object constructor function
 * @param _data				-- the dataset
 */

class PanelExpectedIntakes {

    constructor(_data) {
        this.data = _data;

        this.initPanel();
    }

    initPanel() {
        let panel = this;

        let options = [
            "opt0",
            "opt1",
            "opt2",
            "opt3",
        ];

        options.forEach(option => {
            d3.select(`#${option}`).on("change", function(e) {
                let selectedIntakeQuantity = +e.target.value;
                let percentage = selectedIntakeQuantity / panel.data.length;

                let counts = d3.rollup(panel.data, v => v.length, d => new Date(d.DATE.getFullYear(), d.DATE.getMonth()));
                let displayData = Array.from(counts).map(([key, value]) => {
                    return ({
                        "date": key,
                        "actual": value,
                        "expected": Math.round(value * percentage),
                    });
                });

                let radioOptions = document.getElementsByName("intake-option");
                radioOptions.forEach(radio => radio.disabled = true);

                d3.select("#form-animal-intakes-answer")
                    .style("opacity", 0)
                    .style("display", "inherit")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);

                d3.select("#expected-intakes-areachart")
                    .style("opacity", 0)
                    .style("display", "inherit")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);

                new StackedAreaChartExpectedIntakes(
                    "expected-intakes-areachart",
                    displayData
                );
            });
        });
    }
}
