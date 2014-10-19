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

	var defcolors = [colors.butter, colors.orange, colors.chocolate, colors.chameleon, colors.skyblue, colors.plum, colors.scarletred, colors.aluminium];

	var isMobile = {
		Android : function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry : function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS : function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera : function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows : function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any : function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
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

	function createChart(tableDiv, chartType) {
		var table = $(tableDiv).find('table');

		// Use the existing canvas on preview area if it exists.
		var canvas = $(tableDiv).find('canvas:first');
		if (canvas.length === 0) {
			canvas = $('<canvas>');
			canvas.appendTo(tableDiv);
		}

		var ctx = canvas.get(0).getContext("2d");

		var chart;
		var data;
		switch(chartType) {
		case 'chart-doughnut':
			data = createChartDataFromTable(table);
			chart = new Chart(ctx).Doughnut(data);
			break;
		case 'chart-pie':
			data = createChartDataFromTable(table);
			chart = new Chart(ctx).Pie(data);
			break;
		case 'chart-bar':
			data = createChartDataFromTable2D(table);
			chart = new Chart(ctx).Bar(data);
			break;
		case 'chart-line':
			data = createChartDataFromTable2D(table);
			chart = new Chart(ctx).Line(data);
			break;
		case 'chart-radar':
			data = createChartDataFromTable2D(table);
			chart = new Chart(ctx).Radar(data);
			break;
		case 'chart-polararea':
			data = createChartDataFromTable(table);
			chart = new Chart(ctx).PolarArea(data);
			break;
		}

		table.hide();
		$(tableDiv).data('chart', chart);
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
		setGlobalConfig();
		slideshow.on('afterShowSlide', function(slide) {
			initVisibleSlide();
		});
		initVisibleSlide();
	};

	function setGlobalConfig() {
		var globalConfig = {
			showTooltips : !isMobile.any(),
			animation : false,
			responsive : true
		};
		$.extend(Chart.defaults.global, globalConfig);
	}

	function getChartType(element) {
		var chartTypes = ['chart-doughnut', 'chart-pie', 'chart-bar', 'chart-polararea', 'chart-line', 'chart-radar'];
		var classList = $(element).attr('class').split(/\s+/);

		for (var i = 0; i < classList.length; i++) {
			if (chartTypes.indexOf(classList[i]) != -1) {
				return classList[i];
			}
		}
	}

	function initVisibleSlide() {
		var visibleSlides = '.remark-visible, .remark-presenter-mode .remark-preview-area';
		var anyChart = '.chart-doughnut, .chart-pie, .chart-bar, .chart-polararea, .chart-line, .chart-radar';
		$(visibleSlides).find(anyChart).each(function(index, tableDiv) {
			var jTableDiv = $(tableDiv);

			if (!jTableDiv.hasClass('chart-initialized')) {
				var chartType = getChartType(tableDiv);
				createChart(tableDiv, chartType);
				jTableDiv.toggleClass("chart-initialized", true);
			}

		});

		$('.remark-presenter-mode .remark-preview-area').find(anyChart).each(function(index, tableDiv) {
			// Seems the preview area is a copy of the slide dom tree which might have the chart canvas
			// and 'chart-initialized' class, but never the javascript to draw the chart.
			// Thus the chart always has to be recreated here.
			var chartType = getChartType(tableDiv);
			createChart(tableDiv, chartType);
		});
	}

}

window.remarkchart = new remarkchart();
