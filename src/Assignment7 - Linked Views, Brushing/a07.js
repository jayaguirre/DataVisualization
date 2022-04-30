/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a07.js
 * @date 3/15/2021
 * @summary Provides functions that implement scatterplots of the iris dataset with joint interactions
 *
 * The main completed tasks are the functions:
 * 1. makeScatterplot(): Used to generically create plots
 * 2. onBrush(): The callback used to interact
 *
 * The brush selection stores values in *PIXEL UNITS*. The logic for highlighting points is  based
 * on *DATA UNITS*.
 *
 * To convert between the pixel units and data units, the scales invert function will be used. For
 * example, s(7.5) === 50, and s.invert(50) === 7.5  then the scale would be:
 *
 * > s = d3.scaleLinear().domain([5, 10]).range([0, 100])
 *
 * The "selection" of a brush is the range of values in either of the dimensions that an existing
 * brush corresponds to. The brush selection is available in the event.selection object.
 *
 * extent = event.selection
 * -  extent[0][0] is the minimum value in the x axis of the brush
 * -  extent[1][0] is the maximum value in the x axis of the brush
 * -  extent[0][1] is the minimum value in the y axis of the brush
 * -  extent[1][1] is the maximum value in the y axis of the brush
 */

// The brushes will store the extents of the brushes, if they exist on their plots. Otherwise null.
let data = iris;
let brush1 = null;
let brush2 = null;

let width = 500;
let height = 500;
let O = 40; // offset

// Setup plots
let plot1 = makeScatterplot(d3.select('#scatterplot_1'), d => d.sepalLength, d => d.sepalWidth);
let plot2 = makeScatterplot(d3.select('#scatterplot_2'), d => d.petalLength, d => d.petalWidth);

/**
 * xAccessor and yAccessor allow this to be generic to different data fields.
 *
 * @param selector {object} The data
 * @param xAccessor The x accessor data
 * @param yAccessor The y accessor data
 * @returns {{brush: *, svg: *, xScale, yScale}}
 */
function makeScatterplot(selector, xAccessor, yAccessor) {
	// Append SVG to DOM
	let svg = selector.append('svg')
			.attr('width', width)
			.attr('height', height);
	
	// Create and append brush
	let brush = d3.brush();
	svg.append('g').attr('class', 'brush').call(brush);
	
	// Get the axes labels
	let xLabel = xAccessor.toString().substring(xAccessor.toString().indexOf('.') + 1);
	let yLabel = yAccessor.toString().substring(yAccessor.toString().indexOf('.') + 1);
	
	// Create scales for the x-axis, y-axis, and circle fill
	let xScale = d3.scaleLinear()
			.domain([d3.min(data, xAccessor), d3.max(data, xAccessor)])
			.range([O, width - O]);
	
	let yScale = d3.scaleLinear()
			.domain([d3.min(data, yAccessor), d3.max(data, yAccessor)])
			.range([height - O, O]);
	
	let colorScale = d3.scaleOrdinal()
			.domain(['setosa', 'versicolor', 'virginica'])
			.range(['#86BD8B', '#B9B4D2', '#F9C082']);
	
	// Create and add circles to the SVG
	let circles = svg.append("g").selectAll('circle').data(data).enter().append('circle')
			.attr('cx', d => xScale(xAccessor(d)))
			.attr('cy', d => yScale(yAccessor(d)))
			.attr('r', 4)
			.attr('fill', d => colorScale(d.species))
			.attr('opacity', 0.5)
			.on('click', (event, circle) => onClickCircle(event, circle));
	
	// Construct and append the x-axis to the SVG
	svg.append('g')
			.attr('id', 'x_axis')
			.attr('class', 'axis')
			.attr('transform', `translate(${0}, ${height - O})`)
			.call(d3.axisBottom().scale(xScale))
			.append('text')
			.text(xLabel === 'sepalLength' ? 'Sepal Length' : 'Petal Length')
			.attr('id', 'x-axis-label')
			.attr('x', (width / 2) + 18)
			.attr('y', 32);
	
	// Construct and append the y-axis to the SVG
	svg.append('g')
			.attr('id', 'y_axis')
			.attr('class', 'axis')
			.attr('transform', `translate(${O}, ${0})`)
			.call(d3.axisLeft().scale(yScale))
			.append('text')
			.text(yLabel === 'sepalWidth' ? 'Sepal Width' : 'Petal Width')
			.attr('transform', 'rotate(-90)')
			.attr('x', -(height / 2) + 15)
			.attr('y', -28);
	
	return {
		name:   selector.attr('id'),
		svg:    svg,
		brush:  brush,
		xScale: xScale,
		yScale: yScale
	};
}

/**
 * Callback during brushing
 *
 * There are four scenarios in which the brushes are selected:
 * 1. Both brush 1 and brush 2 are empty
 * 2. Neither brush 1 not brush 2 are empty
 * 3. Brush 1 is not empty and brush 2 is empty
 * 4. Brush 1 is empty and brush 2 is not empty
 *
 * <p> <p>
 * In each scenario, the class attribute of the circles will be modified. Determining which circles
 * get their class attribute set to 'selected' and which get set to 'not-selected' depends on on
 * what scenario they occupy.
 */
