/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a05.js
 * @date 2/24/2021
 * @summary This program generates visualizations with the d3 library.
 *
 * One scatterplot chart with circles representing the standardized scores for all Calvin College
 * 2004 seniors. Where are 3 buttons that change the color scheme of the chart and two buttons that
 * change the domain of the x-axis.
 */

let W = 500; // width
let H = 500; // height
let O = 40; // offset
let colorId; // current color map

let svg = d3.select('#vis1').append('svg').attr('id', 'scatterplot_1'); // Add SVG to the DOM

// The x-axis scale for SATV values
let xScale = d3.scaleLinear()
		.domain([d3.min(scores, d => d.SATV) - 50, d3.max(scores, d => d.SATV) + 50])
		.range([O, W - O]);

// The x-axis scale for the cumulative of the SAT values
let xAxisScale2 = d3.scaleLinear()
		.domain([
			d3.min(scores, d => d.SATV) + d3.min(scores, d => d.SATM) - 100,
			d3.max(scores, d => d.SATV) + d3.max(scores, d => d.SATM) + 100])
		.range([O, W - O]);

// The y-axis scale for ACT values
let yScale = d3.scaleLinear()
		.domain([d3.max(scores, d => d.ACT) + 1, d3.min(scores, d => d.ACT) - 1])
		.range([O, H - O]);

// The circle radius scale for SATM values
let radiusScale = d3.scaleSqrt()
		.domain([d3.min(scores, d => d.SATM), d3.max(scores, d => d.SATM)])
		.range([2, 12]);

/**
 * Zooms out the scales of the axis
 *
 * The id for the x-axis is 'x-axis' and the id for the y-axis is 'y-axis'.
 */
function zoomOut() {
	// (a) update the scales
	console.log('X Scale | Domain: ' + xScale.domain() + ', Range: ' + xScale.range());
	console.log('Y Scale | Domain: ' + yScale.domain() + ', Range: ' + yScale.range());
	
	// Get previous values
	let xMin = xScale.domain()[0];
	let xMax = xScale.domain()[1];
	let yMin = yScale.domain()[1];
	let yMax = yScale.domain()[0];
	
	// How much to add at each sides of the domains
	let xDiff = (xMax - xMin) / 2;
	let yDiff = (yMax - yMin) / 2;
	
	// Grow x scale
	xScale = d3.scaleLinear()
			.domain([xMin - xDiff, xMax + xDiff])
			.range([xScale.range()[0], xScale.range()[1]]);
	
	// Grow y scale
	yScale = d3.scaleLinear()
			.domain([yMax + yDiff, yMin - yDiff])
			.range([yScale.range()[0], yScale.range()[1]]);
	
	console.log('New X Scale | Domain: ' + xScale.domain() + ', Range: ' + xScale.range());
	console.log('New Y Scale | Domain: ' + yScale.domain() + ', Range: ' + yScale.range());
	
	// (b) update the data
	let circles = d3.select('#scatterplot_1').selectAll('circle').data(scores);

	circles.enter()
			.append('circle').merge(circles).transition().duration(1500)
			.attr('cx', d => xScale(d.SATV))
			.attr('cy', d => yScale(d.ACT))
			.attr('r', d => radiusScale(d.SATM))
			.attr('fill', d => getFill(d));
	
	// (c) update the axes
	d3.select('#x_axis')
			.transition()
			.duration(1500)
			.call(d3.axisBottom().scale(xScale).ticks(5));
	
	d3.select('#y_axis')
			.transition()
			.duration(1500)
			.call(d3.axisLeft().scale(yScale).ticks(5));
}

/**
 * Changes the color scheme of the graph in the SVG.
 *
 * @param buttonId {string} The id for the given button element
 */
function changeColorMap(buttonId) {
	colorId = buttonId;
	var circles = d3.select('#scatterplot_1').selectAll('circle').data(scores);
	
	// Update the circle's fill color
	circles.exit().remove();
	circles.enter().append('circle').merge(circles).transition().duration(1500)
			.attr('fill', d => getFill(d));
}

/**
 * Change the data set that is displayed in the SVG.
 *
 * @param buttonId {string} The id for the given button element
 */
function changeDataSet(buttonId) {
	let circles = d3.select('#scatterplot_1').selectAll('circle').data(scores);
	let label = d3.select('#x-axis-label').text(buttonId === 'SATV' ? 'SATV' : 'SAT-cumulative');
	let scale = buttonId === 'SATV' ? xScale : xAxisScale2;
	
	// Update the axis label's center position depending on its length
	let textLength = label._groups[0][0].textLength.baseVal.value;
	label.attr('x', (W / 2) + (textLength / 2));
	
	// Update the circles according to the new x-axis scale
	circles.exit().remove();
	circles.enter().append('circle').merge(circles).transition().duration(1500)
			.attr('cx', d => buttonId === 'SATV' ? scale(d.SATV) : scale(d.SATV + d.SATM))
			.attr('cy', d => yScale(d.ACT))
			.attr('r', d => radiusScale(d.SATM))
			.attr('fill', d => getFill(d));
	
	// Update the axis
	d3.select('#x_axis').transition().duration(1500).call(d3.axisBottom().scale(scale).ticks(5));
}

/**
 * Chooses fill for the current circle based upon the GPA score.
 *
 * @param row The current row in the scores data set
 * @returns {string} The string name of a color fill
 */
function getFill(row) {
	let gpaMin = d3.min(scores, row => row.GPA);
	let gpaAvg = d3.mean(scores, row => row.GPA);
	let gpaMax = d3.max(scores, row => row.GPA);
	
	let colorScale1 = d3.scaleLinear()
			.domain([gpaMin, gpaMax])
			.range(['blue', 'red']);
	
	let colorScale2 = d3.scaleLinear()
			.domain([gpaMin, gpaAvg, gpaMax])
			.range(['#2C7BB6', '#FFFFBF', '#D7191C']);
	
	let colorScale3 = d3.scaleQuantize()
			.domain([gpaMin, gpaMax])
			.range(['#2C7BB6', '#ABD9E9', '#FFFFBF', '#FDAE61', '#D7191C']);
	
	// Determine which color scale to apply
	if(colorId === 'colormap-button-1') {
		return colorScale1(row.GPA);
	} else if(colorId === 'colormap-button-2') {
		return colorScale2(row.GPA);
	} else if(colorId === 'colormap-button-3') {
		return colorScale3(row.GPA);
	}
	return '#FFFFFF';
}

// Plot all the data for chart in the SVG
svg.selectAll('circle').data(scores).enter().append('circle')
		.attr('cx', d => xScale(d.SATV))
		.attr('cy', d => yScale(d.ACT))
		.attr('r', d => radiusScale(d.SATM))
		.attr('fill', d => getFill(d));

// Build the axis and apply the x-axis to the chart
svg.append('g').attr('id', 'x_axis').attr('class', 'axis')
		.attr('transform', `translate(${0}, ${H - O})`)
		.call(d3.axisBottom().scale(xScale).ticks(5))
		.append('text').text('SATV').attr('id', 'x-axis-label')
		.attr('x', (W / 2) + 18)
		.attr('y', 32);

// Build the axis and apply the y-axis to the chart
svg.append('g').attr('id', 'y_axis').attr('class', 'axis')
		.attr('transform', `translate(${O}, ${0})`)
		.call(d3.axisLeft().scale(yScale).ticks(5))
		.append('text').text('ACT')
		.attr('transform', 'rotate(-90)')
		.attr('x', -(H / 2) + 15)
		.attr('y', -28);

// Apply the default color map
colorId = 'colormap-button-1';
changeColorMap(colorId);