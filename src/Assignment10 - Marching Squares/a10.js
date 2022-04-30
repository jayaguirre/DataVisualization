/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a10.js
 * @date 4/12/2021
 * @summary This file constructs 4 charts that display outlined and filled isocontours from some data.
 *
 * The data used in the visualization comes from the weather simulation of Hurricane Isabel. The
 * visualizations are two-dimensional scalar fields and the contours are constructed using the
 * Marching Squares algorithm.
 *
 * Contours Levels (Temperature | Pressure):
 * - 10: -60 | 200
 * - 09: -61.1 | 122.2
 * - 08: -62.2 | 44.4
 * - 07: -63.3 | -33.3
 * - 06: -64.4 | -111.1
 * - 05: -65.5 | -188.8
 * - 04: -66.6 | -266.6
 * - 03: -67.7 | -344.4
 * - 02: -68.8 | -422.2
 * - 01: -70 | -500
 */

let currentContour; // Stores the value of the contour we are currently extracting
let pastContour = currentContour;
let svgSize = 490;
let bands = 49;

// Scale for the x-axis
let xScale = d3.scaleLinear()
		.domain([0, bands])
		.range([0, svgSize]);

// Scale for the y-axis
let yScale = d3.scaleLinear()
		.domain([-1, bands - 1])
		.range([svgSize, 0]);

// Color scale for filled isocontour temperature plot
let colorScale1 = d3.scaleLinear()
		.domain([-70, -60])
		.range(['blue', 'red']);

// Color scale for filled isocontour pressure plot
let colorScale2 = d3.scaleLinear()
		.domain([-500, 0, 200])
		.range(['#CA0020', '#F7F7F7', '#0571B0']);

// Generates a line string given an array of points.
let lineGeneration = d3.line()
		.x(p => p.x)
		.y(p => p.y)
		.defined(p => p.x !== null && p.y !== null);

d3.selection.prototype.callReturn = function(callable) {
	return callable(this);
};

/**
 * Creates SVG.
 *
 * @param sel {selection} The current selection
 * @returns {*}
 */
function createSvg(sel) {
	return sel
			.append('svg')
			.attr('width', svgSize)
			.attr('height', svgSize);
}

/**
 * Creates Groups for all the 49x49 cells.
 *
 * @param data {object} Data
 * @returns {function(*): *} The created groups.
 */
function createGroups(data) {
	return function(sel) {
		return sel
				.append('g')
				.selectAll('rect')
				.data(data)
				.enter()
				.append('g')
				.attr('transform', d => 'translate(' + xScale(d.Col) + ',' + yScale(d.Row) + ')');
	};
}

/**
 * Creates a chart that shows the outlines of the contours.
 *
 * @param minValue {number} The minimum value of the plot.
 * @param maxValue {number} The maximum value of the plot.
 * @param steps {number} The amount of contour steps to use from the contour scale.
 * @param sel {selection} The current plot selection.
 */
function createOutlinePlot(minValue, maxValue, steps, sel) {
	let contourScale = d3.scaleLinear()
			.domain([1, steps])
			.range([minValue, maxValue]);
	
	// Go through all the contour levels in the scale.
	for(let i = 1; i <= steps; ++i) {
		currentContour = contourScale(i);
		sel.filter(includesOutlineContour)
				.append('path')
				.attr('transform', 'translate(0, 10) scale(1, -1)')
				.attr('d', generateOutlineContour)
				.attr('fill', 'none')
				.attr('stroke', 'black');
	}
}

/**
 * Includes a cell if it is in the bounds of the outline contour.
 *
 * @param cell {{NW: number, NE: number, SW: number, SE: number}} The current cell.
 * @returns {boolean} True if the cell is within the current contour; False otherwise.
 */
function includesOutlineContour(cell) {
	let extent = gridExtent(cell);
	return currentContour >= extent[0] && currentContour <= extent[1];
}

