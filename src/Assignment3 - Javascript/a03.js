/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a03.js
 * @date 2/8/2021
 * @summary This file is used for the functionality of plotting and creating scatter plots.
 */
let W = 500; // width
let H = 500; // height
let R = 3; // radius
let O = 50; // offset

/**
 * Gets the color given the values provided.
 *
 * The color will be between a cyan and a dark cyan.
 *
 * @param row {objects} The current row in the score data set
 * @param column {string} The name of the column to choose from the data set
 * @returns {string} The color in string form
 */
function getColor(row, column) {
	let minMax = findMinMax(column);
	let currVal = 255 / (minMax[1] - minMax[0]) * (row[column] - minMax[0]);
	
	let c1 = Math.floor(Math.max(0, Math.min(255, currVal))) / 255;
	let c2 = Math.floor(Math.max(0, Math.min(255, currVal / 2 + 100))) / 255;
	let c3 = Math.floor(Math.max(0, Math.min(255, currVal / 2 + 100))) / 255;
	
	return rgb(c1, c2, c3);
}

/**
 * Find the maximum and minimum value from the given column in the score data set.
 *
 * If the column is "SAT" then the values used will be the minimum and maximum of column "SATM" and
 * "SATV" added together. The four possible names for the columns are:
 * - SAT
 * - SATM
 * - SATV
 * - ACT
 * - GPA
 *
 * @param column {string} Name of the column to choose from the data set
 * @returns {number[]} An array of integers of size 2 containing the max and min values
 */
function findMinMax(column) {
	let max = Number.MIN_VALUE;
	let min = Number.MAX_VALUE;
	
	if(column === "SAT") {
		// Go through scores to find the max and min for the "SATM" column
		for(let i = 0; i < scores.length; i++) {
			let curr = scores[i]["SATM"];
			if(curr < min)
				min = curr;
			if(curr > max)
				max = curr;
		}
		let minM = min;
		let maxM = max;
		max = Number.MIN_VALUE;
		min = Number.MAX_VALUE;
		// Go through scores to find the max and min for the "SATV" column
		for(let i = 0; i < scores.length; i++) {
			let curr = scores[i]["SATV"];
			if(curr < min)
				min = curr;
			if(curr > max)
				max = curr;
		}
		let minV = min;
		let maxV = max;
		return [minM + minV, maxM + maxV] // add both column values together
	} else {
		// Go through scores to find the max and min for the given column name
		for(let i = 0; i < scores.length; i++) {
			let curr = scores[i][column];
			if(curr < min)
				min = curr;
			if(curr > max)
				max = curr;
		}
		return [min, max];
	}
}

/**
 * Gets the appropriate coordinate depending on the given parameters.
 *
 * This method is used to scale the raw coordinate to a coordinate that isn't cropped out of the
 * SVG.
 *
 * @param row {objects} The current row in the score data set
 * @param column {string} The name of the column to choose from the data set
 */
function getCoord(row, column, length) {
	let currentDiff;
	let minMax = findMinMax(column);
	let totalDiff = (minMax[1] - minMax[0]);
	
	if(column === "SAT"){
		currentDiff = (row["SATM"] + row["SATV"]) - minMax[0]
	} else {
		currentDiff = row[column] - minMax[0];
	}
	
	let xScale = totalDiff + (totalDiff * 0.16);
	let yScale = currentDiff + (minMax[0] * 0.008);
	
	// Scale the coordinate so it isn't cropped out of the SVG
	return Math.ceil(length / xScale * yScale);
}

/**
 * Adds an axis to the given scatterplot.
 *
 * The given array contains the values to customize the line representing the axis and the text
 * that will appear along side the line. The attribute array for the axis contains:
 *     - attr[0] = x1 position
 *     - attr[1] = y1 position
 *     - attr[2] = x2 position
 *     - attr[3] = y2 position
 *     - attr[4] = translate x amount
 *     - attr[5] = translate y amount
 *     - attr[6] = rotation degrees
 *
 * @param type {string} Either the x-axis ("X") or y-axis ("Y")
 * @param scatterplot {string} The id of the scatterplot to add the axis
 * @param axisName {string} The string to appear as the axis name
 * @param length {number} The length of the side
 * @param ticks {number} The number of ticks to appear along axis
 * @param attr {number[]} The attribute array for the axis
 */
