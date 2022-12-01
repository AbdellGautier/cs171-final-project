/*
 * Matrix - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the matrix
 * @param _data						-- the dataset
 */


class InnovativeMatrix {

    constructor(parentElement, data, width, height) {
        this.parentElement = parentElement;
        this.data = data;

        this.matrixWidth = width;
        this.matrixHeight = height;

        this.animals = [];

        this.colors = {
            "Dog": "#836953",
            "Cat": "#ffb347",
            "Other": "#568f56",
            "Livestock": "#fb91ac",
            "Bird": "#A7C7E7",
        };

        this.initVis();
    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 20, bottom: 20, left: 20};

        vis.width = 600 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        vis.barSize = 3;
        vis.squareSize = 20;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Populate open squares
        this.openSquares = [];
        d3.range(vis.matrixHeight).forEach(row => {
            d3.range(vis.matrixWidth).forEach(col => {
                this.openSquares.push([row, col]);
            })
        });
        this.openSquares = this.randomize(this.openSquares);

        // Draw kennel rows
        let rows = d3.range(vis.matrixWidth + 1);
        vis.svg.selectAll(".matrix-grid-row")
            .data(rows)
            .enter()
            .append("rect")
            .attr("class", "matrix-grid-row")
            .attr("x", 0)
            .attr("y", (_, i) => i * (vis.barSize + vis.squareSize))
            .attr("width", vis.matrixHeight * (vis.barSize + vis.squareSize))
            .attr("height", vis.barSize)
            .attr("fill", "lightgrey");

        // Draw kennel columns
        let cols = d3.range(vis.matrixHeight + 1);
        vis.svg.selectAll(".matrix-grid-col")
            .data(cols)
            .enter()
            .append("rect")
            .attr("class", "matrix-grid-col")
            .attr("y", 0)
            .attr("x", (_, i) => i * (vis.barSize + vis.squareSize))
            .attr("height", vis.matrixWidth * (vis.barSize + vis.squareSize) + vis.barSize)
            .attr("width", vis.barSize)
            .attr("fill", "lightgrey");

        // Draw legend
        let legendData = Object.entries(vis.colors)
        vis.svg.selectAll(".legend-square")
            .data(legendData)
            .enter()
            .append("rect")
            .attr("class", "legend-square")
            .attr("x", vis.matrixHeight * (vis.barSize + vis.squareSize) + 20)
            .attr("y", (_, i) => 10 + i * vis.squareSize)
            .attr("width", vis.squareSize / 2)
            .attr("height", vis.squareSize / 2)
            .attr("fill", d => d[1]);

        vis.svg.selectAll("text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("class", "matrix-legend-text")
            .attr("x", vis.matrixHeight * (vis.barSize + vis.squareSize) + vis.squareSize + 15)
            .attr("y", (_, i) => 19 + i * vis.squareSize)
            .text(d => d[0])
    }


    intakeAnimal(animal) {
        this.animals.push({
            square: this.openSquares.pop(),
            ...animal,
        });
        this.openSquares = this.randomize(this.openSquares);
        this.updateVis();
    }

    removeAnimal(animal) {
        this.openSquares.push(
            this.animals.find(a => a.animalID === animal.animalID)
                .square
        );
        this.animals = this.animals.filter(a => a.animalID !== animal.animalID);
        this.updateVis();
    }

    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        let animalRects = vis.svg.selectAll(".animal-square")
            .data(vis.animals, d => d.animalID);

        let animalRect = animalRects.enter()
            .append("rect")
            .attr("class", "animal-square")
            .attr("opacity", 0);

        animalRect.transition()
            .duration(50)
            .attr("opacity", 1);

        animalRect
            .merge(animalRects)
            .attr("x", d => vis.barSize + d.square[0] * (vis.barSize + vis.squareSize))
            .attr("y", d => vis.barSize + d.square[1] * (vis.barSize + vis.squareSize))
            .attr("height", vis.squareSize)
            .attr("width", vis.squareSize)
            .attr("fill", d => vis.colors[d.animalType]);

        animalRects.exit()
            .transition()
            .duration(50)
            .attr("opacity", 0)
            .remove();
    }

    randomize(arr) {
        return arr.sort(_ => Math.random() - 0.5);
    }
}
