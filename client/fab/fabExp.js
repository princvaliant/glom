Template.fabExp.rendered = function () {
    Session.set('tasksLoading', true);
    Meteor.call('getFabPerExperiment', function (error, datalist) {
        Session.set('tasksLoading', false);
        fabProcessing(datalist);
    });
};

Template.fabExp.helpers({
    tasksLoading: function () {
        return Session.get('tasksLoading');
    }
});

$('.nav-pills a').click(function (e) {
    console.log(e);
});

var chartDefs = [{
    id: 'chart1',
    title: 'LED Metal patterning depth',
    ytitle: 'Depths',
    ymax: 8,
    ymin: 5,
    yfields: ['metpat1', 'metpat3', 'metpat6']
}, {
    id: 'chart2',
    title: 'Jasper Metal patterning depth',
    ytitle: 'Depths',
    ymax: 8,
    ymin: 2,
    yfields: ['jmetpat1','jmetpat2']
}, {
    id: 'chart3',
    title: 'Isolation patterning',
    ytitle: 'Resist thickness',
    ymax: 25,
    ymin: 15,
    yfields: ['isopatcent', 'isopatod']
}, {
    id: 'chart4',
    title: 'LED Post metal liftoff',
    ytitle: 'Number of defects',
    yfields: ['pidefects1', 'pidefects2', 'pidefects3', 'pidefects4', 'pidefects5', 'pidefects6']
}, {
    id: 'chart5',
    title: 'Jasper Post metal liftoff',
    ytitle: 'Number of defects',
    yfields: ['jaspfv']
}
];

function fabProcessing (datalist) {

    _.each(chartDefs, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title,
                fontSize: 16
            },
            axisX: {
                title: "Exp#",
                titleFontSize: 14,
                labelFontSize: 11,
                labelAngle: -35

            },
            axisY: {
                title: chartDef.ytitle,
                titleFontSize: 14,
                labelFontSize: 11,
                lineThickness: 1,
                minimum: chartDef.ymin || null,
                maximum: chartDef.ymax || null
            },
            legend: {
                verticalAlign: 'bottom',
                horizontalAlign: "center",
                fontSize: 12,
                cursor: "pointer"
            },
            toolTip: {
                shared: true
            },
            data: []
        };

        if (chartDef.yfields) {
            _.each(chartDef.yfields, function (field) {
                var series = {
                    type: 'ohlc',
                    name: field,
                    showInLegend: true,
                    dataPoints: []
                };
                _.each(datalist, function (data) {
                    if (data._id && data[field] && data[field][0] !== null) {
                        series.dataPoints.push({
                            label: data._id,
                            y: data[field]
                        });
                    }
                });
                chart.data.push(series);
            });
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
}
