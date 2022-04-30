/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a08.js
 * @date 3/22/2021
 * @summary This file provides how to initialize and draw the parallel coordinates plot.
 *
 * Initialize the x and y scales, axes, and brushes.
 *
 * - xScale stores a mapping from dimension id to x position
 * - yScales[] stores each y scale, one per dimension id
 * - axes[] stores each axis, one per id
 * - brushes[] stores each brush, one per id
 * - brushRanges[] stores each brush's event.selection, one per id
 */

// dims will store the four axes in left-to-right display order
let dims = [
	'sepalLength',
	'sepalWidth',
	'petalLength',
	'petalWidth'
];

// mapping from dimension id to dimension name used for text labels
let dimNames = {
	'sepalLength': 'Sepal Length',
	'sepalWidth':  'Sepal Width',
	'petalLength': 'Petal Length',
	'petalWidth':  'Petal Width'
};

let data = iris;
let width = dims.length * 125;
let height = 500;
let padding = 50;

let yScales = {};
let axes = {};
let brushes = {};
let brushRanges = {};

let xScale = d3.scalePoint()
		.domain(dims)
		.range([padding, width - padding])
		.padding(1);

// Color scale for lines
let colorScale = d3.scaleOrdinal()
		.domain(['setosa', 'versicolor', 'virginica'])
		.range(['#86BD8B', '#B9B4D2', '#F9C082']);

// Apply to all dimensions
dims.forEach(perDimension);

/**
 * For each dimension, we will initialize a yScale, axis, brush, and brushRange
 *
 * The possible names are:
 * - Sepal Length
 * - Sepal Width
 * - Petal Length
 * - Petal Width
 *
 * @param dimName {string} The current dimension name
 */
function perDimension(dimName) {
	// Create a scale for each dimension
	yScales[dimName] = d3.scaleLinear()
			.domain(d3.extent(data, datum => datum[dimName]))
			.range([height - padding, padding]);
	
	// Set up a vertical axis for each dimensions
	axes[dimName] = d3.axisLeft().scale(yScales[dimName]).ticks(10);
	
	// Set up brushes as a 20 pixel width band, will use transforms to place them in right location
	brushes[dimName] = d3.brushY().extent([[-10, padding], [+10, height - padding]]);

	// Brushes will be hooked up to their respective updateBrush functions
	brushes[dimName].on('brush end', updateBrush(dimName));
	
	// Initial brush ranges to null
	brushRanges[dimName] = null;
}

/**
 * Returns a callback function that calls onBrush() for the brush associated with each dimension
 *
 * @param dim {string} The name of the dimension
 * @returns {(function(*): void)|*}
 */
function updateBrush(dim) {
	return function(event) {
		brushRanges[dim] = event.selection;
		onBrush();
	};
}

/**
 * Callback when brushing to select elements in the PC plot
 */
function onBrush() {
	let allLines = d3.selectAll('.datapath');
	
	// Reset if no brushes are present
	if(brushRanges['sepalLength'] === null && brushRanges['sepalWidth'] === null &&
			brushRanges['petalLength'] === null && brushRanges['petalWidth'] === null) {
		allLines.classed('selected', true).classed('not-selected', false);
		return;
	}
	
	function isSelected(row) {
		let allBrushes = d3.selectAll('.brush').nodes();
		let bools = [true, true, true, true];
		
		// Go through the brushes to determine which data paths are to be displayed
		for(let i = 0; i < allBrushes.length; i++){
			let brush = allBrushes[i].__brush.selection;
			if(brush !== null) {
				let selPoint = [brush[0][1],brush[1][1]];
				let selData = selPoint.map(yScales[dims[i]].invert);
				let value = row[dims[i]];
				bools[i] = d3.min(selData) <= value && value <= d3.max(selData);
			}
		}
		// True if data path is present in all brushes
		return bools[0] && bools[1] && bools[2] && bools[3];
	}
	
	let selected = allLines.filter(isSelected);
	let notSelected = allLines.filter(d => !isSelected(d));
	
	// Update the style of the selected and not selected data
	selected.classed('selected', true).classed('not-selected', false);
	notSelected.classed('not-selected', true).classed('selected', false);
}

