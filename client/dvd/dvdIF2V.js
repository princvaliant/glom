Template.dvdIF2V.rendered = function() {
  Session.set('tasksLoading', true);
  Meteor.call('getDvdNoData', function(error, datalist) {
    If2vChart(datalist);
  });
};

Template.dvdIF2V.helpers({
  tasksLoading: function() {
    return Session.get('tasksLoading');
  }
});

function If2vChart(datalist) {

  var chartDef = {
    title: 'Current at 2 volts',
    ytitle: 'Current [mA]',
    yfields: ['iavg', 'istd'],
    range: {
      min: 0.0,
      max: 0.01
    }
  };

  Meteor.call('getIf2v', function(error, if2vs) {
    var chart;
    chart = constructChart(datalist, if2vs, chartDef.title, chartDef.ytitle, chartDef.yfields, chartDef.range);
    var chartR = new CanvasJS.Chart('chartTrend1', chart);
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
}

function constructChart(datalist, if2vs, title, ytitle, yfields) {

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
      title: 'Avg current at 2V',
      titleFontSize: 14,
      labelFontSize: 11,
      minimum: -6,
      maximum: 0,
      gridThickness: 1
    },
    axisY2: {
      title: 'Standard deviation',
      titleFontSize: 14,
      labelFontSize: 11,
      minimum: -3,
      maximum: 1,
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

  var counter = 1;
  var series = {};
  for (var dobj in datalist) {
    var waferObj = datalist[dobj];
    var if2v = _.filter(if2vs, function(o) {
      return o._id === waferObj.id.wid;
    });
    if (if2v.length === 1) {
      _.each(yfields, function(s) {
        if (!series[s]) {
          series[s] = {
            type: 'scatter',
            color: s == 'iavg' ? 'black' : 'orange',
            markerSize: 5,
            toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Value</strong></span> 10 exp {y} mA<br/><strong> ",
            name: s,
            showInLegend: true,
            dataPoints: []
          };
          if (s === 'istd') {
            series[s].axisYType = 'secondary';
          }
          chart.data.push( series[s]);
        }

        var y = if2v[0][s];
        if (y !== 0) {
          y = Math.log10(y);
        }

        series[s].dataPoints.push({
          x: counter,
          y: y,
          label: waferObj.id.exp + '-' + waferObj.id.wid
        });
      });
      counter++;
    }
  }
  return chart;
}
