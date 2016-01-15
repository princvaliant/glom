var chartDefs = [{
  id: 'chart1',
  title: 'Top 20 EQE per wafer for any current trend',
  ytitle: 'EQE [%]',
  yfield: 'eqe',
  range: {
    min: 0.0,
    max: 18.0
  }
}];

Template.dvdTrends.rendered = function() {
  Meteor.call('getDvd', function(error, datalist) {
    _.each(chartDefs, function(chartDef) {
      chart = constructChart(datalist, chartDef.title, chartDef.ytitle, chartDef.yfield, chartDef.range, chartDef.currentDensity);
      var chartR = new CanvasJS.Chart(chartDef.id, chart);
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
};

Template.dvdTrends.helpers({
  chartDefs: function() {
    return chartDefs;
  }
});


function constructChart(datalist, title, ytitle, yfield, range, currDensity) {

  var chart = {
    title: {
      text: title,
      fontSize: 16
    },
    animationEnabled: false,
    animationDuration: 700,
    axisX: {
      title: "Date",
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


  var dates = _.groupBy(datalist, function(waferData) {
    return waferData.date;
  });

  var counter = 1;
  for (var date in dates) {

    _.each(dates[date], function(waferObj) {

      var series = {
        type: 'scatter',
        markerSize: 3,
        toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Mask</strong> {mask} <br/><strong> Value</strong></span> {y}<br/><strong> Current</strong></span> {current} nA",
        name: date,
        showInLegend: false,
        dataPoints: []
      };

      var peakwl = 0;
      _.each(waferObj.data, function(dataObj) {
        peakwl += dataObj.peakwl;
        if (currDensity === undefined || currDensity[dataObj.mask].localeCompare(dataObj.cs) === 0) {
          series.dataPoints.push({
            x: counter,
            y: dataObj[yfield],
            label: moment(date).format('YYYY-MM-DD'),
            current: (dataObj.cv * 1000000).toFixed(0),
            mask: dataObj.mask
          });
        }
      });
      peakwl = peakwl / waferObj.data.length;

      series.color = '#444444';
      if (peakwl >= 450 && peakwl <= 480) {
        series.color = '#0000FF';
      } else if (peakwl >= 500 && peakwl <= 540) {
        series.color = '#00FF00';
      } else if (peakwl >= 600 && peakwl <= 630) {
        series.color = '#FF0000';
      }

      if (series.color !== '#FF0000') {
        series.dataPoints = series.dataPoints.slice(0, 20);
        counter++;
        chart.data.push(series);
      }
    });
  }

  return chart;
}
