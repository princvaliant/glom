Template.fabLed.rendered = function () {
    Session.set('tasksLoading', true);
    Meteor.call('getFab', function (error, datalist) {
        Session.set('tasksLoading', false);
        fabProcessing(datalist);
    });
    Meteor.call('getFabLedAveragePerExperiment', function (error, datalist) {
        Session.set('tasksLoading', false);
        fabProcessingAveragePerExperiment(datalist);
    });
};

Template.fabLed.helpers({
    tasksLoading: function () {
        return Session.get('tasksLoading');
    }
});

$('.nav-pills a').click(function (e) {
    console.log(e);
});


function fabProcessing (datalist) {

    var colors = ['#369EAD', '#C24642'];
    var markers = ['square', 'triangle'];

    _.each(FabChartDefs.fabLed, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
                fontSize: 16
            },
            axisY2: [],
            axisX: {
                title: "Exp#",
                titleFontSize: 14,
                labelFontSize: 11,
                interval: 2,
                valueFormatString: 'YYYY-MM-DD',
                intervalType: 'day',
                labelAngle: -35

            },
            legend: {
                verticalAlign: 'bottom',
                horizontalAlign: "center",
                fontSize: 12,
                cursor: "pointer"
            },
            data: []
        };

        if (!chartDef.seriesFilter) {
            chartDef.seriesFilter = [{name: ''}];
        }

        _.each(chartDef.yfields, function (field, i) {
            chart.axisY2.push({
                title: field.split('.')[1],
                titleFontSize: 12,
                labelFontSize: 11,
                lineColor: FabChartDefs.colors[i],
                minimum: chartDef.ymin || null,
                maximum: chartDef.ymax || null
            });

            var series = {
                type: 'scatter',
                axisYType: 'secondary',
                axisYIndex: i,
                showInLegend: true,
                color: FabChartDefs.colors[i],
                risingColor: FabChartDefs.colors[i],
//                markerType: markers[i],
                markerSize: 6,
                toolTipContent: "<span style=\"color: {color};\"><strong>{label}</strong></span><br/><strong> Wafer</strong> {code} <br/><strong> Param</strong> {parm} <br/><strong> Value</strong> {y}<br/><strong> Date</strong> {x} <br/></span>",
                dataPoints: []
            };

            _.each(chartDef.seriesFilter, function (filter) {
                series.name = _.values(filter)[0] || '';
                series.dataPoints = _.union(series.dataPoints, processData(datalist, filter, field));
            });
            chart.data.push(series);
        });

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
}

function processData (data, filter, field) {
    var result = [];
    var filtered = data;
    var f = _.values(filter)[0];
    var k = _.keys(filter)[0];
    if (f) {
        filtered = _.filter(data, function(itm) {
           var val = getDescendantProp(itm, k);
           if (val === undefined || val !== f)
               return false;
           else
               return true;
        });
    }
    _.each(filtered, function(itm) {
        var val = getDescendantProp(itm, field);
        var date = getDescendantProp(itm, field.split('.')[0] + '.actualStart');
        if (val !== undefined && date &&  itm.expId) {
            result.push({
                y: val,
                x: moment(date).startOf('day').toDate(),
                label: itm.expId,
                code: itm.code,
                parm: field.split('.')[1]
            });
        }
    });
    return _.sortBy(result, function(itm) {
        return itm.date;
    });
}

function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}


function fabProcessingAveragePerExperiment (datalist) {
    _.each(FabChartDefs.fabLedAvgPerExperiment, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
                fontSize: 16
            },
            animationEnabled: false,
            animationDuration: 700,
            axisX: {
                title: "Exp#",
                titleFontSize: 14,
                labelFontSize: 11,
                labelAngle: -35,
                interval: 1,
                minimum: 0,
                maximum: datalist.length

            },
            axisY: {
                title: chartDef.ytitle,
                titleFontSize: 14,
                labelFontSize: 11,
                //  minimum: range.min,
                //  maximum: range.max,
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

        var series = {
            type: 'scatter',
            markerSize: 6,
            toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong>{label}</strong></span><br/><strong> Value</strong> {y}</span>",
            name: chartDef.yfields[0],
            showInLegend: false,
            dataPoints: []
        };

        var counter = 0;
        _.each(datalist, function (expObj) {
            counter += 1;
            if (expObj[chartDef.yfields[0]]) {
                 series.dataPoints.push({
                    x: counter,
                    y: expObj[chartDef.yfields[0]],
                    label: expObj._id
                });
            }
        });
        chart.data.push(series);

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
}
