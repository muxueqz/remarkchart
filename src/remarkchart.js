function remarkchart() {
	var colors = {
		'butter' : createColor('#edd400', '#fce94f'),
		'orange' : createColor('#f57900', '#fcaf3e'),
		'chocolate' : createColor('#c17d11', '#e9b96e'),
		'chameleon' : createColor('#73d216', '#8ae234'),
		'skyblue' : createColor('#3465a4', '#729fcf'),
		'plum' : createColor('#75507b', '#ad7fa8'),
		'scarletred' : createColor('#cc0000', '#ef2929'),
		'aluminium' : createColor('#555753', '#888a85')
	};

	function hexToRGBA(hex, alpha) {
		var result = 'rgba(_r, _g, _b, _a)';
		result = result.replace('_r', parseInt(hex.substr(1, 2), 16));
		result = result.replace('_g', parseInt(hex.substr(3, 2), 16));
		result = result.replace('_b', parseInt(hex.substr(5, 2), 16));
		result = result.replace('_a', alpha);
		return result;
	}

	function createColor(color, highlight) {
		return {
			color : color,
			highlight : highlight,
			fillColor : hexToRGBA(color, 0.25),
			strokeColor : hexToRGBA(color, 1),
			pointColor : hexToRGBA(color, 1),
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : hexToRGBA(highlight, 1),
			highlightFill : hexToRGBA(highlight, 0.75),
			highlightStroke : hexToRGBA(highlight, 1),
		};
	}

	var defcolors = [colors.butter, colors.orange, colors.chocolate, colors.chameleon, colors.skyblue, colors.plum, colors.scarletred, colors.aluminium];

	function createDoughnut(tableDiv) {
		var table = $(tableDiv).find('table');
		var data = createChartDataFromTable(table);

		var canvas = $('<canvas>');
		canvas.appendTo(tableDiv);

		var ctx = canvas.get(0).getContext("2d");
		var myDoughnut = new Chart(ctx).Doughnut(data, {
			animation : false,
			responsive : true
		});
		table.hide();
	}

	function createPie(tableDiv) {
		var table = $(tableDiv).find('table');
		var data = createChartDataFromTable(table);

		var canvas = $('<canvas>');
		canvas.appendTo(tableDiv);

		var ctx = canvas.get(0).getContext("2d");
		var myDoughnut = new Chart(ctx).Pie(data, {
			animation : false,
			responsive : true
		});
		table.hide();
	}

	function createBar(tableDiv) {
		var table = $(tableDiv).find('table');
		var data = createChartDataFromTable2D(table);

		var canvas = $('<canvas>');
		canvas.appendTo(tableDiv);

		var ctx = canvas.get(0).getContext("2d");
		var myDoughnut = new Chart(ctx).Bar(data, {
			animation : false,
			responsive : true
		});
		table.hide();
	}

	function createLine(tableDiv) {
		var table = $(tableDiv).find('table');
		var data = createChartDataFromTable2D(table);

		var canvas = $('<canvas>');
		canvas.appendTo(tableDiv);

		var ctx = canvas.get(0).getContext("2d");
		var myDoughnut = new Chart(ctx).Line(data, {
			animation : false,
			responsive : true
		});
		table.hide();
	}

	function createRadar(tableDiv) {
		var table = $(tableDiv).find('table');
		var data = createChartDataFromTable2D(table);

		var canvas = $('<canvas>');
		canvas.appendTo(tableDiv);

		var ctx = canvas.get(0).getContext("2d");
		var myDoughnut = new Chart(ctx).Radar(data, {
			animation : false,
			responsive : true
		});
		table.hide();
	}

	function createPolarArea(tableDiv) {
		var table = $(tableDiv).find('table');
		var data = createChartDataFromTable(table);

		var canvas = $('<canvas>');
		canvas.appendTo(tableDiv);

		var ctx = canvas.get(0).getContext("2d");
		var myDoughnut = new Chart(ctx).PolarArea(data, {
			animation : false,
			responsive : true
		});
		table.hide();
	}

	function createChartDataFromTable(table) {
		var lines = readContentFromTable(table);
		var custcolors = readColorsFromTable(table);

		var data = [];
		for (var i = 0; i < lines[0].length; i++) {
			var chartelem = {
				value : parseFloat(lines[1][i]),
				label : lines[0][i]
			};
			$.extend(chartelem, custcolors[i]);
			data[i] = chartelem;
		}
		return data;
	}

	function createChartDataFromTable2D(table) {
		var lines = readContentFromTable(table);
		var custcolors = readColorsFromTable2D(table);

		var data = {
			labels : lines[0].slice(1),
			datasets : []
		};
		for (var i = 1; i < lines.length; i++) {
			var chartelem = {
				label : lines[i][0],
				data : []
			};
			$.extend(chartelem, custcolors[i - 1]);
			for (var x = 0; x < data.labels.length; x++) {
				chartelem.data[x] = parseFloat(lines[i][x + 1]);
			}
			data.datasets[i - 1] = chartelem;
		}
		return data;
	}

	function readContentFromTable(table) {
		var lines = [];
		table.find("tr").each(function(index, tr) {
			var line = $('th, td', tr).map(function(index, td) {
				return $(td).text();
			});
			lines[index] = line;
		});
		return lines;
	}

	function readColorsFromTable(table) {
		var customColors = defcolors.slice();

		table.find("th span").each(function(index, td) {
			$.each($(td).prop('class').split(' '), function(spanindex, myclass) {
				var c = colors[myclass];
				if ( typeof c !== "undefined") {
					customColors[index] = c;
					return false;
				}
			});
		});
		return customColors;
	}

	function readColorsFromTable2D(table) {
		var customColors = defcolors.slice();

		table.find('tbody tr td:first-child span').each(function(index, span) {
			$.each($(span).prop('class').split(' '), function(spanindex, myclass) {
				var c = colors[myclass];
				if ( typeof c !== "undefined") {
					customColors[index] = c;
					return false;
				}
			});
		});
		return customColors;
	}

	this.init = function(slideshow, options) {
		slideshow.on('afterShowSlide', function(slide) {
			initVisibleSlide();
		});
		initVisibleSlide();
	};

	function initVisibleSlide() {
		var anyChart = '.chart-doughnut, .chart-pie, .chart-bar, .chart-polararea, .chart-line, .chart-radar';
		$('.remark-visible').find(anyChart).each(function(index, tableDiv) {
			var jTableDiv = $(tableDiv);

			if (!jTableDiv.hasClass('chart-initialized')) {
				if (jTableDiv.hasClass('chart-doughnut')) {
					createDoughnut(jTableDiv);
				} else if (jTableDiv.hasClass('chart-pie')) {
					createPie(jTableDiv);
				} else if (jTableDiv.hasClass('chart-bar')) {
					createBar(jTableDiv);
				} else if (jTableDiv.hasClass('chart-polararea')) {
					createPolarArea(jTableDiv);
				} else if (jTableDiv.hasClass('chart-line')) {
					createLine(jTableDiv);
				} else if (jTableDiv.hasClass('chart-radar')) {
					createRadar(jTableDiv);
				}
				jTableDiv.toggleClass("chart-initialized", true);
			}
		});
	}
}

window.remarkchart = new remarkchart();