/**
 * Generates the outline contour for the given cell.
 *
 * Each cell is 10x10 pixels, so this function returns a path specified using units between [0,10]
 * for both the x- and y-coordinates.
 * - the position `(0,0)`  corresponds to the `SW` value
 * - the position `(0,10)`  corresponds to the `SE` value
 * - the position `(10,0)`  corresponds to the `NW` value
 * - the position `(10,10)` corresponds to the `NE` value.
 *
 * Cases
 * - No Crossing: 0, 15
 * - Singlet (bot-left): 1, 14
 * - Singlet (bot-right): 2, 13
 * - Singlet (top-right): 4, 11
 * - Singlet (top-left): 7, 8
 * - Double Adjacent (horizontal): 3, 12
 * - Double Adjacent (vertical): 6, 9
 * - Double Opposite: 5, 10
 *
 * @param cell {{NW: number, NE: number, SW: number, SE: number}} The current cell in the plot.
 * @return {string} SVG path specifier (the `d` attribute) for the contour.
 */
function generateOutlineContour(cell) {
	// Set the four edge scales according to four vertices of the current cell.
	let wScale = d3.scaleLinear().domain([cell.SW, cell.NW]).range([0, 10]);
	let eScale = d3.scaleLinear().domain([cell.SE, cell.NE]).range([0, 10]);
	let nScale = d3.scaleLinear().domain([cell.NW, cell.NE]).range([0, 10]);
	let sScale = d3.scaleLinear().domain([cell.SW, cell.SE]).range([0, 10]);
	
	// The mid-points of the four edges belonging to the current cell.
	let wMid = wScale(currentContour);
	let eMid = eScale(currentContour);
	let nMid = nScale(currentContour);
	let sMid = sScale(currentContour);
	
	// Determine the which case the current cell has to provide a polyline for the contour border
	let linePoints;
	switch(polarity(cell, currentContour).case) {
		case 0:
		case 15:
			linePoints = [{x: 0, y: 0}, {x: 0, y: 0}];
			break;
		case 1:
		case 14:
			linePoints = [{x: 0, y: wMid}, {x: nMid, y: 10}];
			break;
		case 2:
		case 13:
			linePoints = [{x: 10, y: eMid}, {x: nMid, y: 10}];
			break;
		case 4:
		case 11:
			linePoints = [{x: sMid, y: 0}, {x: 10, y: eMid}];
			break;
		case 7:
		case 8:
			linePoints = [{x: sMid, y: 0}, {x: 0, y: wMid}];
			break;
		case 3:
		case 12:
			linePoints = [{x: 0, y: wMid}, {x: 10, y: eMid}];
			break;
		case 6:
		case 9:
			linePoints = [{x: sMid, y: 0}, {x: nMid, y: 10}];
			break;
		case 5:
			linePoints = [{x: 0, y: wMid}, {x: sMid, y: 0}, {x: null, y: null}, {x: nMid, y: 10},
						  {x: 10, y: eMid}];
			break;
		case 10:
			linePoints = [{x: 0, y: wMid}, {x: nMid, y: 10}, {x: null, y: null}, {x: sMid, y: 0},
						  {x: 10, y: eMid}];
			break;
		default:
			linePoints = [];
	}
	return lineGeneration(linePoints);
}

/**
 * Creates a chart that shows the filled in section of the contours and applies a corresponding
 * color to the sections.
 *
 * @param minValue {number} The minimum value of the plot.
 * @param maxValue {number} The maximum value of the plot.
 * @param steps {number} The amount of contour steps to use from the contour scale.
 * @param sel {selection} The current plot selection.
 * @param colorScale {function} The color scale to be applied to the plot.
 */
function createFilledPlot(minValue, maxValue, steps, sel, colorScale) {
	let contourScale = d3.scaleLinear()
			.domain([1, steps])
			.range([minValue, maxValue]);
	
	// Go through all the contour levels in the scale.
	for(let i = 0; i <= steps; ++i) {
		pastContour = currentContour;
		currentContour = contourScale(i);
		sel.filter(includesFilledContour)
				.append('path')
				.attr('transform', 'translate(0, 10) scale(1, -1)')
				.attr('d', generateFilledContour)
				.attr('stroke', 'none')
				.attr('fill', d => colorScale(currentContour));
	}
}

