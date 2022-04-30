/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a04.js
 * @date 2/15/2021
 * @summary This program generates visualizations with the d3 library.
 */
let W = 600;
let H = 300;

// Get divs for the charts
let vis1 = d3.select('#vis1');
let vis2 = d3.select('#vis2');
let vis3 = d3.select('#vis3');
let vis4 = d3.select('#vis4');

// Add SVGs to the DOM
let chart1 = vis1.append('svg').attr('width', 600).attr('height', 300).attr('id', 'chart1');
let chart2 = vis2.append('svg').attr('width', 600).attr('height', 300).attr('id', 'chart2');
let chart3 = vis3.append('svg').attr('width', 600).attr('height', 300).attr('id', 'chart3');
let chart4 = vis4.append('svg').attr('width', 500).attr('height', 500).attr('id', 'scatterplot_2');

// X-axis scale for the scatterplot
let chart4XScale = d3.scaleLinear()
		.domain([d3.min(scores, d => d.GPA), d3.max(scores, d => d.GPA)])
		.range([10, 490]);

// Y-axis scale for the scatterplot
let chart4YScale = d3.scaleLinear()
		.domain([d3.min(scores, d => d.ACT), d3.max(scores, d => d.ACT)])
		.range([490, 10]);

// Scale for the radii
let chart4RScale = d3.scaleLinear()
		.domain([d3.min(scores, d => d.SATV), d3.max(scores, d => d.SATV)])
		.range([2, 5]);

// Color scale for the scatterplot
let chart4ColorScale = d3.scaleLinear()
		.domain([d3.min(scores, d => d.SATM), d3.max(scores, d => d.SATM)])
		.range(['lightcyan', 'darkcyan']);

// Plot data for chart 1
chart1.selectAll('rect').data(ukDriverFatalities).enter().append('rect')
		.attr('width', () => {
			let yearMin = d3.min(ukDriverFatalities, d => d.year);
			let yearMax = d3.max(ukDriverFatalities, d => d.year);
			return Math.ceil(W / (yearMax - yearMin + 1));
		})
		.attr('height', () => Math.ceil(H / 12))
		.attr('x', d => {
			let yearMin = d3.min(ukDriverFatalities, d => d.year);
			let yearMax = d3.max(ukDriverFatalities, d => d.year);
			return Math.ceil(W / (yearMax - yearMin + 1)) * (d.year - yearMin);
		})
		.attr('y', d => Math.ceil(H / 12) * (11 - d.month))
		.attr('fill', d => {
			let countMax = d3.max(ukDriverFatalities, d => d.count);
			let amount = (countMax - d.count) / countMax * 255;
			let r = Math.floor(Math.max(0, Math.min(255, amount)));
			let g = Math.floor(Math.max(0, Math.min(255, (amount / 2 + 127))));
			let b = Math.floor(Math.max(0, Math.min(255, (amount / 2 + 127))));
			return `rgb(${r}, ${g}, ${b})`;
		});

// Plot data for chart 2
chart2.selectAll('circle').data(ukDriverFatalities).enter().append('circle')
		.attr('cx', d => {
			let yearMin = d3.min(ukDriverFatalities, d => d.year);
			let yearMax = d3.max(ukDriverFatalities, d => d.year);
			return Math.ceil(W / (yearMax - yearMin + 1)) * (d.year - yearMin + 0.5);
		})
		.attr('cy', d => Math.ceil(H / 12) * (11 - d.month + 0.5))
		.attr('r', d => d.count / W * 3)
		.attr('stroke', () => 'white')
		.attr('fill', () => 'blue');

// Plot data for chart 3
chart3.selectAll('rect').data(ukDriverFatalities).enter().append('rect')
		.attr('width', () => Math.ceil(W / ukDriverFatalities.length))
		.attr('height', d => d.count / d3.max(ukDriverFatalities, d => d.count) * H)
		.attr('x', (d, i) => i * W / ukDriverFatalities.length)
		.attr('y', d => H - (d.count / d3.max(ukDriverFatalities, d => d.count) * H))
		.attr('fill', () => '#BBBBBB');

// Plot data for scatterplot 2
chart4.selectAll('circle').data(scores).enter().append('circle')
		.attr('cx', d => chart4XScale(d.GPA))
		.attr('cy', d => chart4YScale(d.ACT))
		.attr('r', d => chart4RScale(d.SATV))
		.attr('fill', d => chart4ColorScale(d.SATM));

