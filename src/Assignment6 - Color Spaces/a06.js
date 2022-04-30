/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a06.js
 * @date 3/3/2021
 * @summary This program generates grids of 50x50 rectangles to visualize the Hurricane Isabel dataset.
 *
 */

// Global variables, preliminaries to draw the grid of rectangles
var svgSize = 500;
var bands = 50;
var legendWidth = 100;
var SvgName;
var ColumnName;
var ColorScale;

// Axis scales
var xScale = d3.scaleLinear()
		.domain([0, bands])
		.range([0, svgSize]);

var yScale = d3.scaleLinear()
		.domain([-1, bands - 1])
		.range([svgSize, 0]);

d3['selection'].prototype.callAndReturn = function(callable) {
	return callable(this);
};

// Color scales
let colorScaleT1 = d3.scaleLinear()
		.domain([-70, -60])
		.range(['#feb24c', '#43a2ca']);

let colorScaleT2 = d3.scaleLinear()
		.domain([-70, -60])
		.range(['steelblue', 'brown'])
		.interpolate(d3.interpolateHcl);

let colorScaleP3 = d3.scaleLinear()
		.domain([-510, 0, 510])
		.range(['#43a2ca', '#f0f0f0', '#feb24c']);

/**
 * Creates an SVG.
 *
 * @param selection {Object} The selection
 * @returns {SVG} The SVG created
 */
function createSvg(selection) {
	return selection.append('svg')
			.attr('width', svgSize)
			.attr('height', svgSize);
}

/**
 * Creates a rectangle.
 *
 * @param selection {Object} The selection
 * @returns {Rectangle} The rectangle created
 */
function createRects(selection) {
	return selection
			.append('g')
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('x', d => xScale(d.Col))
			.attr('y', d => yScale(d.Row))
			.attr('width', 10)
			.attr('height', 10);
}

/**
 * Color function for temperature 1.
 *
 * A color map based on using d3.scaleLinear() after assigning a color of your choice for both the
 * minimum and maximum temperature value. The chart has:
 * - Minimum = orange
 * - Maximum = blue
 * - it changes luminance monotonically along the scale, and
 * - it avoids the most common type of color deficiency among the population.
 *
 * @param row {data} The data
 * @returns {SVG} The SVG created
 */
function colorT1(row) {
	return colorScaleT1(row['T']);
}

/**
 * Color function for temperature 2.
 *
 * For colorT2, you should modify the color map that you used in colorT1 so that it is perceptually
 * uniform.
 *
 * @param row {data} The data
 * @returns {SVG} The SVG created
 */
function colorT2(row) {
	return colorScaleT2(row['T']);
}

/**
 * Produces a visualization of the pressure field.
 *
 * The pressure field has both positive and negative values. The chart also:
 * 1. Map zero to a neutral color
 * 2. Map non-zero values such that values of the same magnitude but different sign they are opponent
 *     to each other in Lab space
 * 3. Map values such that pressures moving away from zero change at the same rate.
 *
 * @param row {data} The data
 * @returns {SVG} The SVG created
 */
function colorP3(row) {
	return colorScaleP3(row['P']);
}

/**
 * Give a bivariate color map that portrays both temperature and pressure in the fourth plot.
 *
 * @param row {data} The data
 * @returns {SVG} The SVG created
 */
function colorPT4(row) {
	let first, second;
	let p = row['P'];
	let t = row['T'];
	
	/*
	 * Determine which third of the domain the current pressure value
	 *
	 *     |------------|------------|------------|
	 *   -510         -170          170          510
	 */
	if(p >= -510 && p < -170) {
		first = 'A';
	} else if(p >= -170 && p < 170) {
		first = 'B';
	} else {
		first = 'C';
	}
	
	/*
	 * Determine which third of the domain the current temperature value
	 *
	 *     |------------|------------|------------|
	 *   -71           -67          -63          -59
	 */
	if(t >= -71 && t < -67) {
		second = '1';
	} else if(t >= -67 && t < -63) {
		second = '2';
	} else {
		second = '3';
	}
	
	let legend = {
		'A1': '#F3F3F3', 'B1': '#C2F1CE', 'C1': '#8BE2AF',
		'A2': '#EAC5DD', 'B2': '#9EC6D3', 'C2': '#7FC6B1',
		'A3': '#E6A3D0', 'B3': '#BC9FCE', 'C3': '#7B8EAF'
	};
	
	return legend[first + second];
}

/**
 * Creates legend SVG
 *
 * @param selection
 * @returns {*}
 */
function createLegendSVG(selection) {
	return selection.append('svg')
			.attr('width', legendWidth)
			.attr('height', svgSize)
			.attr('id', SvgName + '-' + ColumnName)
			.classed('legend', true);
}

/**
 * Creates the legends colored rectangles
 *
 * @param selection
 */
function createLegendRect(selection) {
	let N = 10;
	let min = d3.min(data, d => d[ColumnName]);
	let max = d3.max(data, d => d[ColumnName]);
	
	let sampleToData = d3.scaleLinear()
			.domain([0, N - 1])
			.range([min, max]);
	
	let yLegendScale = d3.scaleLinear()
			.domain([min, max])
			.range([0, svgSize]);
	
	let colorSamples = d3.range(N).map(d => sampleToData(d));
	let height = Math.ceil((yScale.range()[0] - yScale.range()[1]) / (N - 1));
	
	return selection.selectAll('rect').data(colorSamples).enter().append('rect')
			.attr('x', 0)
			.attr('y', d => yLegendScale(d))
			.attr('width', legendWidth)
			.attr('height', height);
}

/**
 * Adds a color legend to the given chart.
 *
 * @param svgName The id for the legend
 * @param columnName The name of the column in the data set
 * @param colorScale The color scale function
 */
function createLegend(svgName, columnName, colorScale) {
	SvgName = svgName;
	ColumnName = columnName;
	ColorScale = colorScale;
	
	let N = 10;
	let min = d3.min(data, d => d[columnName]);
	let max = d3.max(data, d => d[columnName]);
	
	let yLegendScale = d3.scaleLinear()
			.domain([min, max])
			.range([0, svgSize]);
	
	d3.select('#' + svgName)
			.callAndReturn(createLegendSVG)
			.callAndReturn(createLegendRect)
			.attr('fill', ColorScale);
	
	d3.select('#' + svgName + '-' + columnName).append('g')
			.attr('id', 'y_axis')
			.call(d3.axisRight().scale(yLegendScale).ticks(N - 1))
			.append('text').text('ACT');
}

// Hook up the color functions with the fill attributes for the rects
d3.select('#plot1-temperature')
		.callAndReturn(createSvg)
		.callAndReturn(createRects)
		.attr('fill', colorT1);

d3.select('#plot2-temperature')
		.callAndReturn(createSvg)
		.callAndReturn(createRects)
		.attr('fill', colorT2);

d3.select('#plot3-pressure')
		.callAndReturn(createSvg)
		.callAndReturn(createRects)
		.attr('fill', colorP3);

d3.select('#plot4-bivariate')
		.callAndReturn(createSvg)
		.callAndReturn(createRects)
		.attr('fill', colorPT4);

createLegend('colorlegend-1', 'T', colorScaleT1);
createLegend('colorlegend-2', 'T', colorScaleT2);
createLegend('colorlegend-3', 'P', colorScaleP3);

