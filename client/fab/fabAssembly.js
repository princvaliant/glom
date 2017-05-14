Template.fabAssembly.rendered = function () {
    Session.set('tasksLoading', true);
    // Get data from epifab process
    Meteor.call('getEpifabData', function (error, datalist) {
        Session.set('tasksLoading', false);
        processingEpifab(datalist);
    });
    // // Get data from epifab process
    Meteor.call('getFabassemblyData', function (error, datalist) {
        Session.set('tasksLoading', false);
        processingFabAssembly(datalist);
    });
    // Meteor.call('getFabassemblyDataPerExperiment', function (error, datalist) {
    //     Session.set('tasksLoading', false);
    //     processingFabassemblyPerExperiment(datalist);
    // });
};


Template.fabAssembly.helpers({
    tasksLoading: function () {
        return Session.get('tasksLoading');
    }
});

function processingEpifab (datalist) {

    var colors = ['#369EAD', '#C24642'];
    var markers = ['square', 'triangle'];

    _.each(AssemblyChartDefs.epifab, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
                fontSize: 16
            },
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
        _.each(chartDef.yfields, function (field, i) {
            chart.data.push({
                type: 'scatter',
                name: field.split('.')[1],
                showInLegend: true,
                color: AssemblyChartDefs.colors[i],
                risingColor: AssemblyChartDefs.colors[i],
                markerSize: 6,
                toolTipContent: "<span style=\"color: {color};\"><strong>{label}</strong></span><br/><strong> Wafer type</strong> {product} <br/><strong> Param</strong> {parm} <br/><strong> Value</strong> {y}<br/><strong> Date</strong> {x} <br/></span>",
                dataPoints: getEpifabData(datalist, field)
            });
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

function getEpifabData (data, field) {
    var result = [];
    _.each(data, function(itm) {
        var val = getDescendantProp(itm, field);
        var date = getDescendantProp(itm, field.split('.')[0] + '.actualStart');
        if (val !== undefined && date &&  itm.expId) {
            result.push({
                y: val,
                x: moment(date).startOf('day').toDate(),
                label: itm.expId + ' ' + itm.code,
                product: itm.prod,
                parm: field.split('.')[1]
            });
        }
    });
    return _.sortBy(result, function(itm) {
        return itm.date;
    });
}

function processingFabAssembly (datalist) {

    var colors = ['#369EAD', '#C24642'];
    var markers = ['square', 'triangle'];

    _.each(AssemblyChartDefs.fabassembly, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
                fontSize: 16
            },
            axisX: {
                title: "Exp#",
                titleFontSize: 14,
                labelFontSize: 11,
                interval: 2,
                valueFormatString: 'YYYY-MM-DD',
                intervalType: 'day',
                labelAngle: -35

            },
            axisY:{
                title: "chartDef.title",
                titleFontSize: 16
            },
            legend: {
                verticalAlign: 'bottom',
                horizontalAlign: "center",
                fontSize: 12,
                cursor: "pointer"
            },
            data: []
        };
        _.each(chartDef.yfields, function (field, i) {
            chart.data.push({
                type: 'scatter',
                name: field.split('.')[1],
                showInLegend: true,
                color: AssemblyChartDefs.colors[i],
                risingColor: AssemblyChartDefs.colors[i],
                markerSize: 6,
                toolTipContent: "<span style=\"color: {color};\"><strong>{label}</strong></span><br/><strong> Coupon type</strong> {product} <br/><strong> Param</strong> {parm} <br/><strong> Value</strong> {y}<br/><strong> Date</strong> {date} {x}<br/></span>",
                dataPoints: getFabassemblyData(datalist, field)
            });
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

function getFabassemblyData (data, field) {
    var result = [];
    var mp = {};
    var i = 1;
    _.each(data, function(itm) {
        var val = getDescendantProp(itm, field);
        var date = getDescendantProp(itm, field.split('.')[0] + '.actualStart');
        if (val !== undefined && date ) {
            var l = itm.expId + ' ' + itm.code.split('_')[0];
            if (mp[l] === undefined) {
                mp[l] = i;
                i += 1;
            }
            result.push({
                y: val,
                x: mp[l],
                date: moment(date).startOf('day').toDate(),
                label: l,
                product: itm.prod,
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


function processingAveragePerExperiment (datalist) {
    _.each(AssemblyChartDefs.fabLedAvgPerExperiment, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
                fontSize: 16
            },
            animationEnabled: true,
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