/**
 * Includes a cell if it is to be produced in the filled contour.
 *
 * This function is enumerating through the contours by largest to smallest. The SVG will draw
 * smallest one on top of the large ones. A filled contour indicates all regions that have the
 * function value `currentContour` or higher.
 *
 * @param cell {{NW: number, NE: number, SW: number, SE: number}} The current cell in the plot.
 * @returns {boolean} True if the cell is within the current filled contour; False otherwise.
 */
function includesFilledContour(cell) {
	let extent = gridExtent(cell);
	let greaterMin = currentContour >= extent[0]; // Min
	let lesserMax = currentContour <= extent[1]; // Max
	let pastExtent = pastContour < extent[0]; // Past
	return (greaterMin && lesserMax) || pastExtent;
}

/**
 * Provides an outline for the polygon that spans the cell.
 *
 * @param cell {{NW: number, NE: number, SW: number, SE: number}} The current cell in the plot.
 * @return {string} SVG path specifier (the `d` attribute) for the contour.
 */
function generateFilledContour(cell) {
	// Set the four edge scales according to four vertices of the current cell.
	let wScale = d3.scaleLinear().domain([cell.SW, cell.NW]).range([0, 10]);
	let eScale = d3.scaleLinear().domain([cell.SE, cell.NE]).range([0, 10]);
	let nScale = d3.scaleLinear().domain([cell.NW, cell.NE]).range([0, 10]);
	let sScale = d3.scaleLinear().domain([cell.SW, cell.SE]).range([0, 10]);
	
	// The mid-points of the four edges belonging to the current cell.
	let wMid = wScale(currentContour);
	let eMid = eScale(currentContour);
	let nMid = nScale(currentContour);
	let sMid = sScale(currentContour);
	
	// Determine the which case the current cell has to provides a line for a polygon
	let linePoints;
	switch(polarity(cell, currentContour).case) {
		case 0:
			linePoints = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
			break;
		case 15:
			linePoints = [{x: 0, y: 0}, {x: 10, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 0, y: 0}];
			break;
		case 1:
			linePoints = [{x: 0, y: wMid}, {x: 0, y: 10}, {x: nMid, y: 10}, {x: 0, y: wMid}];
			break;
		case 14:
			linePoints = [{x: 0, y: wMid}, {x: nMid, y: 10}, {x: 10, y: 10}, {x: 10, y: 0},
						  {x: 0, y: 0}];
			break;
		case 2:
			linePoints = [{x: nMid, y: 10}, {x: 10, y: 10}, {x: 10, y: eMid}, {x: nMid, y: 10}];
			break;
		case 13:
			linePoints = [{x: 0, y: 0}, {x: 0, y: 10}, {x: nMid, y: 10}, {x: 10, y: eMid},
						  {x: 10, y: 0}, {x: 0, y: 0}];
			break;
		case 4:
			linePoints = [{x: sMid, y: 0}, {x: 10, y: eMid}, {x: 10, y: 0}, {x: sMid, y: 0}];
			break;
		case 11:
			linePoints = [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x: 10, y: eMid},
						  {x: sMid, y: 0}, {x: 0, y: 0}];
			break;
		case 7:
			linePoints = [{x: 0, y: wMid}, {x: 0, y: 10}, {x: 10, y: 10}, {x: 10, y: 0},
						  {x: sMid, y: 0}, {x: 0, y: wMid}];
			break;
		case 8:
			linePoints = [{x: 0, y: 0}, {x: 0, y: wMid}, {x: sMid, y: 0}, {x: 0, y: 0}];
			break;
		case 3:
			linePoints = [{x: 0, y: wMid}, {x: 0, y: 10}, {x: 10, y: 10}, {x: 10, y: eMid},
						  {x: 0, y: wMid}];
			break;
		case 12:
			linePoints = [{x: 0, y: 0}, {x: 0, y: wMid}, {x: 10, y: eMid}, {x: 10, y: 0},
						  {x: 0, y: 0}];
			break;
		case 6:
			linePoints = [{x: sMid, y: 0}, {x: nMid, y: 10}, {x: 10, y: 10}, {x: 10, y: 0},
						  {x: sMid, y: 0}];
			break;
		case 9:
			linePoints = [{x: 0, y: 0}, {x: 0, y: 10}, {x: nMid, y: 10}, {x: sMid, y: 0},
						  {x: 0, y: 0}];
			break;
		case 5:
			linePoints = [{x: 0, y: wMid}, {x: 0, y: 10}, {x: nMid, y: 10}, {x: 10, y: eMid},
						  {x: 10, y: 0}, {x: sMid, y: 0}, {x: 0, y: wMid}];
			break;
		case 10:
			linePoints = [{x: 0, y: 0}, {x: 0, y: wMid}, {x: nMid, y: 10}, {x: 10, y: 10},
						  {x: 10, y: eMid}, {x: sMid, y: 0}, {x: 0, y: 0}];
			break;
		default:
			linePoints = [];
	}
	return lineGeneration(linePoints);
}

