var currentIndex = 0;
var tabIndex = 0;
var tabIndex2 = 0;
var colors = [
  '#4661EE',
  '#1BCDD1',
  '#8FAABB',
  '#B08BEB',
  '#3EA0DD',
  '#F5A52A',
  '#038FAA',
  '#FAA586',
  '#EB8CC6',
  '#EC5657'
];
var index = 1;

Template.konicaCharts.rendered = function () {

  Meteor.subscribe('konicaReport', function () {

    CanvasJS.addColorSet('customColorSet', colors);

    _.each(chartDefs, function (tab) {
      _.each(tab.tabs, function (chartDef) {
        var range = {};
        if (chartDef.r !== undefined) {
          range.min = chartDef.r[0];
          range.max = chartDef.r[1];
        }
        var chart = constructChart(chartDef.t, chartDef.t, chartDef.y, chartDef.x, range);
        var chartR = new CanvasJS.Chart('chartid' + index, chart);
        chart.legend.itemclick = function (e) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          chartR.render();
        };
        index += 1;
        chartR.render();
      });
    });
  });
};

Template.konicaCharts.helpers({
  chartDefs: function () {
    return chartDefs;
  },
  listIndex: function () {
    return currentIndex += 1;
  },
  tabIndex: function () {
    return tabIndex += 1;
  },
  tabIndex2: function () {
    return tabIndex2 += 1;
  },
  tabIndexFirst: function () {
    return tabIndex === 0 ? 'active' : '';
  },
  tabIndex2First: function () {
    return tabIndex2 === 0 ? 'active' : '';
  }
});

function constructChart(title, ytitle, yfield, xfield, range) {

  var chart = {
    height: 400,
    width: 1000,
    colorSet: 'customColorSet',
    title: {
      text: title,
      fontSize: 16
    },
    animationEnabled: false,
    axisX: {
      title: xfield,
      titleFontSize: 14,
      labelFontSize: 11,
      labelAngle: -35,
      interval: 2

    },
    axisY: {
      title: ytitle,
      titleFontSize: 14,
      labelFontSize: 11,
      gridThickness: 1
    },
    legend: {
      verticalAlign: 'bottom',
      horizontalAlign: "center",
      fontSize: 12,
      cursor: "pointer"
    },
    data: []
  };

  if (range.min) {
    chart.axisY.minimum = range.min;
    chart.axisY.maximum = range.max;
  }

  var sort = {};
  sort[xfield] = 1;
  var datalist = KonicaReport.find({}, {
    sort: sort
  }).fetch();

  var counter = 0;
  var counter2 = 0;
  if (!_.isArray(yfield)) {
    var xgroup = _.groupBy(datalist, function (data) {
      return data[xfield];
    });
    for (var bd in xgroup) {
      _.each(xgroup[bd], doseries);
      counter++;
      counter2++;
      if (counter > 9) counter = 0;
    }
  } else {
    _.each(yfield, doseries2);
  }

  function doseries(row) {

    var series = {
      type: 'scatter',
      color: colors[counter],
      markerSize: 3,
      toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Build date</strong> {label} <br/><strong> Value</strong></span> {y}<br/>",
      name: bd,
      showInLegend: false,
      dataPoints: []
    };
    series.dataPoints.push({
      x: counter2,
      y: row[yfield],
      label: bd
    });
    chart.data.push(series);
  }

  function doseries2(y) {

    chart.axisX.interval = 100;
    var series = {
      type: 'line',
      color: colors[counter],
      markerSize: 3,
      toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Build date</strong> {bd} <br/><strong>Value</strong></span> {y}<br/><strong> " + xfield + "</strong></span> {x}",
      name: y,
      showInLegend: true,
      dataPoints: []
    };
    _.each(datalist, function (row) {
      if (row[xfield] !== undefined && row[y] !== undefined) {
        series.dataPoints.push({
          x: row[xfield],
          y: row[y],
          label: row[xfield],
          bd: row.build_date
        });
      }
    });

    counter++;
    if (counter > 9) counter = 0;

    chart.data.push(series);
  }

  return chart;
}
