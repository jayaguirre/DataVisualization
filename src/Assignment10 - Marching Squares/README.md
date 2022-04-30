Assignment 10 Marching Squares
------------------------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: April 12th, 2021

## Notes

### What I did
For this assignment, to visualize two-dimensional scalar fields with the use of contours, I implemented two main functions that generate the contours needed to display the two types of charts, `generateOutlineContour` and `generateFilledContour`. In `generateFilledContour` I combined 14 cases into 7 cases since there is no need to distinguish between them. For `generateFilledContour`, I created polygon lines for all 16 cases in order to represent each type of case polarity and rotation. The contours where constructed using the Marching Squares' algorithm.

### Objectives
The assignment is designed to teach the basics of scalar field visualization through combinations of geometric features (isocontours) and color mapping. Specific objectives include:
- Implementing the marching squares' algorithm for extracting isocontours in a piecewise manner.
- Utilizing a case-table structure to maintain repeated computational structure and develop the algorithm in a compact way
- Further practice in using SVG paths and d3's features for constructing them
- Experimenting with visual encoding of scalar fields utilizing both isocontour outlines and filled isocontours.

### Description
The data used to visualize a weather simulation of Hurricane Isabel comes from this [dataset](http://vis.computer.org/vis2004contest/data.html) and is stored in the file `data.js`. The arrays `temperatureCells` and `pressureCells` contains objects that look like:

    {
        NW: value-at-nw-corner,
        NE: value-at-ne-corner,
        SW: value-at-sw-corner,
        SE: value-at-se-corner,
        Row: i,
        Col: j                    
    }

The main selections will be *cell-focused* rather than *vertex-focused*, meaning each element drawn will be based on the collection of *four values* stored in the four corners (northwest (`NW`), northeast (`NE`), southwest (`SW`), and southeast (`SE`)) of the cell. The data will be processed as a grid of **49x49** cells.

### Part 1: Implementing Contour Outlines
The computation of outline contours will be implemented using marching squares. The `generateOutlineContour()` function returns an SVG path specifier (the `d` attribute) for the contour located at a given cell `d`. The `includesOutlineContour()` functions filters which cells have the border present within them.

Each cell to be exactly **10x10** pixels. The position **(0,0)** in the local coordinate space for each cell corresponds to the `SW` value, and the position **(10,10)** corresponds to the `NE` value. [d3.line()](https://github.com/d3/d3-shape#lines) is used to generate the SVG path specifier string. For certain cases 5 and 10, multiple disconnected lines are returned using the `.defined()` function to create breaks in the line.

### Part 2: Implementing Filled Contours
The computation of *filled contours*, again using marching squares to compute the boundary of contours. To do this, you will complete the skeleton code function `generateFilledContour()` as well as the function `includesFilledContour()` in `a10.js`.

The *order* in which filled contours are draw is important. The `generateFilledContour()` function draws the contours with the highest value first and then layers the lower values on top of them. A filled contour indicates all regions that have the function value `currentContour` or higher. The case table provides an outline for the polygon that spans the cell, rather than just the polyline that lives on its border.

## Included files
* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a10.js` - File that contains the functionality of web page.
* `d3.js` - D3 file.

## References
I used this source when figuring out how to create the polygon lines: https://github.com/d3/d3-shape#lines.

## Grading
### Deductions
| Reason 				| Value 										|
| :---					|    :----										|
| Bugs or syntax errors | -10 each bug at grader's discretion to fix    |

### Point Breakdown of Features
| Requirement | Value |
| :--- | :----: |
| Consistent modular coding style | 5 |
| External documentation following the template | 5 |
| Header documentation, Internal documentation. Wherever applicable for all files | 10 |
| Correctly implementing the case table for Part 1 | 20 |
| Correctly interpolating positions for each case table for Part 1 | 15 |
| Correctly selecting which cells to draw in Part 2 with `includesFilledContour()` | 10 |
| Correctly implementing the case table for Part 2 | 20 |
| Correctly interpolating positions for each case table for Part 1 | 15 |
| Total | 100 |


## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
