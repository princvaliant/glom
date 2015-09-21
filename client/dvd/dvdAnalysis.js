var chartDefs = [{
  id: 'chart1',
  title: 'Top 20 EQE per wafer for current density 0.15A/cm2',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  currentDensity: {
    MASK28: '.43',
    MASK29: '.15'
  },
  range : {
    min: 0,
    max : 20
  }
}, {
  id: 'chart2',
  title: 'Top 20 EQE per wafer for any current',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  range : {
    min: 0,
    max : 20
  }
}, {
  id: 'chart3',
  title: 'Dominant wavelength for top 20 EQE per wafer for any current',
  ytitle: 'Dominant wavelength [nm]',
  yfield: 'domwl',
  range : {
    min: 470,
    max : 600
  }
}, {
  id: 'chart4',
  title: 'Voltage for top 20 EQE per wafer for any current',
  ytitle: 'Voltage [V]',
  yfield: 'volt',
  range : {
    min: 0,
    max : 10
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
    animationDuration: 4000,
    axisX: {
      title: "Wafer#",
      titleFontSize: 14,
      labelFontSize: 11,
      labelAngle: -12,
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

    var series = {
      type: 'scatter',
      //    color: '#EE33EE',
      markerSize: 3,
      toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Mask</strong> {mask} <br/><strong> Value</strong></span> {y}<br/><strong> Current</strong></span> {current} nA",
      name: exp,
      showInLegend: true,
      dataPoints: []
    };

    _.each(exps[exp], function (waferObj) {

      for (var i = 0; i < 20; i++) {
        var dataObj = waferObj.data[i];
        if (dataObj !== undefined) {
          if (currDensity === undefined || currDensity[dataObj.mask] === dataObj.cs) {
            series.dataPoints.push({
              x: counter,
              y: dataObj[yfield],
              label: waferObj.id.wid,
              current: (dataObj.cv * 1000000).toFixed(0),
              mask: dataObj.mask
            });
          }
        }
      }
      counter++;
    });

    chart.data.push(series);
  }

  return chart;
}
