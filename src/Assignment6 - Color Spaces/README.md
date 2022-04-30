Assignment 6 Color Spaces
------------

Author: Julian Aguirre [jayaguirre@email.arizona.edu](mailto:jayaguirre@email.arizona.edu)  
Date: March 3rd, 2021

## Notes

### What I did
In this assignment, I wrote code that built a visualization for a weather simulation of [Hurricane Isabel](http://vis.computer.org/vis2004contest/data.html). I designed color spaces to see different features of the dataset.

### Objectives
This assignment is designed to get comfortable with color spaces and interpolators in d3. Specific objectives include:
- Practicing how to use d3 scales for defining the mapping between data value and various color values
- Learning how to define and use d3 colors in multiple color spaces.
- Putting theoretical notions of color into practice, such as the opponent color model
- Understanding the advantages and disadvantages of various color spaces for visualizing data.

### Description
The task for this assignment is to generate multiple visualizations of the Hurricane Isabel data, measured through atmospheric values. Specifically, the dataset measurements of temperature and pressure value for a 50x50 square grid of positions, making a total of 2500 observations of both temperature and pressure. The simulation values have been sampled at an altitude of about 15 kilometers. The dataset values are available in the repository we provide under the global variable `data`, as an array of objects:

    var data = [
        { Lat: ..., Lon: ..., T: (temperature), P: (pressure) },
            ...
    ];
Note that the atmospheric temperature ranges from about -70 to -60 degrees Celsius (in the `T` field) , and the atmospheric pressure ranges from -500 hPa to 200 hPa (in the `P` field).

### Part 1: Visualizing Temperature
The implementation of both `colorT1()` and `colorT2(`) portray temperature. For `colorT1` the color map is based on using `d3.scaleLinear()`. The constraints are:
- it changes luminance monotonically along the scale, and
- it avoids the most common type of color deficiency among the population.

For `colorT2`, it modifies the color map used in `colorT1` to become perceptually uniform.

### Part 2: Visualizing Pressure
The function `colorP3()` is implemented to produce a visualization of the pressure field. The pressure field has both positive and negative values. The pressure color map is a diverging color map, so it does the following:
- Map zero to a neutral color
- Map non-zero values such that values of the same magnitude but different sign they are opponent to each other in Lab space
- Map values such that pressures moving away from zero change at the same rate.


### Part 3: Bivariate Color Maps
The function `colorPT4()` is implemented with a bivariate color map that portrays both temperature and pressure in the fourth plot. The color map maps values of zero pressure to neutral colors, and values of nonzero pressure should be opponent to each other. Map temperature however necessary, such that as temperature changes, the colors change perceptually uniformly.

## Included files

* `README.md` - This file.
* `index.html` - File containing the structure of the web page.
* `style.css` - File to stylize the web page.
* `a06.js` - File that contains the functionality of web page.
* `data.js` - File that contains the data for the weather data.
* `d3.js` - D3 file.

## How To Run
This program does not need any special parameters to run. It should run when the `index.html` file is loaded in the browser.
