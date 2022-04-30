/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a11.js
 * @date 4/19/2021
 * @summary This implements an editable transfer function to be used in concert with the volume renderer defined in volren.js
 *
 * colorTF and opacityTF store a list of transfer function control points.  Each element should be
 * [k, val] where k is a the scalar position and val is either a d3.rgb or opacity in [0,1].
 *
 * Part 1:
 * Update the variable colorTF and populate it with a color transfer function.
 * - sequential color map
 * - diverging color map
 * - categorical color map
 *
 * What I wanted to include was when the user drags a circle outside of the chart, say the bottom,
 * the circle would continue along the x-axis as mouse moves horizontally outside of the chart.
 * Instead the circle just stops moving when the mouse leaves the chart and start moving again when
 * the mouse enters the chart again.
 */
let colorTF = [];
let opacityTF = [];

let size = 500;
let barHeight = 30;
let O = 30; // offset
let svg = null;
let span = 0;
let bottom = size - (O + barHeight); // The bottom limit of the chart

// Variables for the scales
let xScale = null;
let yScale = null;
let colorScale = null;

d3['selection'].prototype.callAndReturn = function(callable) {
	return callable(this);
};

// Will track which point is selected
let selected = null;

// Attach upload process to the loadData button
var input = document.getElementById('loadData');
input.addEventListener('change', upload);

/**
 * Function to process the upload.
 *
 * <p>
 *     Uploads the file from the computer.
 * </p>
 */
function upload() {
	if(input.files.length > 0) {
		let file = input.files[0];
		console.log('You chose', file.name);
		
		let fReader = new FileReader();
		fReader.readAsArrayBuffer(file);
		
		fReader.onload = function(e) {
			let fileData = fReader.result;
			initializeVR(fileData); // load the .vti data and initialize volren
			resetTFs(); // upon load, we'll reset the transfer functions completely
			updateTFunc(); // Update the tfunc canvas
			updateVR(colorTF, opacityTF, false); // update the TFs with the volren
		};
	}
}

/**
 * Function to create the d3 objects for the transfer functions.
 * <p>
 *     Initializes the transfer function
 * </p>
 */
function initializeTFunc() {
	svg = d3.select('#tfunc')
			.append('svg')
			.attr('id', 'plot')
			.attr('width', size)
			.attr('height', size);
	
	// Build the axis and apply the x-axis to the chart
	svg.append('g')
			.attr('id', 'x_axis')
			.attr('class', 'axis')
			.attr('transform', `translate(${0}, ${bottom})`);
	
	// Build the axis and apply the y-axis to the chart
	svg.append('g')
			.attr('id', 'y_axis')
			.attr('class', 'axis')
			.attr('transform', `translate(${O}, ${0})`);
	
	// Add the actual polylines for data elements, each with class "datapath"
	svg.append('g')
			.attr('class', 'lines')
			.selectAll('path')
			.data(opacityTF)
			.enter()
			.append('path')
			.classed('datapath', true)
			.style('stroke', 'black');
	
	// Setup the drag methods
	let drag = d3.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	
	// Initialize circles for the opacity TF control points
	svg.append('g')
			.attr('class', 'points')
			.selectAll('circle')
			.data(opacityTF)
			.enter()
			.append('circle')
			.attr('index', (d, i) => i)
			.style('cursor', 'pointer')
			.call(drag);
	
	// Create the color bar to show the color TF
	svg.append('g')
			.attr('transform', `translate(${0}, ${size - barHeight})`)
			.append('svg')
			.attr('id', 'color-bar')
			.attr('width', size - O)
			.attr('height', barHeight);
	
	// After initializing, set up anything that depends on the TF arrays
	updateTFunc();
}

/**
 * Call this function whenever a new dataset is loaded or whenever colorTF and opacityTF change.
 * <p>
 *     Updates all visual things based on `opacityTF` having changed (with a data join/update),
 *     including redrawing circles and updating the path.
 * </p>
 * <p>
 *     The idea was that the "data" here is the `opacityTF`, and you want to keep it consistent both
 *     with what's drawn on the screen, what gets updated by the user, and what gets sent to
 *     `vtk.js`.
 * </p>
 */
