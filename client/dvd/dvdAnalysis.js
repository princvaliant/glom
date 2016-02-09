var chartDefs = [{
  id: 'chart1',
  title: 'Top 20 EQE per wafer for current density 0.15A/cm2',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  niDotField: 'PeakEQE',
  currentDensity: {
    MASK28: '.43',
    MASK29: '.15'
  },
  range: {
    min: 0.0,
    max: 18.0
  }
}, {
  id: 'chart2',
  title: 'Top 20 EQE per wafer for any current',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  niDotField: 'PeakEQE',
  range: {
    min: 0.0,
    max: 18.0
  }
}, {
  id: 'chart3',
  title: 'Dominant wavelength for top 20 EQE per wafer for any current',
  ytitle: 'Dominant wavelength [nm]',
  yfield: 'domwl',
  range: {
    min: 450,
    max: 630
  }
}, {
  id: 'chart4',
  title: 'Peak wavelength for top 20 EQE per wafer for any current',
  ytitle: 'Peak wavelength [nm]',
  yfield: 'peakwl',
  niDotField: 'peak1',
  range: {
    min: 450,
    max: 630
  }
}, {
  id: 'chart5',
  title: 'Voltage for top 20 EQE per wafer for any current',
  ytitle: 'Voltage [V]',
  yfield: 'volt',
  niDotField: 'v1',
  range: {
    min: 0.0,
    max: 10.0
  }
}];


Template.dvdAnalysis.rendered = function() {
  Session.set('tasksLoading', true);
  Meteor.call('getDvd', function(error, datalist) {
      Meteor.call('getNiDot', function(error, niDots) {
        _.each(chartDefs, function(chartDef) {
          var chart;
          chart = constructChart(datalist, niDots, chartDef.title, chartDef.ytitle, chartDef.yfield, chartDef.range, chartDef.currentDensity, chartDef.niDotField);
          var chartR = new CanvasJS.Chart(chartDef.id, chart);
          Session.set('tasksLoading', false);
          chart.legend.itemclick = function(e) {
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            chartR.render();
          };
          chartR.render();
        });
    });
  });
};

Template.dvdAnalysis.helpers({
  chartDefs: function() {
    return chartDefs;
  },
  tasksLoading: function() {
    return Session.get('tasksLoading');
  }
});

function constructChart(datalist, niDots, title, ytitle, yfield, range, currDensity, niDotField) {

  var chart = {
    title: {
      text: title,
      fontSize: 16
    },
    animationEnabled: false,
    animationDuration: 700,
    axisX: {
      title: "Exp# - Wafer#",
      titleFontSize: 14,
      labelFontSize: 11,
      labelAngle: -35,
      interval: 1

    },
    axisY: {
      title: ytitle,
      titleFontSize: 14,
      labelFontSize: 11,
      minimum: range.min,
      maximum: range.max,
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

  var exps = _.groupBy(datalist, function(waferData) {
    return waferData.id.exp;
  });

  var counter = 1;
  for (var exp in exps) {

    _.each(exps[exp], function(waferObj) {

      var series = {
        type: 'scatter',
        markerSize: 2,
        toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Mask</strong> {mask} <br/><strong> Value</strong></span> {y}<br/><strong> Current</strong></span> {current} nA",
        name: exp,
        showInLegend: false,
        dataPoints: []
      };

      var nidot = _.filter(niDots, function(o) {
        return o.code === waferObj.id.wid;
      });
      var series2 = {};
      if (nidot.length === 1 && niDotField) {
        var ndv = nidot[0].value.ni_dot_test[niDotField];
        series2 = {
          type: 'scatter',
          markerType: "triangle",
          markerSize: 9,
          toolTipContent: "<span style='\"'color: {color};'\"'><strong>Ni Dot Peak EQE</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Value</strong></span> {y}<br/>",
          name: waferObj.id.wid,
          showInLegend: false,
          dataPoints: [{
            x: counter,
            y: ndv,
            label: exp + '-' + waferObj.id.wid
          }]
        };
      }

      var peakwl = 0;
      var qtywl = 0;
      _.each(waferObj.data, function(dataObj) {
        if (dataObj.peakwl > 400 && dataObj.peakwl < 700) {
          peakwl += dataObj.peakwl;
          qtywl += 1;
          //       console.log(waferObj.id.wid + ' ' + dataObj.cs);
          if (currDensity === undefined || currDensity[dataObj.mask].localeCompare(dataObj.cs) === 0) {
            series.dataPoints.push({
              x: counter,
              y: dataObj[yfield],
              label: exp + '-' + waferObj.id.wid,
              current: (dataObj.cv * 1000000).toFixed(0),
              mask: dataObj.mask
            });
          }
        }
      });
      peakwl = peakwl / qtywl;
      series.color = '#444444';
      if (peakwl >= 450 && peakwl <= 480) {
        series.color = '#0000FF';
      } else if (peakwl >= 500 && peakwl <= 540) {
        series.color = '#00FF00';
      } else if (peakwl >= 600 && peakwl <= 630) {
        series.color = '#FF0000';
      }
      series2.color = series.color;

      series.dataPoints = series.dataPoints.slice(0, 20);
      counter++;
      chart.data.push(series);
      chart.data.push(series2);
    });
  }
  return chart;
}
