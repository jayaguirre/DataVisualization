Assignment 12 Flow Visualization
--------------------------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: April 28th, 2021

## Notes

### What I did
In this assignment, I wrote code to visualize two-dimensional vector fields through the use of color mapping and glyphs. I did four charts that displayed the flow visualizations differently. Part one was color mapping, part two was line plots, and part three was showing the direction, magnitude and orientation of the flow data. For the forth chart I translated the glyphs to a randomized spot near their original position.

### Objectives
This assignment is designed to teach you the basics of vector field visualization through encoding per-position properties with a variety of techniques. Specific objectives include:
- Using color mapping to visualize vector field magnitudes.
- Utilizing line glyphs to visualize vector field directions.
- Using glyphs that use geometry to encode both magnitude and orientation.
- Developing custom glyphs that use multiple encoding channels to redundantly encode aspects of the vector field.
- Further practice in using SVG shapes.
- Experimenting with various glyphs for encoding vector fields to help to understand the strengths and limitations of each type of visualization.


### Description
We will visualize a new dataset in this assignment that is a simulation of 3 vortices that rotate in different directions. This dataset is encoded much the same as the previous field data we've worked with, with a collection of **50x50** cells that each store a 2D vector *(v~x~,v~y~)*

    {
        "vx": x-component-of-vector,
        "vy": y-component-of-vector,
        "Col": i,
        "Row": j
    }

So, like A06, the main selections we are doing will be vertex-focused. Each vertex will be visualized using an area that is **10x10** pixels. We've constructed the grid for you with the appropriate transformations so that you can refer to the vertex in a local coordinate space (similar to A10).

You will visualize this data in four different ways.

### Part 1: Colormapping Vector Magnitude
For part 1, you should implement a color map that shows the magnitude of each vector as a rectangle whose fill color corresponds to magnitude. Recall that the magnitude of a vector can be computed as sqrt(v^2^~x~ + v^2^~y~). The data provided has magnitudes that range from approximately **\[0,2\]**. You should select an appropriate color map that shows the corresponding data. The rectangles should be positioned and sized relative to local coordinates. Your solution should look something like this (of course, using whatever colors you prefer):

### Part 2: Line Plots
For part 2, you should draw a line glyph that indicates the direction, but **not** the orientation, of the flow. This glyph should be centered in the available space (**(5,5)**) and extend equally in both the forward and reverse direction of the vector field. It's length should be uniform as well which can be achieved by normalizing the vector (dividing the coordinates by its length). Your solution should look something like this:

Such plots should reveal only an indication of which way the vector field is flowing, but not its orientation or magnitude.

### Part 3: Uniformly-Placed Arrow Glyphs
For part 3, you should draw a glyph that is shaped like an arrow. These glyphs will be uniformly placed and use geometry to visualize both the magnitude and direction of the vector field.

Arrows should be placed so their tails are in the center of the space and extend only along the direction the vector field is pointing. They should have some kind of cap (triangular or otherwise) indicating this direction. The length of the arrow should correspond to the length of the vector. SVG paths can be used for this. Your solution should look something like this:


### Part 4: Randomly-Placed Custom Glyphs
For part 4, you will correct the visual artifacts caused by uniformly placing glyphs by applying a random jitter to their location.

## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a12.js` - File that contains the functionality of web page.
* `data.js` - File that contains the data to display.
* `d3.js` - D3 file.

## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