function updateTFunc() {
	// The color scale for the x-axis
	xScale = d3.scaleLinear()
			.domain([dataRange[0], dataRange[1]])
			.range([O, size - O]);
	
	// The opacity scale for the y-axis
	yScale = d3.scaleLinear()
			.domain([0, 1])
			.range([size - (O + barHeight), O]);
	
	// Hook up axes to updated scales
	d3.select('#x_axis').call(d3.axisBottom().scale(xScale).ticks(5));
	d3.select('#y_axis').call(d3.axisLeft().scale(yScale).ticks(10));
	
	// Setup the drag methods
	let drag = d3.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	
	let circles = d3.select('.points').selectAll('circle').data(opacityTF);
	
	// Update points
	circles.exit().remove();
	circles.enter().append('circle').merge(circles)
			.attr('index', (d, i) => i)
			.style('cursor', 'pointer')
			.call(drag)
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.attr('r', 5)
			.attr('fill', (d) => colorScale(d[0] - span));
	
	let lines = d3.select('.lines').selectAll('path').data(opacityTF);
	
	// Add the actual polylines for data elements, each with class "datapath"
	lines.exit().remove();
	lines.enter().append('path').merge(lines)
			.classed('datapath', true)
			.attr('d', (d, i) => path(d, i))
			.style('stroke', 'black');
}

/**
 * Function to respond to buttons that switch color transfer functions.
 */
function resetTFs() {
	makeSequential();
	makeOpacity();
}

/**
 * Make a sequential color transfer function.
 */
function makeSequential() {
	span = 0;
	colorScale = d3.scaleSequential()
			.domain([dataRange[0], dataRange[1]])
			.interpolator(d3.interpolateCool);
	
	if(dataRange[1] !== 1 && xScale.domain()[1] !== 1) {
		let rects = d3.select('#color-bar').selectAll('rect').data(d3.range(dataRange[1]));
		
		// Create the scale and color map for the color bar
		rects.exit().remove();
		rects.enter().append('rect').merge(rects)
				.attr('x', d => xScale(d))
				.attr('y', 0)
				.attr('height', barHeight)
				.attr('width', (d) => (xScale.range()[1] / dataRange[1]))
				.attr('fill', (d) => colorScale(d));
		
		// Update opacity curves
		let myScale = d3.scaleLinear().domain([0, 1]).range([dataRange[0], dataRange[1]]);
		opacityTF = d3.ticks(0, 1, 5).map(d => [myScale(d), d]);
		colorTF = d3.ticks(dataRange[0], dataRange[1], 5).map(d => [d, d3.rgb(colorScale(d))]);
	}
}

/**
 * Sets the divergent color map.
 */
function makeDivergent() {
	span = 0;
	colorScale = d3.scaleSequential()
			.domain([dataRange[0], dataRange[1]])
			.interpolator(d3.interpolatePiYG);
	
	let rects = d3.select('#color-bar').selectAll('rect').data(d3.range(dataRange[1]));
	
	// Create the scale and color map for the color bar
	rects.exit().remove();
	rects.enter().append('rect').merge(rects)
			.attr('x', d => xScale(d))
			.attr('y', 0)
			.attr('height', barHeight)
			.attr('width', d => (xScale.range()[1] / dataRange[1]))
			.attr('fill', (d) => colorScale(d));
	
	// Update opacity curves
	let myScale = d3.scaleLinear().domain([0, 1]).range([dataRange[0], dataRange[1]]);
	opacityTF = d3.ticks(0, 1, 5).map(d => [myScale(d), d]);
	colorTF = d3.ticks(dataRange[0], dataRange[1], 5).map(d => [d, d3.rgb(colorScale(d))]);
}

/**
 * Set the categorical color map.
 */
function makeCategorical() {
	let scheme = d3.schemeDark2;
	let N = scheme.length;
	let sampleToData = d3.scaleLinear()
			.domain([dataRange[0], dataRange[1]])
			.range([O, size - O]);
	let colorSamples = d3.range(N).map(d => d * (dataRange[1] / N));
	
	let total = d3.max(xScale.range()) - d3.min(xScale.range());
	let width = total / N; // The width of a color block in the color bar
	span = dataRange[1] / N; // The offset of the first color, (skipped the first color otherwise)
	
	colorScale = d3.scaleThreshold().domain(colorSamples).range(scheme);
	let rects = d3.select('#color-bar').selectAll('rect').data(colorSamples);
	
	// Create the scale and color map for the color bar
	rects.exit().remove();
	rects.enter().append('rect').merge(rects)
			.attr('x', d => xScale(d))
			.attr('y', 0)
			.attr('height', barHeight)
			.attr('width', (d) => width)
			.attr('fill', (d) => colorScale(d - span));
	
	// Update opacity curves
	let myScale = d3.scaleLinear().domain([0, 1]).range([dataRange[0], dataRange[1]]);
	opacityTF = d3.ticks(0, 1, 5).map(d => [myScale(d), d]);
	colorTF = d3.ticks(dataRange[0], dataRange[1], 5).map(d => [d, d3.rgb(colorScale(d - span))]);
}

