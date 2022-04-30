Assignment 8 Parallel Coordinates
---------------------------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: March 22nd, 2021

## Notes

### What I did
In this assignment, I wrote code to build an interactive [parallel coordinates](https://en.wikipedia.org/wiki/Parallel_coordinates) visualization for the Iris Dataset. I designed interactions that support analysis with parallel coordinates.

I also implemented inverting the axis when you click on an axis.

### Objectives
This assignment is designed to provide additional practice with more advanced uses of brushes and callback handlers in d3. Specific objectives include:
- Implementing a parallel coordinates view suitable for viewing multi-dimensional datasets
- Experimenting with using SVG path types for drawing polylines.
- Practicing interactions with a parallel coordinates plot, particularly through implementing click events for selection and `d3.brush`'s for brushing and linking.
- Designing callback handlers that support the above interactions of selection and filtering
- Understanding the types of tasks that parallel coordinates are suitable for.



### Description
In this assignment, you will create a visualization that uses a parallel coordinates display to investigate the [Iris dataset](http://archive.ics.uci.edu/ml/datasets/Iris). Recall that this dataset has four quantitative attributes (sepal length, sepal width, petal length, petal width) and 1 categorical attribute (species). There are 50 samples in each of 3 species (setosa, versicolor, and virginica), for a dataset with 150 total flowers.

Your parallel coordinates view should draw all four dimensions simultaneously, and allow the user to investigate how the data spans the four dimensions through interactions. Specifically, your visualization must support:
1. brushing on any axis to select and filter a subset of the data and
2. reordering the axes by clicking on them which should swap them with their neighbor on the right.

In this assignment, you should get comfortable doing two types of selections and data joins:
- those that are mapped to the actual data array (called `data` in the template) and
- those that are mapped to an array of dimensions (called `dims`).

The array of dimensions will be used heavily in this assignment, and we will be a one-to-one mapping between `dims` and many different visual elements.

You'll note in the template code provided, I've included code that initializes, one per each dimension, an element of the `yScale`, `axes`, `brushes`, and `brushRanges` arrays. You are welcome to customize this initialization further if you like, but the basic version I've provide should be sufficient.

### Part 1: Drawing the Data
The first of four selections that you need to complete involves drawing one SVG `path` element per data element. These should be drawn as a polyline with four points, one point per the four quantitative dimensions of the data element. To do so, we will use `d3.line()`, which accepts an array of pairs `[[x1,y1], [x2,y2], ...]` and returns the associated SVG path attribute `d`. Your first task is to write the logic that makes use of the pre-defined scales to compute this parameter.

Notably, I have provided both `xScale` and `yScales` to do this. `xScale`, which is of type `d3.scalePoint()` will return for any element of dims the appropriate *x*-coordinate. For example `xScale(dims[0])` will return the *x*-coordinate of the first (leftmost) dimension. `yScales` is a tuple of scales, one per dimension, that can be used to access the y-coordinate of specific data elements on a particular scale. For example, `yScales[dims[0]]` returns the scale associated with `dim[0]` and as a result if you call `yScales[dims[0]](datum[dims[0]])` it will return the actual *y*-coordinate of a particular `datum` for dimension `dims[0]`.

I recommend looking at some examples of parallel coordinates for examples of how one uses `d3.line()`. For example, see Jason Davies' Parallel Coordinate block and this example of Most basic parallel coordinates chart in d3.js. See this link for more information about how to use `d3.line()`.

Besides using paths, you should set the stroke color to be defined by the `species` of each data element, and the opacity to be 0.75. You should also be sure to set the class of each path to `datapath` for easy access in interactions.

### Part 2: Drawing the Axes
To draw the axes, you will complete the other 3 selections. Specifically, you will need a selection that maps from `dims` to SVG groups (`g`) that will contain the axes. Each axis group should be given the class `axis`.

To draw the axes, you will need to both appropriately transform the group and make sure you call the appropriate axis function that we initialized. For the transforms, you should translate each axis by an *x*-value corresponding to its `xScale`.

To call the axes functions, we will use a d3 trick, using the function `.each()` so that we can call the appropriate axis function. Your `.each()` functions should look something like this:

    .each(function(d) {
        return d3.select(this).call(axes[d]);
    })

See this [link](https://github.com/d3/d3-selection#control-flow) for more information about the specifics of `.each()` vs. `.call()`

Here, `d3.select(this)` returns the current selection, and then we call the appropriate axis function `axis[d]` for that selection. `.each()` allows for anonymous functions so that we can select per datum `d`.

Besides calling the axes functions, you will also have to create text labels above each axis using the class `label`. This should be created similarly, but you'll transform them to be centered above each axis. The array `dimNames` stores a string for each dimension's label text. You'll also want to make sure each text label is associated with the `onClick()` function.

Finally, for each axis we will create a brush group, given the class `brush`. Like with axes, you'll use `.each()` to call the appropriate brush function that we created in the initialization. And, like with axes, you'll have to transform this to the appropriate location to align with the axis.

For all three of these selections, you may want to do you data join using keys so that you can associate each axis/label/brush with the name of the dimension rather than the dimension's index in `dims`. This will be necessary since we will reorder the axes by reordering the array `dims`, so we'll track columns by attribute name rather than index.

### Part 3: Interaction
You will implement two interactions.

#### Mouse click
First, when a text label is clicked, you should swap it with the text label that is immediately to its right. If the rightmost label is clicked, it should swap with the one immediately to its left.

To do so, you should swap the location of the dimension in the `dims` array. After doing this, you can:
1. Rebuild `xScale`, specifically you will change its domain
2. Rebind the data for axes/labels/brushes, and redefine their transforms using the updated `xScale`
3. Rebind the data for the data paths, and update the positions of all polylines, again using the updated `xScale`

All of the above should be transitioned using a duration of 1 second for each click.

#### Brushing
For our second interaction, the user should be able to brush over a particular axis and this will select a subset of the data. If the user brushes over multiple axes, the selection must satisfy all selected ranges.

We will implement this similar to A07, by defining a function `isSelected()` which should return `true` for any data element that is within the range. The brushes we created are 1-dimensional, using `d3.brushY()`, which means that their selected ranges are a bit simpler. Specifically, `[0]` is the minimum of the range and `[1]` is the maximum. So, for a given dimension `dim`, `brushRanges[dim][0]` is the minimum *y* (in pixels) and `brushranges[dim][1]` is the maximum *y* (in pixels).

Your `isSelected()` function should check all dimensions, and for an input data element `d`, return `true` if `d` is within the range of each brush. If an axis's brush is turned off, `brushRanges` for that dimension will be `null`.

All selected elements should be set to have an opacity of 0.75, whereas elements that are not selected should have an opacity of 0.1. If no brushes are enabled, then all elements should have opacity of 0.75.

## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a08.js` - File that contains the functionality of web page.
* `iris.js` - File that contains the data for the flowers.
* `d3.js` - D3 file.

## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
