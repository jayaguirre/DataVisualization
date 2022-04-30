Assignment 3 Javascript
------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: Feb 8, 2021

## Notes

### Objectives
This assignment is designed to teach using Javascript to manipulate SVG objects to create a simple visualization. Specific objectives include:
- Practicing and reviewing Javascript syntax for specifying SVG elements and their attributes
- Experimenting with the basics of enumerable types and higher order functions in Javascript
- Using these tools to generate simple visualizations of a dataset
- Developing these visualizations through the paradigm of mapping data elements to visual elements by implicitly looping over the dataset with the specified attribute getters

### Part 1: Basics
 The `index.html` file will include all visualizations. Each visualization is an SVG element of 500 pixels in both width and height. The ids of the element containing the first, second, and third visualizations are `scatterplot_1`, `scatterplot_2`, and `scatterplot_3` respectively. The svg elements will be appended to div elements that were created with the ids `chart_1`, `chart_2`, and `chart_3`.

### Part 2: Visualizations
#### Visualization 1
A scatterplot of circles, showing `SAT`'s verbal scores versus `SAT`'s mathematics scores. All circles have a fixed radius and color.

#### Visualization 2
A different scatterplot that shows the relationship between:
- `GPA` scores on the x-axis
- `ACT` scores on the y-axis
- the radius of the circles to represent `SATV` scores
- color to represent `SATM`

#### Visualization 3
The third is a scatterplot where:
- the sum of the `SAT` scores specifies the x-coordinate
- `GPA` scores are on the y-axis
- radius is fixed
- color represents `ACT`

### Extra Credit
#### Improve and Justify Visualization 2 (up to 10%)
The goal for the final visualization is to improve upon Visualization 2.

There are two paragraphs of text describing the changes and reasoning and is embedded in the submitted HTML. The improved visualization is an element with id attribute equal to `scatterplot_2b`.

#### Axis Annotations (up to 40%)
Axis lines are added, as well as labels and tick marks to the `x` and `y` axes of the visualizations.

The scale of the axis is incorrect so the data points will appear to have the wrong coordinates but that is because of the misalignment of the ticks.
## Included files

* `README.md` - This file
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `svg.js` - File that contains functions used to create and populate SVGs.
* `a03.js` - File that contains the functionality of web page.
* `scores.js` - File that contains all the data points for the grades.

## References

I used this source to learn about manipulating the DOM: https://cscheid.net/courses/fall-2019/csc444/lectures/lecture4.html

## Grading
### Deductions
| Reason 				| Value 										|
| :---					|    :----										|
| Bugs or syntax errors | -10 each bug at grader's discretion to fix    |

### Point Breakdown of Features
| Requirement | Value 		|
| :---						|    :----:			|
| Consistent modular coding style | 5 |
| External documentation (README.md) following the template provided in the base repository | 5 |
| Header documentation, Internal documentation. Wherever applicable for all files | 10 |
| (Visualization 1) Correct positioning of each data point | 20 |
| (Visualization 2) Correct positioning of each data point | 15 |
| (Visualization 2) Correctly mapping the radii of each data point | 10 |
| (Visualization 2) Correct mapping data to color | 10 |
| (Visualization 3) Correct positioning of each data point | 15 |
| (Visualization 3) Correct mapping data to color | 10 |
| Total | 100 |




## How To Run
This program does not need any special parameters to run. It should run when the
`index.html` file is loaded in the browser.
