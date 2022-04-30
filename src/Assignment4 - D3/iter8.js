function plotAll(svg, data, element, attributeGetters) {
	var obj;
	for(var i = 0; i < data.length; ++i) {
		obj = {};
		for(var key in attributeGetters) {
			obj[key] = attributeGetters[key](data[i], i);
		}
		svg.appendChild(make(element, obj));
	}
}

function rectWidth(svgWidth) {
	return function() {
		return Math.ceil(svgWidth / ukDriverFatalities.length);
	};
}

function rectHeight(svgHeight) {
	return function(row, index) {
		return row.count / 2500 * svgHeight;
	};
}

function rectX(svgWidth) {
	return function(row, index) {
		return index * svgWidth / ukDriverFatalities.length;
	};
}

function rectY(svgHeight) {
	return function(row, index) {
		return svgHeight - (row.count / 2500 * svgHeight);
	};
}

function clamp(v) {
	return Math.floor(Math.max(0, Math.min(255, v)));
}

function rgb(r, g, b) {
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// function color(count) {
// 	// count = 2500 -> rgb(0, 127, 127) (dark cyan)
// 	// count = 0 -> rgb(255, 255, 255) (cyan)
//
// 	var amount = (2500 - count) / 2500 * 255;
// 	var s = clamp(amount), s2 = clamp(amount / 2 + 127), s3 = clamp(amount / 2 + 127);
//
// 	return rgb(s, s2, s3);
// }

function radius(amount) {
}

var chart1 = make('svg', {width: 600, height: 300, 'class': 'my-chart'});
document.getElementById('chart1').appendChild(chart1);
plotAll(chart1, ukDriverFatalities, 'rect', {
	width:  function() { return Math.ceil(600 / (1984 - 1969 + 1)); },
	height: function() { return Math.ceil(300 / 12); },
	x:      function(row) { return Math.ceil(600 / (1984 - 1969 + 1)) * (row.year - 1969); },
	y:      function(row) { return Math.ceil(300 / 12) * (11 - row.month); },
	fill:   function(row) {
		return color(row.count);
	}
});

var chart2 = make('svg', {width: 600, height: 300, 'class': 'my-chart'});
document.getElementById('chart2').appendChild(chart2);
plotAll(chart2, ukDriverFatalities, 'circle', {
	cx:     function(row) { return Math.ceil(600 / (1984 - 1969 + 1)) * (row.year - 1969 + 0.5); },
	cy:     function(row) { return Math.ceil(300 / 12) * (11 - row.month + 0.5); },
	r:      function(row) {
		return row.count / 500 * 3;
	},
	stroke: function() { return 'white'; },
	fill:   function() { return 'blue'; }
});

var chart3 = make('svg', {width: 600, height: 300, 'class': 'my-chart'});
document.getElementById('chart3').appendChild(chart3);
plotAll(chart3, ukDriverFatalities, 'rect', {
	width:  rectWidth(600),
	height: rectHeight(300),
	x:      rectX(600),
	y:      rectY(300)
});
