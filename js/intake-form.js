
let selectedIntakeQuantity;

let options = [
    "opt0",
    "opt1",
    "opt2",
    "opt3",
];

options.forEach(option => {
    d3.select(`#${option}`).on("change", function(e) {
        selectedIntakeQuantity = +e.target.value;

        d3.select("#show-me")
            .style("opacity", 0)
            .html("<p>Hello</p>")
            .style("display", "inherit")
            .transition()
            .style("opacity", 1)
    });
})
