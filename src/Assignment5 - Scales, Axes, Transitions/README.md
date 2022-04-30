Assignment 5 Scales, Axes, Transitions
------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: Feb 24, 2021

## Notes

### What I did
For this assignment I created the scales and axis using the d3 library. I added two buttons with ids `SATV` and `SAT-cumulative` in the `buttons.js` file in order to change domain of the x-axis.
I used three functions `changeColorMap(buttonId)`, `changeDataSet(buttonId)`, and `getFill(row)` for this assignment's functionality. I created four scales named `xAxisScale`, `xAxisScale2`, `yAxisScale`, and `radiusScale` to deal with the chart's axis and circles.

I completed the extra credit for this assignment. Where you change the *x*-coordinates of the circles to alternate between `SATV` and the cumulative score `SATM + SATV`.

### Objectives
This assignment is designed to practice mode advanced concepts in d3. Specific objectives include:
- Practicing how to use d3 scales for defining the mapping between data value and visual element
- Learning how to define and use d3 axes, based on scales, to use visual elements to give context to your plots
- Exploring the use of d3 transitions for updating the data and presentation in d3. These transitions will be triggered by responding to HTML buttons.


### Description
The task for this assignment is to generate one visualization that allows to interactively investigate the Calvin college dataset through multiple views. This will combine elements of the last two assignments, but leverage new features in d3 to make for more effective visualizations.

Specifically, the scatterplot visualization will be generated of the Calvin college dataset where:
- `SATV` is used to define the x-coordinate
- `ACT` is used to define the y-coordinate
- `SATM` is used to define the radius
- `GPA` is used to define the color


This visualization is created with an SVG element whose id is `scatterplot_1` and is appended to the `index.html` file within the div tag whose id is `vis1`. This chart has the width and height of 500 pixels.

### Part 1: Use of d3 Scales
Somewhere in the code for A04, there is some code that looks like this:

    svg.selectAll("circle")
        .attr(/*NAME*/, function(d) { /* SOME CODE HERE */ })
This code will be replaced with:

    svg.selectAll("circle")
        .attr(/*NAME*/, function(d) { return attrScale(d.ATTR); })
To do this, individual scales to replace `attrScale()`. Each of these has a different specification as described next. Also, `d3.min()`, `d3.max()`, and `d3.mean(`) are helper functions that will be used in creating the scales.


#### Circle Positions
The code for `cx` and `cy` will look similar to this:

    svg.selectAll("circle")
        .attr("cx", function(d) { return cxScale(d.SATV); })
        .attr("cy", function(d) { return cyScale(d.ACT); });
Specifically, the two separate scales `cxScale()` and `cyScale()` will map from `SATV` to *x*-position and `ACT` to *y*-position. Both of these scales are instances of `d3.scaleLinear()`, configured appropriately.

#### Circle Radii
A function `rScale()` will control the mapping from `SATM` to the circle radius and is created using d3.scaleSqrt(). By setting the radius to be relative to the square root, the area of each circle will correspond directly to the value.

The smallest circles have radius 2, and the largest circles have a radius of 12.

#### Circle Colors
There will be different color maps variations. Buttons will be used to toggle which color map is displayed. The three color scales are:
1. A continuous color scale that interpolates linearly from the minimum `GPA` in the data being given color `blue`, to the maximum `GPA` in the data being given color `red`.
2. A continuous color scale that uses three of the colors in [RdYlBu-5](https://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=5) as follows. The minimum `GPA` should be given `#2c7bb6` (the first color blue), the average `GPA` should be given `#ffffbf` (the third color), and the maximum `GPA` should be given `#d7191c` (the fifth color).
3. A quantized color scale that uses all five colors in [RdYlBu-5](https://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=5) such that the minimum `GPA` gets the blue color, the maximum `GPA` gets the red color, and there are five "bands" of `GPA` values each mapped to one of the colors.

The buttons will have the following ids: `colormap-button-1`, `colormap-button-2`, and `colormap-button-3`. Their behavior will be such that when the button is clicked, the points in the visualization switch to the corresponding colormap.

### Part 2: Creating Axes in D3
D3 axis annotations will be added to the same scatterplot, by using the objects `d3.axisLeft()` and `d3.axisBottom()`.

### Part 3: Animation
When changing the circle colors, the animation transition will have a duration of 1.5 seconds, using **d3 transitions** in response to the button presses.

## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a05.js` - File that contains the functionality of web page.
* `calvinScores.js` - File that contains the data for the scores.
* `buttons.js` - File that contains the button functionality.
* `d3.js` - D3 file.

## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
