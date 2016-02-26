Template.couponYield.rendered = function() {
  Session.set('tasksLoading', true);
  Meteor.call('getCoupons', function(error, datalist) {
    Session.set('tasksLoading', false);
    couponYield(datalist);
  });
};

Template.couponYield.helpers({
  tasksLoading: function() {
    return Session.get('tasksLoading');
  }
});

function couponYield(datalist) {

    var wafergroup = _.groupBy(datalist, function(o){
      return (o.exp || '') + '-' + o.c.split('_')[0];
    });
    var pass = [];
    for (var key in wafergroup) {
      var list = wafergroup[key];
      var obj = {label: key, pbp: 0, pbpt: 0, pi: 0, pass: 0};
      _.each(list, function(o) {
        if (o.pbp) {
          obj.pbp += 1;
        } else
        if (o.pbpt) {
          obj.pbpt += 1;
        } else
        if (o.pi) {
          obj.pi += 1;
        } else
        if (!o.pbp && !o.pbpt && !o.pi) {
          obj.pass += 1;
        }
      });
      pass.push(obj);
    }
    constructChart(_.sortBy(pass, 'label'));
}


function constructChart(list) {
 var chart = new CanvasJS.Chart("chartCY1",
    {
      title:{
      text: "Coupon yield"
      },
      axisY:{
        title:"Coupons",
        titleFontSize: 14,
        labelFontSize: 11,
        gridThickness: 1
      },
      axisX: {
        title: "Exp# - Wafer#",
        titleFontSize: 14,
        labelFontSize: 11,
        labelAngle: -35,
        interval: 1
      },
      animationEnabled: true,
      data: [
      {
        type: "stackedColumn",
        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y}",
        name: "PASS",
        showInLegend: "true",
        dataPoints: pick(list, 'pass')
      },  {
        type: "stackedColumn",
        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y}",
        name: "Post bond pad",
        showInLegend: "true",
        dataPoints: pick(list, 'pbp')
      }, {
        type: "stackedColumn",
        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y}",
        name: "Post bond pad test",
        showInLegend: "true",
        dataPoints: pick(list, 'pbpt')
      }, {
        type: "stackedColumn",
        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y}",
        name: "Post isolation",
        showInLegend: "true",
        dataPoints: pick(list, 'pi')
      }],
      legend:{
        cursor:"pointer",
        itemclick: function(e) {
          if (typeof (e.dataSeries.visible) ===  "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          }
          else
          {
            e.dataSeries.visible = true;
          }
          chart.render();
        }
      }
    });

    chart.render();
}

function pick(pass, field) {
  var ret = _.map(pass, function(obj, key){
    return {label: obj.label, y: obj[field]};
  });
  return ret;
}
