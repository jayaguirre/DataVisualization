Assignment 7 Linked Views, Brushing
-----------------------------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: March 15th, 2021


## Notes

### What I did

In this assignment, I wrote write code to build an interactive visualization for the Iris Dataset. I designed linked views that enable interaction through selection and brushing. In doing so, I created two scatterplots to visualize the four quantitative dimensions of the data (`sepalLength`, `sepalWidth`, `petalLength`, `petalWidth`). The first scatterplot has id `scatterplot_1` and the second scatterplot has id `scatterplot_2`.

### Objectives
The objectives are to get comfortable with brushes and linked views in d3. Specific objectives include:
- Practicing the design of multiple views visualizations
- Learning how to define interactions in d3, particularly through implementing click events for selection and `d3.brush`'s for brushing and linking.
- Experimenting with d3 brush callbacks for both types of events
- Practicing the use of d3 filters for capturing selected data objects
- Understanding how to compose all of the above skills to create an interactive visualization that allows for overview and details-on-demand


### Description
For this assignment, I created a visualization with linked views and interactive brushing.

The [Iris dataset](http://archive.ics.uci.edu/ml/datasets/Iris) will be used for the data points. This dataset has four quantitative attributes (**sepal length**, **sepal width**, **petal length**, **petal width**) and 1 categorical attribute (**species**). There are 50 samples in each of 3 species (setosa, versicolor, and virginica), for a dataset with 150 total flowers.

The visualization will consist of two side-by-side scatterplots. The first scatterplot will have the **sepal length** and **sepal width** as *x*- and *y*-axes, and the second scatterplot will show **petal length** and **petal width**. The use of color will encode the species of each flower. In addition, the visualization will support interaction via linked views: point(s) selected in one view will be highlighted in the other view. Finally, as users click on a point in either scatterplot, the values of that particular flower will be shown in a separate, third tabular view.

### Part 1: Scatterplots
The function `makeScatterplot()` will be generic and will be reused for both scatterplots. To make it general, specific functions will be passed to access the *x*- and *y*-values (called `xAccessor` and `yAccessor`).

Each scatterplot has scales and axes defined for the coordinates. All data points are drawn as a dot whose position is encoded using these scales. The radius of this dot is a constant. The color of the data is defined by the category of the iris type, and the same colors are used in both scatterplots.

### Part 2: Selection and Highlighting
When the user clicks on a dot in either scatterplot, the actual data record associated with that particular data element is displayed in the html table. This implemented with a callback function that responds to `.on("click",...)` and is attached to each circle during the main data join.

In addition, when a user clicks on a point in **either** scatterplot, the corresponding point on the **other** scatterplot is highlighted, by making *both* dots be shown with an enlarged radius. When one clicks on a different dot, the previous dots must be restored to their original size.

### Part 3: Brushing and Linking
When the user drags the mouse on either scatterplot, a rectangular **brush** is drawn on that scatterplot, indicating the region of interest. All the points with attributes inside the brushed region are considered **selected**. Selected points are drawn in a unique stroke color while unselected points are drawn with no stroke.

Moreover, if the user creates two separate brushes, selected points must satisfy the logical "and" of the criteria of the two brushes. This means dot are only highlighted if they are within both selections. If no brush is active, the points are drawn in their original style that indicates their species.

The implementation of the `onBrush()` function will accomplish this part. In callbacks `.on("brush",...)` and `.on("end",...)`, they store the `event.selection` object for the brush in the global variables `brush1` and `brush2`. These objects store the extents for each brush in pixel coordinates.

Using the selection objects, `onBrush()` creates a filter function, `isSelected()`, that will return true if a data element is contained within the active selection regions of both brushes. `onBrush()` is then implemented so that it uses all circles (from both plots) and applies this filter to identify the data elements that are selected. Selected elements are stroked using the highlight stroke color, while not selected elements are reverted to the visual appearance based on their species.

## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a07.js` - File that contains the functionality of web page.
* `iris.js` - File that contains the data for the flowers.
* `d3.js` - D3 file.


## References
I used this sources when creating the brushes: https://github.com/d3/d3-brush
I used this source to understand events in d3: https://observablehq.com/@d3/d3v6-migration-guide#events

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
| Implementing the two scatterplots, with appropriate visual encoding for positions and fill colors, axes, and labels | 20 |
| Implementing highlighting between plots by enlarging the radius of the selected data element in both plots | 15 |
| Correctly implementing the onBrush function so that the points returned by isSelected are highlighted, and all other points are colored by their species | 15 |
| Correctly implementing the logic for the isSelected function so that it returns true for selected points and takes the logical and of both brushes | 15 |
| Total | 100 |


## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