/**
 * Make a default opacity transfer function.
 *
 * - xScale maps from the range of data values
 * - yScale maps from the space of possible opacities ([0,1])
 */
function makeOpacity() {
	// Here is a default TF
	opacityTF = [
		[dataRange[0], 0],
		[dataRange[1], 1]
	];
}

/**
 * Called when mouse down.
 *
 * @param event {event} The current event.
 * @param d {object} The data
 */
function dragstarted(event, d) {
	selected = parseInt(d3.select(this).attr('index'));
}

/**
 * Called when mouse drags.
 *
 * Updates the variable `opacityTF`.
 *
 * @param event {event} The current event.
 * @param d {object} The data
 */
function dragged(event, d) {
	if(selected != null) {
		let position = [];
		
		// Ignore if outside of drawable area of chart
		if(event.x < O || event.x > (size - O) || event.y > bottom || event.y < O) {
			return;
		}
		
		// Hard-coded values to constraint inner circles' horizontal movements (not finished)
		// if(selected === 1 ) {
		// 	let circles = d3.select('.points').selectAll('circle');
		//
		// 	let filteredNext = circles.filter(function (d) {
		// 		let next = parseInt(d3.select(this).attr('index')) + 1;
		// 		return next === selected + 1;
		// 	})
		//
		// 	let filteredPrev = circles.filter(function (d) {
		// 		let prev = parseInt(d3.select(this).attr('index')) - 1;
		// 		return prev === selected - 1;
		// 	})
		//
		// 	let num = filteredNext.node().__data__[0];
		// 	// if(d[1][0] > opacityTF[2][0]) {
		// 		// opacityTF[1][0] = opacityTF[2][0]
		//
		// 	if(event.x < xScale(num)) {
		// 		return;
		// 	}
		//
		// 	// }
		// }
		
		// Based on pos and selected, update opacityTF
		// Check if the selected circles are the first or last ones, to constraint to vertical axis
		if(d[0] === 0 || d[0] === dataRange[1]) {
			position[0] = d[0];
		} else {
			position[0] = xScale.invert(event.x);
		}
		position[1] = yScale.invert(event.y);
		
		opacityTF[selected] = position;
		updateTFunc(); // update TF window
		updateVR(colorTF, opacityTF); // update volume renderer
	}
}

/**
 * Called when mouse up.
 */
function dragended() {
	selected = null;
}

/**
 * Draws a line between circles.
 *
 * @param circle {circle} Circle selected.
 * @param index {number} Position of the circle.
 * @returns {*}
 */
function path(circle, index) {
	let point1 = [xScale(circle[0]), yScale(circle[1])];
	let circle2, point2;
	if(index === opacityTF.length - 1) {
		point2 = point1;
	} else {
		circle2 = opacityTF[index + 1];
		point2 = [xScale(circle2[0]), yScale(circle2[1])];
	}
	return d3.line()([point1, point2]);
}

// Reset the TFs and then initialize the d3 SVG canvas to draw the default transfer function
resetTFs();
initializeTFunc();

// Configure callbacks for the sequential button
d3.select('#sequential')
		.on('click', function() {
			makeSequential();
			updateTFunc();
			updateVR(colorTF, opacityTF, false);
		});

// Configure callbacks for the divergent button
d3.select('#divergent')
		.on('click', function() {
			makeDivergent();
			updateTFunc();
			updateVR(colorTF, opacityTF, false);
		});

// Configure callbacks for the categorical button
d3.select('#categorical')
		.on('click', function() {
			makeCategorical();
			updateTFunc();
			updateVR(colorTF, opacityTF, true);
		});