/**
 * Creates a 4-bit polarity signature in as an integer between 0 and 15.
 *
 * Any bit that is 1 indicates that the associate cell corner is on or above the contour.
 *
 * Cases:
 * 1. No crossing (negative).
 * 1. Singlet (bot-left, negative)
 * 2. Singlet (bot-right, negative)
 * 3. Double Adjacent (horizontal, bottom positive)
 * 4. Singlet (top-right, negative)
 * 5. Double Opposite (backward-slash)
 * 6. Double Adjacent (vertical, right positive)
 * 7. Singlet (top-left, positive)
 * 8. Singlet (top-left, negative)
 * 9. Double Adjacent (vertical, left positive)
 * 10. Double Opposite (forward-slash)
 * 11. Singlet (top-right, positive)
 * 12. Double Adjacent (horizontal, top positive)
 * 13. Singlet (bot-right, positive)
 * 14. Singlet (bot-left, positive)
 * 15. No crossing (positive).
 *
 * @param cell {{NW: number, NE: number, SW: number, SE: number}} The current cell in the plot.
 * @param isocontour {number} The current isocontour value.
 * @returns {{SE: (number), SW: (number), NE: (number), NW: (number)}} Object containing the case
 */
function polarity(cell, isocontour) {
	let result = {
		NW: cell.NW < isocontour ? 0 : 1,
		NE: cell.NE < isocontour ? 0 : 1,
		SW: cell.SW < isocontour ? 0 : 1,
		SE: cell.SE < isocontour ? 0 : 1
	};
	result.case = result.NW + result.NE * 2 + result.SE * 4 + result.SW * 8;
	return result;
}

/**
 * This function returns the pair [min/max] from the coordinates in the given cell.
 *
 * @param cell {{NW: number, NE: number, SW: number, SE: number}} The current cell
 * @returns {number[]} The pair [min/max]
 */
function gridExtent(cell) {
	return [Math.min(cell.NW, cell.NE, cell.SW, cell.SE),
			Math.max(cell.NW, cell.NE, cell.SW, cell.SE)];
}

// ============================= Compute the Isocontour Plots =================================== //
let plot1T = d3.select('#plot1-temperature')
		.callReturn(createSvg)
		.callReturn(createGroups(temperatureCells));

let plot1P = d3.select('#plot1-pressure')
		.callReturn(createSvg)
		.callReturn(createGroups(pressureCells));

createOutlinePlot(-70, -60, 10, plot1T);
createOutlinePlot(-500, 200, 10, plot1P);

// ========================= Compute the Filled Isocontour Plots ================================ //
let plot2T = d3.select('#plot2-temperature')
		.callReturn(createSvg)
		.callReturn(createGroups(temperatureCells));

let plot2P = d3.select('#plot2-pressure')
		.callReturn(createSvg)
		.callReturn(createGroups(pressureCells));

createFilledPlot(-70, -60, 10, plot2T, colorScale1);
createFilledPlot(-500, 200, 10, plot2P, colorScale2);