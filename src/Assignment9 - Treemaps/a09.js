/**
 * @author Julian Aguirre [jayaguirre@email.arizona.edu]
 * @course CSC 444
 * @file a09.js
 * @date 3/31/2021
 * @summary This file constructs and provides different view layouts for tree maps.
 *
 * The data used in the visualizations comes from the flare data set. Depending on the initial
 * aspect ratio of the screen the starting orientation split the visualization will use will either
 * be vertical (screen is wider than tall) or horizontal (screen is taller than wide).
 */

// let data = test_1;
// let data = test_2;
let data = flare;
let treeNodeList = [];
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let orientationStart = winWidth > winHeight ? 0 : 1;
let mode = 'normal';

// Color scale for the depth of the treemap
let colorScale = d3.scaleOrdinal()
		.domain([0, 1, 2, 3])
		.range(['#7A0177', '#C51B8A', '#F768A1', '#FBB4B9']);

/**
 * A tree helper function that sets the size of the current subtree in the tree.
 *
 * @param tree {object} The node that contains the root of the tree.
 * @returns {number} The total size number in the tree
 */
function setTreeSize(tree) {
	if(tree.children !== undefined) {
		let size = 0;
		for(let i = 0; i < tree.children.length; ++i) {
			size += setTreeSize(tree.children[i]);
		}
		tree.size = size;
	}
	return tree.size;
}

/**
 * A tree helper function that sets the count of the current subtree in the tree.
 *
 * @param tree {object} The node that contains the root of the tree.
 * @returns {number} The count of nodes in the current subtree.
 */
function setTreeCount(tree) {
	if(tree.children !== undefined) {
		let count = 0;
		for(let i = 0; i < tree.children.length; ++i) {
			count += setTreeCount(tree.children[i]);
		}
		tree.count = count;
	}
	// Current tree is a leaf node: Set tree.count to 1
	if(tree.children === undefined) {
		tree.count = 1;
	}
	return tree.count;
}

/**
 * A tree helper function that sets the tree depth of the tree.
 *
 * @param tree {object} The node that contains the root of the tree.
 * @param depth {number} The depth of the tree
 * @returns {number} The maximum depth of the tree
 */
function setTreeDepth(tree, depth) {
	let maxDepth = depth;
	if(tree.children !== undefined) {
		for(let i = 0; i < tree.children.length; ++i) {
			let currDepth = setTreeDepth(tree.children[i], depth + 1);
			if(currDepth > maxDepth) {
				maxDepth = currDepth;
			}
		}
		tree.depth = depth;
	}
	// Current tree is a leaf node: Set tree.depth to current depth
	if(tree.children === undefined) {
		tree.depth = depth;
	}
	return maxDepth;
}

/**
 * Sets a rectangle for the current tree node.
 *
 * @param rect {{y1: number, x1: number, y2: number, x2: number}} The current rectangle
 * @param tree {object} The node that contains the root of the tree.
 * @param attrFun {function} The function to use generic attributes
 */
function setRectangles(rect, tree, attrFun) {
	let splitVertically = tree.depth % 2 === orientationStart;
	let border = 5;
	tree.rect = rect;
	
	// Current tree node has children
	if(tree.children !== undefined) {
		let cumulativeAttrs = [0];
		
		// Collect the selected attributes for the current children
		for(let i = 0; i < tree.children.length; ++i) {
			cumulativeAttrs.push(cumulativeAttrs[i] + attrFun(tree.children[i]));
		}
		
		// Set the current rectangle's dimensions
		let rectWidth = rect.x2 - rect.x1;
		let rectHeight = rect.y2 - rect.y1;
		
		// Scales depends on the current dimension of the rectangle
		let scale = d3.scaleLinear()
				.domain([0, cumulativeAttrs[cumulativeAttrs.length - 1]])
				.range([0, splitVertically ? rectWidth : rectHeight]);
		
		// Split the current rectangle into smaller rectangles
		for(let i = 0; i < tree.children.length; ++i) {
			let x1, x2, y1, y2;
			
			// Determine if the 'Best' button was clicked
			if(mode === 'best' && tree.children[i].children === undefined) {
				splitVertically = (rectHeight <= rectWidth);
			}
			
			// Layout current tree node's children based on splitting orientation
			if(splitVertically) {
				x1 = i === 0 ? rect.x1 + border : tree.children[i - 1].rect.x2;
				x2 = x1 + (attrFun(tree.children[i]) / attrFun(tree)) * (rectWidth - border * 2);
				y1 = rect.y1 + border;
				y2 = rect.y2 - border;
			} else {
				x1 = rect.x1 + border;
				x2 = rect.x2 - border;
				y1 = i === 0 ? rect.y1 + border : tree.children[i - 1].rect.y2;
				y2 = y1 + (attrFun(tree.children[i]) / attrFun(tree)) * (rectHeight - border * 2);
			}
			setRectangles({x1: x1, x2: x2, y1: y1, y2: y2}, tree.children[i], attrFun);
		}
	}
}

