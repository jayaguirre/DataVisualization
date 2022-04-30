Assignment 9 Treemaps
---------------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: March 31st, 2021


## Notes

### What I did
In this assignment, I used the treemaps technique to build a visualization of hierarchical data. I implemented different layouts that visually encode the data. The data used in the visualizations' comes from the flare data set. Depending on the initial aspect ratio of the screen the starting orientation split the visualization will use will either be vertical (screen is wider than tall) or horizontal (screen is taller than wide). For extra credit I added a tooltip box when the user clicks a rectangle it will display the title, depth, size and if it is a rectangle has children, the children count. I felt this provides additional info about the data being encoded because if the user sees a rectangle but wants to know the exact size they can just click it.

### Objectives
This assignment is designed to teach you the basics of using space-partitioning to representing hierarchical data. Specific objectives include:
- Implementing a treemap view suitable for visualizing data hierarchies using containment
- Practicing implementing tree traversals in Javascript to compute geometric representations.
- Experimenting with visual encoding for treemaps
- Understanding the relationships and limitations of using size and area to encode hierarchies.
- Further practice in d3, particularly on computing and setting properties for rectangles.


### Description
For this assignment, treemap visualizations will be used for hierarchies. The dataset used is called the Flare dataset, which contains a hierarchy representing the directory hierarchy and files for a [software library](https://blokt.com/tool/prefuse-flare). This dataset is stored in the `flare.js` file.

### Part 1: Implementing the Basic Treemapping Algorithm
The basic treemapping heuristic draws a tree by progressively splitting a rectangle along vertical and horizontal lines such that the areas of the rectangles correspond to the weights of the subtrees. You will first implement the heuristic in its basic form, where the splits at any level are chosen along alternating directions. First split will be vertical and the following split will be horizontal.

The `setTreeDepth()` function adds the variable `depth` to each node of tree as well as return the maximum depth. The functions `setTreeSize()` and `setTreeCount()` do similar actions for their respective attributes. The depth value will be used to determine the orientation of the split.

The implementation of `setRectangles()` sets the variable `rect` for each node in the tree. This code stores the minimum and maximum *x*-value (`x1`, `x2`) and the minimum and maximum *y*-value (`y1`, `y2`) for each rectangle. `setRectangles()` is coded generically to compute the area of the rectangles using either count or size through the accessor `attrFun()`.

The function `setAttrs()` sets the visual attributes of each rectangle.

### Part 2: Improving the Visual Representation
The following two features are to improve the visualization to display information about the tree:

1. Added margins to each rectangle to better depict the nested hierarchy.
2. The use of a fill color to depict where a node occurs in the hierarchy.

### Part 3: Implementing the "Best Direction" Cutting Approach
The basic treemapping algorithm chooses a fixed direction for every tree node based on depth. This causes relatively uneven shapes, and makes it hard to read areas. A simple improvement is to have the layout algorithm choose, at every level, the direction of the cut along the longest dimension of the rectangle. If the rectangle is tall, we cut it horizontally. If the rectangle is wide, we cut it vertically.

The two buttons with ids `best-size` and `best-count` will transition the rectangles to a layout using this 'Best Direction'.

## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a09.js` - File that contains the functionality of web page.
* `flare.js` - File that contains the data to display.
* `test-cases.js` - File that contains the test cases for the treemap.
* `d3.js` - D3 file.

## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
