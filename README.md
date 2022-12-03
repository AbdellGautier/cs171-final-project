# CS171 Final Project

A website that visualizes data for animal shelter intakes and adoptions in Austin.

## Code Structure

Our website is a basic HTML / CSS / JS webpage with the following structure.
```
cs171-final-project
|   README.md
|   index.html
|   .gitignore
└───js
|   ...
└───css
|   ...
└───fonts
|   ...
└───data
|   ...
└───images
```

It renders visualizations separated by "panels" (using the JS scroll library `fullpage.js`). The JS files handle
rendering these visualizations using the D3 library.

## Datasets

We used the following datasets.

- [Austin Animal Center Intakes](https://data.austintexas.gov/Health-and-Community-Services/Austin-Animal-Center-Intakes/wter-evkm)
  - Data about each animal that is found and taken into the shelter
- [Austin Animal Center Outcomes](https://data.austintexas.gov/Health-and-Community-Services/Austin-Animal-Center-Outcomes/9t4d-g238)
  - Data about each animal that exits the shelter

These datasets share a common Animal ID that allowed us to relate intake and outcome data. 

## Libraries

We used the following libraries.
- D3
- Bootstrap
- [fullPage.js](https://alvarotrigo.com/fullPage/docs/)
- [Leaflet](https://github.com/Leaflet/Leaflet)

## Visualizations

### "The Problem" Panel

**Relevant files**
- `js/panel-expected-intakes.js`
- `js/expected-intakes-areachart`

**Description**

First, renders a form that allows a user to choose how many animals they expect to be found
by the Austin Animal Shelter. After they select an option, we render a layered area chart that shows
two areas representing the animal intakes over time: the first shows the area chart of animal intakes
if their expected choice was true, and the second shows the real area.

For interactions, there is a tooltip that shows the animal numbers at a given time if the user
hovers over the chart.

### "Imagine all the animals" Panel

**Relevant files**
- `js/panel-innovative.js`
- `js/innovative-matrix.js`

**Description**

**This is our innovative visualization**. We used the Intake and Outcome CSVs to determine when animal entered the 
shelter and when it left. We then used timeouts to simulate animals "entering" and "exiting" the shelter so that the
squares appeared when the animal entered and were removed when the animal exited.

For interactions, each square has a tooltip that shows more details about the animal when the user hovers over it. The squares
also change size and stroke on mouseover.

### "The Life of a Found Animal" panel

**Relevant files**
- `js/panel-sankey.js`
- `js/sankey.js`

**Description**

Shows a sankey chart that illustrates the various outcomes (e.g., adopted, death) of different animal species (e.g., dog
, cat).

For interactions, there is a tooltip that appears on hover.

## Styles

We use the Gotham Font. Our color scheme is light and playful, and is a combination of
a forest green, peach, and sky blue. While some of the topics of our visualizations are
slightly somber, we wanted to use our color scheme to encourage users to remain
hopeful to encourage them to take action.
