Template.assembly.rendered = function () {
    Session.set('tasksLoading', true);
    Meteor.call('getAssembly', function (error, datalist) {
        Session.set('tasksLoading', false);
        assemblyProcessing(datalist);
    });
};

Template.assembly.helpers({
    tasksLoading: function () {
        return Session.get('tasksLoading');
    }
});

var chartDefs = [{
    id: 'chart1',
    title: 'Pattern depth',
    ytitles: ['Depth 1', 'Depth 3', 'Depth 6'],
    ymax: 8,
    ymin: 5,
    yfields: ['metpat.pattern_depth1', 'metpat.pattern_depth3', 'metpat.pattern_depth6']
}, {
    id: 'chart2',
    title: 'Mesa height',
    ymax: 3,
    ymin: 0,
    ytitles: ['Mesa height 1', 'Mesa height 3', 'Mesa height 6'],
    yfields: ['mesaetchpr.mesa_height_1', 'mesaetchpr.mesa_height_3', 'mesaetchpr.mesa_height_6']
}];

function assemblyProcessing (datalist) {

    _.each(chartDefs, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
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
                title: chartDef.title,
                titleFontSize: 14,
                labelFontSize: 11,
                gridThickness: 1,
                minimum: chartDef.ymin,
                maximum: chartDef.ymax
            },
            legend: {
                verticalAlign: 'bottom',
                horizontalAlign: "center",
                fontSize: 12,
                cursor: "pointer"
            },
            data: []
        };

        for (var i = 0; i < 3; i++) {
            var series = {
                type: 'scatter',
                markerSize: 5,
                toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {label} <br/><strong> Value</strong></span> {y}<br/>",
                name: chartDef.ytitles[i],
                showInLegend: true,
                dataPoints: []
            };

            var fields = chartDef.yfields[i].split('.');
            _.each(datalist, function (data) {
                series.dataPoints.push({
                    y: data[fields[0]] ? data[fields[0]][fields[1]] : null,
                    label: data.expId + ' ' + data.code
                });
            });
            chart.data.push(series);
        }


        var c = new CanvasJS.Chart(chartDef.id, chart);
        c.render();
        chart.legend.itemclick = function (e) {
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            c.render();
        };
    });
    Session.set('tasksLoading', false);

    //
    // var group= _.groupBy(datalist, function(o){
    //   return o.expId || o.code;
    // });
    // var pass = [];
    // for (var key in wafergroup) {
    //   var list = wafergroup[key];
    //   var obj = {label: key, pbp: 0, pbpt: 0, pi: 0, pass: 0};
    //   _.each(list, function(o) {
    //     if (o.pbp) {
    //       obj.pbp += 1;
    //     } else
    //     if (o.pbpt) {
    //       obj.pbpt += 1;
    //     } else
    //     if (o.pi) {
    //       obj.pi += 1;
    //     } else
    //     if (!o.pbp && !o.pbpt && !o.pi) {
    //       obj.pass += 1;
    //     }
    //   });
    //   pass.push(obj);
    // }
    // constructChart(_.sortBy(pass, 'label'));
}


function constructChart (list) {
    var chart = new CanvasJS.Chart("chartCY1",
        {
            title: {
                text: "Coupon yield"
            },
            axisY: {
                title: "Coupons",
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
                }, {
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
            legend: {
                cursor: "pointer",
                itemclick: function (e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    }
                    else {
                        e.dataSeries.visible = true;
                    }
                    chart.render();
                }
            }
        });

    chart.render();
}

function pick (pass, field) {
    var ret = _.map(pass, function (obj, key) {
        return {label: obj.label, y: obj[field]};
    });
    return ret;
}
