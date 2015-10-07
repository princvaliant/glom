var chartDefs = [{
  id: 'chart1',
  title: 'Top 20 EQE per wafer for current density 0.15A/cm2',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  currentDensity: {
    MASK28: '.43',
    MASK29: '.15'
  },
  range: {
    min: 0.0,
    max: 15.0
  }
}, {
  id: 'chart2',
  title: 'Top 20 EQE per wafer for any current',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  range: {
    min: 0.0,
    max: 15.0
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
  range: {
    min: 450,
    max: 630
  }
}, {
  id: 'chart5',
  title: 'Voltage for top 20 EQE per wafer for any current',
  ytitle: 'Voltage [V]',
  yfield: 'volt',
  range: {
    min: 0.0,
    max: 10.0
  }
}];

Tracker.autorun(function () {
  Meteor.subscribe('dvd');
});

Template.dvdAnalysis.rendered = function () {
  this.autorun(function () {

    var datalist = Dvd.find({}, {
      sort: {
        'id.exp': 1,
        'id.wid': 1
      }
    }).fetch();

    _.each(chartDefs, function (chartDef) {
      var chart = constructChart(datalist, chartDef.title, chartDef.ytitle, chartDef.yfield, chartDef.range, chartDef.currentDensity);
      var chartR = new CanvasJS.Chart(chartDef.id, chart);
      chart.legend.itemclick = function (e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chartR.render();
      };
      chartR.render();
    });
  });
};

Template.dvdAnalysis.helpers({
  chartDefs: function () {
    return chartDefs;
  }
});

function constructChart(datalist, title, ytitle, yfield, range, currDensity) {

  var chart = {
    title: {
      text: title,
      fontSize: 16
    },
    animationEnabled: true,
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


  var exps = _.groupBy(datalist, function (waferData) {
    return waferData.id.exp;
  });

  var counter = 1;
  for (var exp in exps) {

    _.each(exps[exp], function (waferObj) {

      var series = {
        type: 'scatter',
        markerSize: 3,
        toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Mask</strong> {mask} <br/><strong> Value</strong></span> {y}<br/><strong> Current</strong></span> {current} nA",
        name: exp,
        showInLegend: false,
        dataPoints: []
      };

      var peakwl  = 0;
      _.each(waferObj.data, function (dataObj) {
        peakwl += dataObj.peakwl;
        if (currDensity === undefined || currDensity[dataObj.mask].localeCompare(dataObj.cs) === 0) {
          series.dataPoints.push({
            x: counter,
            y: dataObj[yfield],
            label: exp + '-' + waferObj.id.wid,
            current: (dataObj.cv * 1000000).toFixed(0),
            mask: dataObj.mask
          });
        }
      });
      peakwl = peakwl/waferObj.data.length;

      series.color = '#444444';
      if (peakwl >= 450 && peakwl <= 480) {
        series.color = '#0000FF';
      } else if (peakwl >= 500 && peakwl <= 540) {
        series.color = '#00FF00';
      } else if (peakwl >= 600 && peakwl <= 630) {
        series.color = '#FF0000';
      }

      series.dataPoints = series.dataPoints.slice(0, 20);
      counter++;
      chart.data.push(series);
    });


  }

  return chart;
}