function onBrush() {
	let allCircles = d3.select('body').selectAll('circle').data(data);
	let plot1Circles = d3.select('#' + plot1.name).selectAll('circle').data(data);
	let plot2Circles = d3.select('#' + plot2.name).selectAll('circle').data(data);
	
	// Scenario 1
	if(brush1 === null && brush2 === null) {
		allCircles.attr('class', 'not-selected');
		return;
	}
	
	// Scenario 3
	if(brush1 !== null) {
		// Update selected scatterplot
		plot1Circles.filter(d => isSelected(brush1, plot1, d)).attr('class', 'selected');
		plot1Circles.filter(d => !isSelected(brush1, plot1, d)).attr('class', 'not-selected');
		
		// Update other scatterplot circles
		plot2Circles.filter(d => isSelected(brush1, plot1, d)).attr('class', 'selected');
		plot2Circles.filter(d => !isSelected(brush1, plot1, d)).attr('class', 'not-selected');
	}
	
	// Scenario 4
	if(brush2 !== null) {
		// Update selected scatterplot
		plot2Circles.filter(d => isSelected(brush2, plot2, d)).attr('class', 'selected');
		plot2Circles.filter(d => !isSelected(brush2, plot2, d)).attr('class', 'not-selected');
		
		// Update other scatterplot circles
		allCircles.filter(d => isSelected(brush2, plot2, d)).attr('class', 'selected');
		allCircles.filter(d => !isSelected(brush2, plot2, d)).attr('class', 'not-selected');
	}
	
	// Scenario 2
	if(brush1 !== null && brush2 !== null) {
		// Update plot 1's circles based on the brushed area in plot 1
		plot1Circles.filter(d => !isSelected(brush1, plot1, d)).attr('class', 'not-selected');

		// Update plot 2's circles based on the brushed area in plot 2
		plot2Circles.filter(d => !isSelected(brush2, plot2, d)).attr('class', 'not-selected');

		// Remove the circles from plot 1 that are not present in plot 2's selection.
		plot1Circles.filter(d => !isSelected(brush2, plot2, d)).attr('class', 'not-selected');
		
		// Remove the circles from plot 2 that are not present in plot 1's selection.
		plot2Circles.filter(d => !isSelected(brush1, plot1, d)).attr('class', 'not-selected');
	}
}

/**
 * This method determines if a given data point is within the selection of the given brush that
 * is in the given plot.
 **
 * @param extent {object} The rectangular representation of the brush's selection
 * @param plot {object} The current scatterplot that the brush resides in
 * @param row {object} The current row in the iris data set, represents a circle
 * @returns {boolean} True if dot is in the selection; False otherwise
 */
function isSelected(extent, plot, row) {
	let cx, cy;
	
	// Convert pixel units to data units
	let x0Data = plot.xScale.invert(extent[0][0]);
	let x1Data = plot.xScale.invert(extent[1][0]);
	let y0Data = plot.yScale.invert(extent[0][1]);
	let y1Data = plot.yScale.invert(extent[1][1]);
	
	if(plot.name === 'scatterplot_1') {
		cx = row.sepalLength;
		cy = row.sepalWidth;
	} else {
		cx = row.petalLength;
		cy = row.petalWidth;
	}
	
	// This return TRUE or FALSE depending on if the points is in the selected area
	return x0Data <= cx && cx <= x1Data && y1Data <= cy && cy <= y0Data;
}

/**
 * This method updates the appearance of the circle clicked on and the corresponding circle in the
 * other scatterplot.
 *
 * @param event {event} The current mouse event
 * @param circle {object} The circle that was clicked on
 */
function onClickCircle(event, circle) {
	let target = event.target; // Targeted circle
	let plotId = event.path[3].id; // Scatterplot id
	
	// Update the table of labels with the currently selected circle's attributes
	d3.select('#table-sepalLength').text(circle.sepalLength);
	d3.select('#table-sepalWidth').text(circle.sepalWidth);
	d3.select('#table-petalLength').text(circle.petalLength);
	d3.select('#table-petalWidth').text(circle.petalWidth);
	d3.select('#table-species').text(circle.species);
	
	// Determine which scatterplot to reset and which one to update
	let searchPlot = plotId === 'scatterplot_1' ? '#scatterplot_2' : '#scatterplot_1';
	let resetPlot = plotId === 'scatterplot_1' ? '#scatterplot_1' : '#scatterplot_2';
	
	// Reset circle radii to 4 on the scatterplot that was not clicked on
	d3.select(resetPlot).selectAll('circle').data(data)
			.attr('class', 'not-selected')
			.attr('r', 4);
	
	// Set the targeted circle's radius to 6
	d3.select(target)
			.attr('class', 'selected')
			.attr('r', 6);
	
	// Update the scatterplot that was clicked on
	d3.select(searchPlot).selectAll('circle').data(data)
			.classed('selected', d => isSameCircle(circle, d))
			.classed('not-selected', d => !isSameCircle(circle, d))
			.attr('r', d => isSameCircle(circle, d) ? 6 : 4);
}

/**
 * Determines if its the given circle and the given row from the iris data set is the same circle.
 *
 * @param target {object} The current circle selected
 * @param row {object} The current row in the iris data set, represents a circle
 * @returns {boolean} True if they are the same circle; False otherwise
 */
function isSameCircle(target, row) {
	return target.sepalLength === row.sepalLength
			&& target.sepalWidth === row.sepalWidth
			&& target.petalLength === row.petalLength
			&& target.petalWidth === row.petalWidth;
}

/**
 * Updates the brush selection for brush 1.
 *
 * @param event {event} The mouse event that triggered the brush function
 */
function updateBrush1(event) {
	brush1 = event.selection;
	onBrush();
}

/**
 * Updates the brush selection for brush 2.
 *
 * @param event {event} The mouse event that triggered the brush function
 */
function updateBrush2(event) {
	brush2 = event.selection;
	onBrush();
}

// Set the on() function for each brush
plot1.brush.on('brush end', updateBrush1);
plot2.brush.on('brush end', updateBrush2);