function drawAxis(type, scatterplot, axisName, length, ticks, attr) {
	let svg = document.getElementById(scatterplot);
	
	// Create the elements for the for axis line and axis text
	let axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	let axisText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	axisText.setAttribute('class', 'axis_text');
	
	// The attributes for the axis line and axis text
	let axisAttr = {x1: attr[0], y1: attr[1], x2: attr[2], y2: attr[3]};
	let axisTextAttr = { x:'0', y: '0',
		transform: `translate(${attr[4]}, ${attr[5]}) rotate(${attr[6]})`
	};
	
	// Add the axis attributes to the axis elements
	Object.keys(axisAttr).forEach(key =>
			axis.setAttributeNS(null, key, axisAttr[key]));
	Object.keys(axisTextAttr).forEach(key =>
			axisText.setAttributeNS(null, key, axisTextAttr[key]));
	
	let minMax = findMinMax(axisName);
	let inc = (length-O) / ticks; // The length between each tick
	
	// Iterate through the amount of ticks to place them along the given axis
	for(let i = 0; i < ticks; i++) {
		let text = ((minMax[1] - minMax[0]) * (i * inc / length)) + minMax[0];
		
		// Format value
		text = axisName === 'GPA' ? text.toFixed(1).toString() : text.toFixed(0).toString();
		
		// Create the elements for the tick and the tick text
		let tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		let tickText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		tickText.setAttribute('class', 'tick_text');
		
		// The attributes for the tick and tick text
		let tickPos = i * inc + O; // Tick position along the length of the SVG
		let tickAttr = {x1: tickPos, y1: (H - O), x2: tickPos, y2: (H - O + 10)};
		let tickTextAttr = {x: (tickPos - 10), y: (H - O + 20)};
		
		// Change to different attributes if it is the y-axis
		if(type === 'Y') {
			tickPos = H - (i * inc + O);
			tickAttr = {x1: (O - 10), y1: tickPos, x2: O, y2: tickPos};
			tickTextAttr = {x: (O - 30), y: (tickPos + 5)};
		}
		
		// Add the tick attributes to the tick elements
		Object.keys(tickAttr).forEach(key =>
				tick.setAttributeNS(null, key, tickAttr[key]));
		Object.keys(tickTextAttr).forEach(key =>
				tickText.setAttributeNS(null, key, tickTextAttr[key]));
		
		// Add the tick elements to the chart
		svg.append(tick);
		svg.append(tickText);
		tickText.appendChild(document.createTextNode(text.toString()));
	}
	
	// Add the axis elements to the chart
	svg.append(axis);
	svg.append(axisText);
	axisText.appendChild(document.createTextNode(axisName));
}

// Create SVGs
let chart1 = make('svg', {width: W, height: H, 'id': 'scatterplot_1'});
let chart2 = make('svg', {width: W, height: H, 'id': 'scatterplot_2'});
let chart2b = make('svg', {width: W, height: H, 'id': 'scatterplot_2b'});
let chart3 = make('svg', {width: W, height: H, 'id': 'scatterplot_3'});

// Add SVGs to the DOM
document.getElementById('chart_1').appendChild(chart1);
document.getElementById('chart_2').appendChild(chart2);
document.getElementById('chart_3').appendChild(chart3);
document.getElementById('chart_2b').appendChild(chart2b);

// Plot the circles for visualization 1
plotAll(chart1, scores, 'circle', {
	cx:   function(d) { return O + getCoord(d, 'SATV', W); },
	cy:   function(d) { return H - (O +getCoord(d, 'SATM', H)); },
	r:    function() { return R; },
	fill: function() { return 'darkcyan'; }
});

// Plot the circles for visualization 2
plotAll(chart2, scores, 'circle', {
	cx:   function(d) { return O + getCoord(d, 'GPA', W); },
	cy:   function(d) { return H - (O + getCoord(d, 'ACT', H)); },
	r:    function(d) { return getCoord(d, 'SATV', 5); },
	fill: function(d) { return getColor(d, 'SATM'); }
});

// Plot the circles for visualization 3
plotAll(chart3, scores, 'circle', {
	cx:   function(d) { return O + getCoord(d, 'SAT', W); },
	cy:   function(d) { return H - (O + getCoord(d, 'GPA', W)); },
	r:    function() { return R; },
	fill: function(d) { return getColor(d, 'ACT'); }
});

// Plot the circles for the extra credit visualization
plotAll(chart2b, scores, 'circle', {
	cx:      function(d) { return O + getCoord(d, 'GPA', W); },
	cy:      function(d) { return H - (O + getCoord(d, 'ACT', H)); },
	r:       function(d) { return getCoord(d, 'SATV', 5); },
	fill:    function(d) { return getColor(d, 'SATM'); },
	opacity: function() { return '0.4';}
});

let numTicks = 7;
let xAxisAttrArr = [O, H - O, H, H - O, 230, 490, 0]; // Attributes for the x-axis line
let yAxisAttrArr = [O, 0, O, H - O, 15, 275, -90]; // Attributes for the y-axis line

// Draw the axis for all the charts
drawAxis('X', 'scatterplot_1', 'SATV', W, numTicks, xAxisAttrArr);
drawAxis('Y', 'scatterplot_1', 'SATM', H, numTicks, yAxisAttrArr);
drawAxis('X', 'scatterplot_2', 'GPA', W, numTicks, xAxisAttrArr);
drawAxis('Y', 'scatterplot_2', 'ACT', H, numTicks, yAxisAttrArr);
drawAxis('X', 'scatterplot_3', 'SAT', W, numTicks, xAxisAttrArr);
drawAxis('Y', 'scatterplot_3', 'GPA', H, numTicks, yAxisAttrArr);
drawAxis('X', 'scatterplot_2b', 'GPA', W, numTicks, xAxisAttrArr);
drawAxis('Y', 'scatterplot_2b', 'ACT', H, numTicks, yAxisAttrArr);
