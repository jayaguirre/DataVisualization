/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a12.js
 * @date 4/28/2021
 * @summary This file provides how to initialize visualization vector fields using color mapping and glyphs
 *
 * In this assignment, I wrote code to visualize two-dimensional vector fields through the use of
 * color mapping and glyphs. I did four charts that displayed the flow visualizations differently.
 * Part one was color mapping, part two was line plots, and part three was showing the direction,
 * magnitude and orientation of the flow data. For the forth chart I translated the glyphs to a
 * randomized spot near their original position.
 */
let svgSize = 510;
let bands = 50;

let lineGen = d3.line()
		.x((p) => p.x)
		.y((p) => p.y)
		.defined(d => d.x !== null && d.y !== null);

let xScale = d3.scaleLinear()
		.domain([0, bands])
		.range([5, svgSize - 5]);

let yScale = d3.scaleLinear()
		.domain([0, bands])
		.range([svgSize - 5, 5]);

let colorPart1 = d3.scaleLinear()
		.domain([0, 2])
		.range(['#761275', '#B1C8DF']);

let colorPart2 = d3.scaleLinear()
		.domain([0, 2])
		.range(['#EA802C', '#126ECB']);

d3.selection.prototype.callReturn = function(callable) {
	return callable(this);
};

/**
 * Create SVG.
 *
 * @param sel {object} The current selection
 * @returns {*}
 */
function createSvg(sel) {
	return sel
			.append('svg')
			.attr('width', svgSize)
			.attr('height', svgSize);
}

/**
 * Create groups.
 *
 * @param data
 * @returns {function(*): *}
 */
function createGroups(data) {
	return function(sel) {
		return sel
				.append('g')
				.selectAll('*')
				.data(data)
				.enter()
				.append('g')
				.attr('transform', d => `translate(${xScale(d.Col)},${yScale(d.Row)}) scale(1,-1)`);
	};
}

/**
 * Perform an uniform glyph transformation for Part 3.
 *
 * 1. It may help to consider drawing two pieces for each arrow, using a separate SVG path for the
 * stem and head of the arrow.
 * 2. It's easier to draw the arrow pointing in one fixed direction, and then rotate the entire
 * arrow using the appropriate SVG commands. Use Math.atan2 to compute the angle of this rotation.
 * 3. SVG transform attributes can have more than one instruction
 *
 * @param d
 */
function uniformGlyphTransform(d) {
	let len = 2;
	// Stem positions
	let startX = 0;
	let startY = 0;
	let endX = 10 * vectorMag(d);
	let endY = 0;
	
	// Arrow head positions
	let AX = endX - len;
	let AY = endY - len;
	let BX = endX - len;
	let BY = endY + len;
	
	let arrow = [
		{x: startX, y: startY}, // Start point
		{x: endX, y: endY}, // End Point
		{x: null, y: null},
		{x: endX, y: endY},
		{x: AX, y: AY}, // Horizontal arrow Head
		{x: null, y: null},
		{x: endX, y: endY},
		{x: BX, y: BY} // Vertical arrow head
	];
	return lineGen(arrow);
}

/**
 * Perform a random glyph transformation for Part 4.
 *
 * Corrects the visual artifacts caused by uniformly placing glyphs by applying a random jitter to
 * their location.
 *
 * The glyph is a custom drawn glyph that encodes both the direction and magnitude of the vector
 * field. The custom glyph also makes use of both geometry and color.
 *
 * @param d
 */
function randomGlyphTransform(d) {
	// Stem positions
	let startX = 0;
	let startY = 0;
	let endX = 10 * vectorMag(d);
	let endY = 0;
	
	let len = endX; // Length of the triangle
	let side = 1.5; // How far the wings go
	
	// Arrow head positions
	let AX = endX - len;
	let AY = endY - side;
	let BX = endX - len;
	let BY = endY + side;
	
	let arrow = [
		{x: startX, y: startY}, // Start point
		{x: endX, y: endY}, // End Point
		{x: null, y: null},
		{x: endX, y: endY},
		{x: AX, y: AY}, // Horizontal arrow Head
		{x: null, y: null},
		{x: endX, y: endY},
		{x: BX, y: BY}, // Vertical arrow head
		{x: AX, y: AY} // Connect for triangle
	];
	return lineGen(arrow);
}

/**
 * Finds the magnitude of a given vector.
 *
 * @param vector {object} The current vector.
 * @returns {number} The magnitude of the vector.
 */
function vectorMag(vector) {
	return Math.sqrt((vector.vx * vector.vx) + (vector.vy * vector.vy));
}

/**
 * Calculates the angle in the plane between the positive x-axis and the ray from (0,0) to the point
 * (x,y).
 *
 * This is from the references part of the README.
 *
 * @param x {number} The x-coordinate of the point.
 * @param y {number} The y-coordinate of the point.
 * @returns {number} The degrees the point is from the x-axis plane.
 */
function calcAngleDegrees(x, y) {
	return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * Get an integer between two numbers inclusive.
 *
 * @param min {number} Minimum
 * @param max {number} Maximum
 * @returns {*}
 */
function getRndInteger(min, max) {
	return Math.random() * (max - min + 1) + min;
}

// ======================================== PART 1 ============================================== //
let magColor = d3.select('#plot-color')
		.callReturn(createSvg)
		.callReturn(createGroups(data));

magColor.append('rect')
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', d => colorPart1(vectorMag(d)));

// ======================================== PART 2 ============================================== //
let lineGlyph = d3.select('#plot-line')
		.callReturn(createSvg)
		.callReturn(createGroups(data));

lineGlyph.append('line')
		.attr('x1', 0)
		.attr('y1', 0)
		.attr('x2', d => 10)
		.attr('y2', d => 0)
		.attr('transform', d => `rotate(${calcAngleDegrees(d.vx, d.vy)},5,0)`);

// ======================================== PART 3 ============================================== //
let uniformGlyph = d3.select('#plot-uniform')
		.callReturn(createSvg)
		.callReturn(createGroups(data));

uniformGlyph.append('g')
		.append('path')
		.attr('d', uniformGlyphTransform)
		.attr('fill', 'none')
		.style('stroke', 'black')
		.attr('transform', d => `translate(${0},${5}) rotate(${calcAngleDegrees(d.vx, d.vy)},5,0)`);

// ======================================== PART 4 ============================================== //
let randomGlyph = d3.select('#plot-random')
		.callReturn(createSvg)
		.callReturn(createGroups(data));

randomGlyph.append('path')
		.attr('d', randomGlyphTransform)
		.attr('fill', d => colorPart2(vectorMag(d)))
		.style('stroke', d => colorPart2(vectorMag(d)))
		.attr('transform', function(d) {
			let rumble = 3;
			let moveX = getRndInteger(-rumble, rumble);
			let moveY = getRndInteger(-rumble, rumble);
			return `translate(${moveX},${moveY}) rotate(${calcAngleDegrees(d.vx, d.vy)},5,0)`;
		});
