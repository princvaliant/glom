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

$('.nav-pills a').click(function (e) {
    console.log(e);
});

var chartDefs = [{
    id: 'chart1',
    title: 'ITO Mesa patterning',
    // ymax: 3,
    // ymin: 0,
    ytitles: ['Resist thickness'],
    yfields: ['itomesa.resist_thickness']
}, {
    id: 'chart2',
    title: 'Mesa height',
    ymax: 3,
    ymin: 0,
    ytitles: ['Mesa height 1', 'Mesa height 3', 'Mesa height 6'],
    yfields: ['mesaetchpr.mesa_height_1', 'mesaetchpr.mesa_height_3', 'mesaetchpr.mesa_height_6']
}, {
    id: 'chart3',
    title: 'ITO pad size',
    // ymax: 3,
    // ymin: 0,
    ytitles: ['ITO min pad size', 'ITO max pad size'],
    yfields: ['mesaetchpr.ito_pad_size_min', 'mesaetchpr.ito_pad_size_max']
}, {
    id: 'chart4',
    title: 'ITO ALD PR strip',
    // ymax: 3,
    // ymin: 0,
    ytitles: ['LTO size opening', 'LTO opening misalignment'],
    yfields: ['ltoaldpr.lto_size_opening', 'ltoaldpr.lto_opening_missalignment']
}, {
    id: 'chart5',
    title: 'LTO ALD deposition',
    // ymax: 8,
    // ymin: 5,
    ytitles: ['LTO witness thickness'],
    yfields: ['ltoalddep.lto_witness_thickness']
}, {
    id: 'chart6',
    title: 'Post anneal',
    // ymax: 8,
    // ymin: 5,
    ytitles: ['Witness sheet resistance', 'Transmission'],
    yfields: ['postann.witness_sheet_resistance', 'postann.transmission']
}, {
    id: 'chart7',
    title: 'Metal patterning depth',
    ytitles: ['Depth 1', 'Depth 3', 'Depth 6'],
    ymax: 8,
    ymin: 5,
    yfields: ['metpat.pattern_depth1', 'metpat.pattern_depth3', 'metpat.pattern_depth6']
}, {
    id: 'chart8',
    title: 'Metal base pressure',
    ytitles: ['Base pressure'],
    // ymax: 8,
    // ymin: 5,
    yfields: ['metpat.base_pressure']
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

        for (var i = 0; i < 10; i++) {
            if (chartDef.yfields[i]) {
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
