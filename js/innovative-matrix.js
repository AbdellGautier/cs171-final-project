/*
 * Matrix - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the matrix
 * @param _data						-- the dataset
 */


class InnovativeMatrix {

    constructor(parentElement, width, height) {
        this.parentElement = parentElement;

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

        this.lastRemoved = null;

        this.initVis();
    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

        // TODO: refactor to allow for dynamic width (not enough time to do this by submission deadline).
        //       Complicated b/c must determine square width, bar width, and spacing.
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        vis.barSize = 3;
        vis.squareSize = 15;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Populate open squares
        this.openSquares = this.resetOpenSquares();

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
            .attr("width", vis.squareSize / 1.5)
            .attr("height", vis.squareSize / 1.5)
            .attr("fill", d => d[1]);

        vis.svg.selectAll(".matrix-legend-text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("class", "matrix-legend-text")
            .attr("x", vis.matrixHeight * (vis.barSize + vis.squareSize) + vis.squareSize + 18)
            .attr("y", (_, i) => 19 + i * vis.squareSize)
            .text(d => d[0])

        // Draw elapsed time
        vis.elapsedTime = vis.svg.append("text")
            .attr("id", "matrix-elapsed-time")
            .attr("x", 0)
            .attr("y", -5)
            .text("Current date: select a start date");

        // Setup tooltip
        vis.tooltip = d3.select(`#${this.parentElement}`).append("div")
            .attr("id", "matrix-tooltip");
    }


    // Add the animal to the visualization
    intakeAnimal(animal) {
        // Return if no more room
        if (this.openSquares.length === 0) {
            return;
        }

        // Update time
        this.currentTime = animal.intakeTime;

        // Add animal to open square
        this.animals.push({
            square: this.openSquares.pop(),
            ...animal,
        });
        this.openSquares = this.randomize(this.openSquares);
        this.updateVis();
    }


    // Remove the animal from the visualization
    removeAnimal(animal) {
        this.lastRemoved = animal.animalID;

        this.openSquares.push(
            this.animals.find(a => a.animalID === animal.animalID)
                .square
        );
        this.animals = this.animals.filter(a => a.animalID !== animal.animalID);
        this.updateVis();
    }


   // Draw the current grid state
    updateVis() {
        let vis = this;

        // Update elapsed time
        let currentTime = new Date(vis.currentTime * 1000);
        vis.elapsedTime.text(`Current date: ${formatMatrixTime(currentTime)}`);

        // Render squares
        let animalRects = vis.svg.selectAll(".animal-square")
            .data(vis.animals, d => d.animalID);

        // Enter
        let animalRect = animalRects.enter()
            .append("rect")
            .attr("class", "animal-square")
            .attr("opacity", 0)
            .attr("x", d => vis.barSize + d.square[0] * (vis.barSize + vis.squareSize))
            .attr("y", d => vis.barSize + d.square[1] * (vis.barSize + vis.squareSize))
            .attr("height", vis.squareSize)
            .attr("width", vis.squareSize)
            .attr("fill", d => vis.colors[d.animalType])

        animalRect.transition()
            .duration(50)
            .attr("opacity", 1);

        // Update
        animalRect.merge(animalRects)
            .on("mouseover", function(e, d) {
                vis.tooltipAnimal = d.animalID;

                // Show tooltip with animal info
                vis.tooltip
                    .style("display", "block")
                    .style("left", vis.barSize + d.square[0] * (vis.barSize + vis.squareSize) + 38 + "px")
                    .style("top", vis.barSize + d.square[1] * (vis.barSize + vis.squareSize) + 53 + "px")
                    .html(`
                        <p class="matrix-tooltip-text">
                            <b>${d.breed}</b>
                        </p>
                        <p class="matrix-tooltip-text">
                            Name: ${d.name}
                        </p>
                        <p class="matrix-tooltip-text">
                            Age: ${d.age}
                        </p>
                        <p class="matrix-tooltip-text">
                            Sex: ${d.sex}
                        </p>
                    `)

                // Increase square size
                d3.select(this)
                    .attr("x", vis.barSize + d.square[0] * (vis.barSize + vis.squareSize) - 2)
                    .attr("y", vis.barSize + d.square[1] * (vis.barSize + vis.squareSize) - 2)
                    .attr("height", vis.squareSize + 4)
                    .attr("width", vis.squareSize + 4)
                    .attr("stroke", "#202020");
            })
            .on("mouseout", function(e, d) {
                // Reset square size
                d3.select(this)
                    .attr("x", vis.barSize + d.square[0] * (vis.barSize + vis.squareSize))
                    .attr("y", vis.barSize + d.square[1] * (vis.barSize + vis.squareSize))
                    .attr("height", vis.squareSize)
                    .attr("width", vis.squareSize)
                    .attr("stroke", "none");

                // Hide tooltip
                vis.tooltip.style("display", "none");
            });

        // Exit
        animalRects.exit()
            .call(_ => {
                // Hide tooltip if animal was removed
                if (vis.tooltipAnimal && vis.lastRemoved && vis.tooltipAnimal === vis.lastRemoved) {
                    vis.tooltip.style("display", "none");
                }
            })
            .transition()
            .duration(50)
            .attr("opacity", 0)
            .remove();
    }


    // Create open squares
    resetOpenSquares() {
        let vis = this;

        let openSquares = [];
        d3.range(vis.matrixHeight).forEach(row => {
            d3.range(vis.matrixWidth).forEach(col => {
                openSquares.push([row, col]);
            })
        });

        return vis.randomize(openSquares);
    }


    // Reset the visualization to an empty grid
    reset() {
        let vis = this;

        vis.openSquares = vis.resetOpenSquares();

        vis.animals = [];
        vis.updateVis();
    }


    // Randomize an array (cannot believe JS does not have a built-in array randomizer grrr)
    randomize(arr) {
        return arr.sort(_ => Math.random() - 0.5);
    }
}
