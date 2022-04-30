Assignment 11 Transfer Functions
--------------------------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: April 19th, 2021

## Notes

### What I did
In this assignment, you will write code to visualize three-dimensional scalar fields through the use of volume rendering. We will rely on a volume renderer from the VTK library.
What I wanted to include was when the user drags a circle outside the chart, say the bottom, the circle would continue along the x-axis as mouse moves horizontally outside the chart. Instead the circle just stops moving when the mouse leaves the chart and start moving again when the mouse enters the chart again.

### Objectives
This assignment is designed to teach more advanced scalar field visualization through understanding how transfer functions work, utilizing a mapping from data values to optical properties. Specific objectives include:
- Utilizing transfer functions to specify the input to a volume renderer.
- Implementing an interface to specify transfer functions using d3.js.
- Understanding how interacting with a transfer function can be used to investigate volumetric data.
- Experimenting with your designed transfer functions to investigate three-dimensional scalar fields.

### Description
In this assignment, we will be utilizing volumetric scalar fields. Your template repo includes four example scalar fields in the `datasets`' directory. These are encoded as a `.vti` ([VTK ImageData](https://lorensen.github.io/VTKExamples/site/VTKFileFormats/#imagedata)) format, which will be parsed for you using the vtk.js library. This library will also do the heavy lifting of computing the volume rendered image. Your main task is to build an interface in d3.js to design the transfer functions that vtk.js will adjust how the final image looks.

We have provided a significant amount of skeleton code for you in `volren.js` as well as `a11.js`. `volren.js` should not need to be edited. It includes two functions `initializeVR()` and `updateVR()` that will create a volume rendering canvas as well as update it with modified transfer functions.

The template html file, `index.html`, is set up so that it has two different `div`'s, one for the volume renderer, with id volren, and one for the transfer function editor, with id `tfunc`. `tfunc` will ultimately contain and SVG that you specify using d3.js.

Your transfer function editor should be designed to modify and visualize the contents of two variables: `colorTF` and `opacityTF`, both declared in `a11.js`. To accomplish this, you will use d3.js to populate the contents of an SVG objects stored in the div `tfunc`.

Both transfer functions will be encoded as a simple list of pairs of the format `\[t, val\]` where `t` is a particular scalar value and `val` is either an opacity (between **\[0,1\]**) or a color (specified as a `d3.rgb()` object). These pairs are control points that VTK will linearly interpolate for you to define the appropriate color (emission) and opacity (absorption) values for any scalar value.

### Part 1: Implementing Color Transfer Functions
First, you will implement three different color transfer functions. These can be selected by the user by pressing a button in `index.html` (we’ve provided an example of one such button for you, you should add two more).

For each button press, you should update the variable `colorTF` and populate it with a color transfer function that you specify in `a11.js`. There should be three types, based on a sequential color map of your choice, a diverging color map of your choice, and a categorical color map of your choice. You are welcome to specify these as a manual list, but you may also want to use many of the predefined color maps that d3 constructors for you. The example code and optional reading discussed in L12 and its optional reading show some examples here (see [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic) as well).

Specifying a color transfer function requires two pieces. You must: (1) specify the variable `colorScale` that will be used to interpolate color for your interface and (2) specify the variable `colorTF` that will be a list of colors you pass to VTK.

Your specification should cover the full range of data values. When the input dataset is loaded by the function `initializeVR`, it will populate a global variable `dataRange` with the minimum (`dataRange\[0\]`) and maximum (`dataRange\[1\]`) of the dataset. You should use this to specify a list of color values in `colorTF`.

For the sequential scale, the `colorTF` you specify must correspond to a sequential color map. I recommend using at least a few control points for this (d3.schemeXXX allows you to design a variety of scales this way, typically using 3 to 9 control points). One way to do this is use the function `makeSequential()` to both update `colorScale` and then use the updated `colorScale` to specify a list of points for `colorTF`.

The diverging scale should be constructed similarly, except using a diverging color map.

The categorical scale can be used to provide a coarse set of labels to different ranges of scalar values. To do this, instead of using a `d3.scaleLinear`, I used a `d3.scaleQuantize` with an appropriate categorical color scheme.

Once a new color transfer function is specified, you should update the visualization of the interface by calling `updateTFunc()` and update the transfer function with the volume renderer by calling `updateTF`. Note that, when using a categorical color map, you should set the optional third parameter of `updateTF()` to `true`. When set to `false`, it forces VTK to linearly interpolate the color map, when set to `true`, it will use nearest neighbor interpolation, and when undefined, it will keep the current state.

Finally, after implementing these three variants for color maps, you should generate a visualization that shows them in the `tfunc` view. I did this using a simple color bar (a list of rectangles) which was sampled across the `dataRange` and populating their fill color with `colorScale`. I also provided a horizontal axis that indicated the domain of the transfer function and aligned with the color bar (this made use of the `xScale` variable described below).

### Part 2: Implementing Opacity Transfer Functions
Your opacity transfer function should be specified by a list of control points in the variable `opacityTF`. Like color transfer functions, your opacity transfer function should be specified by a list of control points, this time stored in the variable `opacityTF`. This list will be passed to VTK to control the volume rendering process.

Specifically, you will implement an editable curve interface for this. You should initialize `opacityTF` with at least five control points. Each of these will be visualized by drawing a polyline where you can drag the corners of the polyline to update the control points of `opacityTF`. This will require two scales, `xScale` and `yScale` that will map from data attributes to screen space. Specifically, `xScale` should map from the range of data values and `yScale` should map from the space of possible opacities (**\[0,1\]**).

To draw an editable curve, we will draw both a polyline and a set of discrete circles. The circles will be hooked to a [d3 drag interface](https://github.com/d3/d3-drag), specified by 3 functions for the start, movement, and end of a drag event. The start event will set a variable `selected` for which control point is selected, which we do that using a variable `index`. The drag event should access the position of the mouse and update `opacityTF` as the mouse moves. When this happens, you should then update both the visualization of the polyline by calling `updateTFunc()` and update the volume renderer by calling `updateVR`. You might find this example of a [line chart with draggable circles](https://bl.ocks.org/denisemauldin/538bfab8378ac9c3a32187b4d7aed2c2) particularly helpful. (Note: older version of d3 had a slightly different signature for drag events, so when you're looking for examples online keep this in mind. See https://observablehq.com/@d3/d3v6-migration-guide#events for more details.)

When editing the curve, you must handle two special cases. First, if the point being dragged is one of the endpoints of the curve, you should only allow it to move up or down. This will ensure that all possible scalar values have a defined opacity. Second, when moving an interior point to the polyline, you not allow it to move so far left or right to cross the point before or after it in the curve. Both of these constraints can be checked by looking at the value `pos` defined in the function `dragged()`. All points must only be allowed to be moved within the range of valid control points. All *x*-coordinates must lie within `dataRange` and all *y*-coordinates must lie within **\[0,1\]**.

When moving points, I also changed their fill color to represent the color specified by `colorScale`. This isn't required, but I found it added some context to which opacity values were mapped to which colors.


## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a11.js` - File that contains the functionality of web page.
* `volren.js` - File that contains the data for the flowers.
* `vtk.js` - File that contains the data for the flowers.
* `d3.js` - D3 file.

## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