/**
 * Set attributes for the nodes in the tree.
 *
 * Displays a tooltip box when the user clicks a rectangle that shows the title, depth, size and if
 * it is a rectangle with children, count.
 *
 * @param sel {selection} All the tree nodes
 */
function setAttrs(sel) {
	sel
			.attr('title', treeNode => treeNode.name)
			.attr('width', function(treeNode) {
				let widthDiff = treeNode.rect.x2 - treeNode.rect.x1;
				return widthDiff < 0 ? 0 : widthDiff;
			})
			.attr('height', treeNode => treeNode.rect.y2 - treeNode.rect.y1)
			.attr('x', treeNode => treeNode.rect.x1)
			.attr('y', treeNode => treeNode.rect.y1)
			.attr('stroke', treeNode => 'black')
			.attr('fill', function(treeNode) {
				return treeNode.depth === maxDepth ? '#FEEBE2' : colorScale(treeNode.depth);
			})
			.on('click', function(event, d) {
				d3.select('#tip-title').text(d.name);
				d3.select('#tip-depth').text(d.depth);
				d3.select('#tip-size').text(d.size);
				d3.select('#tip-count').text(d.count);
				
				// Determine if rectangle has children to display the 'Count' data
				if(d.name[0] === d.name[0].toLowerCase()) {
					d3.selectAll('.tip-optional').style('display', 'table-row');
				} else {
					d3.selectAll('.tip-optional').style('display', 'none');
				}
				toolTip.style('opacity', .9);
				toolTip.style('left', event.clientX + 'px').style('top', event.clientY + 'px');
			});
}

/**
 * Make a list of all the nodes present in the tree.
 *
 * @param tree {object} The node that contains the root of the tree.
 * @param list {object[]} The complete list of tree nodes.
 */
function makeTreeNodeList(tree, list) {
	list.push(tree);
	if(tree.children !== undefined) {
		for(let i = 0; i < tree.children.length; ++i) {
			makeTreeNodeList(tree.children[i], list);
		}
	}
}

// ============================= Construct Treemap Chart ======================================== //

// Initialize the size, count, and depth variables within the tree
setTreeSize(data);
setTreeCount(data);
let maxDepth = setTreeDepth(data, 0);

// Compute the rectangles for each tree node
setRectangles({x1: 0, y1: 0, x2: winWidth, y2: winHeight}, data, node => node.size);
makeTreeNodeList(data, treeNodeList);

// d3 selection to draw the tree map
let gs = d3.select('#svg')
		.attr('width', winWidth)
		.attr('height', winHeight)
		.selectAll('g')
		.data(treeNodeList)
		.enter()
		.append('g');

gs.append('rect').call(setAttrs);

// Container for the tooltip box
let toolTip = d3.select('#tool-tip');

// ================================ Buttons Callbacks =========================================== //

// Callback for 'Size' button
d3.select('#size').on('click', function(event, d) {
	mode = 'normal';
	toolTip.style('opacity', 0);
	setRectangles({x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, node => node.size);
	d3.selectAll('rect').transition().duration(1000).call(setAttrs);
});

// Callback for 'Count' button
d3.select('#count').on('click', function(event, d) {
	mode = 'normal';
	toolTip.style('opacity', 0);
	setRectangles({x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, node => node.count);
	d3.selectAll('rect').transition().duration(1000).call(setAttrs);
});

// Callback for 'Best Size' button
d3.select('#best-size').on('click', function(event, d) {
	mode = 'best';
	toolTip.style('opacity', 0);
	setRectangles({x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, node => node.size);
	d3.selectAll('rect').transition().duration(1000).call(setAttrs);
});

// Callbacks for 'Best Count' button
d3.select('#best-count').on('click', function(event, d) {
	mode = 'best';
	toolTip.style('opacity', 0);
	setRectangles({x1: 0, x2: winWidth, y1: 0, y2: winHeight}, data, node => node.count);
	d3.selectAll('rect').transition().duration(1000).call(setAttrs);
});