/**
 * Callback for swapping axes when a text label is clicked.
 *
 * @param event {event} The current mouse event
 * @param label {string} The text the user clicked on
 */
function onClick(event, label) {
	let currIndex, currLabel, nextIndex, nextLabel, moveX;
	let newDims = ['','','',''];
	
	d3.selectAll('.axis')
			.data(dims, d => dims.indexOf(d))
			.each(function(dimName, index) {
			
		// Set the indexes and labels for the pair of axes to swap
		currIndex = index;
		currLabel = label;
		nextIndex = dims.indexOf(label) === 3 ? 2 : dims.indexOf(label) + 1;
		nextLabel = dims[nextIndex];
		
		let currNode = d3.select(this);
		
		// Determine if the current axis is the one to swap
		if(dimName === label) {
			newDims[index] = nextLabel;
			moveX = nextLabel;
		} else if(dimName === nextLabel) {
			newDims[index] = label;
			moveX = label
		} else {
			newDims[index] = dimName;
			moveX = dimName
		}
		
		// Move axis
		currNode.transition().duration(1000)
				.attr('transform', d => 'translate(' + xScale(moveX) + ')')
				
		return currNode.call(axes[dimName]);
	})
	
	// Update elements to reflect the new axes positions
	dims = newDims;
	xScale.domain(dims)
	
	d3.selectAll('.label').transition().duration(1000).text(d => dimNames[d])
			.attr('transform', d => 'translate(' + xScale(d) + ')')
	
	d3.selectAll('.datapath').data(data).transition().duration(1000)
			.attr('d', (d) => path(d))
			.style('stroke', d => colorScale(d.species));
}

/**
 * Inverts the axis when the user clicks on the ticks of an axis.
 *
 * @param event {event} The current mouse event
 * @param axisName {string} The name of the axis the user clicked on
 */
function invertAxis(event, axisName) {
	// Create a scale for each dimension
	yScales[axisName]
			.domain(d3.extent(data, datum => datum[axisName]))
			.range([yScales[axisName].range()[1], yScales[axisName].range()[0]]);
	
	// Set up a vertical axis for each dimensions
	axes[axisName] = d3.axisLeft().scale(yScales[axisName]).ticks(10);
	
	// Update axis
	d3.select(this).transition().duration(1000).call(d3.axisLeft().scale(yScales[axisName]));
	
	// Update data paths
	d3.selectAll('.datapath').data(data).transition().duration(1000)
			.attr('d', (d) => path(d))
			.style('stroke', d => colorScale(d.species));
}

/**
 * The path function take a row of the csv as input, and return x and y coordinates of the line
 * to draw for this raw.
 *
 * @param row {object} The current row in the iris data set.
 * @returns Positions to place current line
 */
function path(row) {
	return d3.line()(dims.map(function(dimName) {
		return [xScale(dimName), yScales[dimName](row[dimName])];
	}));
}

let svg = d3.select('#pcplot')
		.append('svg')
		.attr('width', width)
		.attr('height', height);

// Add the actual polylines for data elements, each with class "datapath"
svg.append('g').selectAll('.datapath')
		.data(data)
		.enter()
		.append('path')
		.classed('datapath', true)
		.attr('d', (d) => path(d))
		.style('stroke', d => colorScale(d.species));

// Add the axis groups, each with class "axis"
svg.selectAll('.axis')
		.data(dims).enter().append('g')
		.classed('axis', true)
		.each(function(d) {d3.select(this).call(d3.axisLeft().scale(yScales[d]));})
		.attr('transform', d => 'translate(' + xScale(d) + ')')
		.on('click', invertAxis);

// Add the axes labels, each with class "label"
svg.selectAll('.label')
		.data(dims)
		.enter()
		.append('text')
		.classed('label', true)
		.attr('transform', d => 'translate(' + xScale(d) + ')')
		.attr('x', -12)
		.attr('y', 20)
		.text(d => dimNames[d])
		.on('click', onClick);

// Add the brush groups, each with class ".brush"
svg.selectAll('.brush')
		.data(dims).enter().append('g')
		.classed('brush', true)
		.each(function(dimName) {d3.select(this).call( brushes[dimName]);})
		.attr('transform', d => 'translate(' + xScale(d) + ')')
		.selectAll('rect')
		.attr('x', -8)
		.attr('width', 16);


