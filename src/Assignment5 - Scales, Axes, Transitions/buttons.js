/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu], JJoshua A. Levine [josh@email.arizona.edu]
 * @file buttons.js
 * @summary This file provides a simple example of using d3 to create buttons in an html webpage.
 *
 * Buttons Example for CSC444 Assignment 05
 *
 * All buttons are inserted by d3 within a div whose id is main. The buttons are created from a list
 * of buttons (called buttonList) that specifies the id, display text, and event-handler function
 * that should be called for each button click.
 */

// Here is a list with objects that specify some buttons.
var buttonList = [
	{
		id:    'colormap-button-1',
		text:  'Colormap 1',
		click: function() { changeColorMap(this.id); }
	},
	{
		id:    'colormap-button-2',
		text:  'Colormap 2',
		click: function() { changeColorMap(this.id); }
	},
	{
		id:    'colormap-button-3',
		text:  'Colormap 3',
		click: function() { changeColorMap(this.id); }
	},
	{
		id:    'SATV',
		text:  'SATV',
		click: function() { changeDataSet(this.id); }
	},
	{
		id:    'SAT-cumulative',
		text:  'SAT Cumulative',
		click: function() { changeDataSet(this.id); }
	},
	{
		id:    'zoom-out-button',
		text:  'Zoom Out',
		click: function() { zoomOut(); }
	}
];

/*
 * In the same way that we have been using d3 to create SVG elements, we can use d3 to create
 * buttons and give them attributes.
 *
 * The only new feature in the code below is the use of the on() method, which defines
 * "event handlers".  In this case, we are telling d3 to call a function in the event that a button
 * is clicked.
 */
d3.select('#controls')
		.selectAll('button')
		.data(buttonList)
		.enter()
		.append('button')
		.attr('id', function(d) { return d.id; })
		.text(function(d) { return d.text; })
		.on('click', function(event, d) {
			/*
			 * Since the button is bound to the objects from buttonList, the expression below calls
			 * the click function from either of the two button specifications in the list.
			 */
			return d.click();
		});
