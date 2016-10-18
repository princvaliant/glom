Template.fabLed.rendered = function () {
    Session.set('tasksLoading', true);
    Meteor.call('getFabLedPerExperiment', function (error, datalist) {
        Session.set('tasksLoading', false);
        fabProcessing(datalist);
    });
    Meteor.call('getFabLedPerExperimentWafer', function (error, datalist) {
        Session.set('tasksLoading', false);
        fabProcessingPerWafer(datalist);
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


/* LED
 ito_mesa_patterning
 resist_thickness      min/max/avg per experiment

 ito_wet_etch
 duration_ito          all wafers have the value

 mesa_etch_pr_strip
 total_strip_time      0 chart
 mesa_height_1         1 chart
 mesa_height_3         1 chart
 ito_pad_size_min      2 chart
 ito_pad_size_max      2 chart

 post_anneal
 witness_sheet_resistance   1 chart
 Apsorbtion Loss            2 chart

 lto_ald_deposition
 lto_witness_thickness      1 chart

 lto_ald_wet_etch
 duration_ald               1 chart

 lto_ald_pr_strip
 total_pr_strip_time        1 chart
 lto_size_opening           2 chart
 lto_opening_missalignment  3 chart

 X  metal_patterning
 pattern_depth1              1 chart
 pattern_depth3              1 chart

 metal_ebeam should be imported from some files

 metal_liftoff
 resist_total_strip_time_liftoff  1 chart

 post_bond_pad_inspection
 defects 1 - 6               chart 1 average min and max for wafer
 grade                       chart 2 yield plot percentage for pass and fails

 X isolation_patterning
 resist_thickness_center     1 chart
 resist_thickness_OD         1 chart

 post_isolation_bond_pad_inspection
 defects 1 - 6               1 chart average min and max for wafer
 grade                       2 chart yield plot percentage for pass and fails
 */


/*  JASPER

 X   metal_patterning_1
 pattern_depth_1             1 chart

 metal_liftoff_1
 liftoff1_resist_strip_total_duration   1 chart

 metal_patterning_2
 pattern_depth_2             1 chart

 metal_liftoff_2
 liftoff2_resist_strip_total_duration   1 chart

 */


function fabProcessing (datalist) {

    _.each(ChartDefs.fabLed, function (chartDef) {
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
            _.each(chartDef.yfields, function (field, i) {
                var series = {
                    type: 'candlestick',
                    name: field,
                    color: ChartDefs.colors[i],
                    risingColor: ChartDefs.colors[i],
                    showInLegend: true,
                    lineThickness: 1,
                    dataPoints: []
                };
                _.each(datalist, function (data) {
                    if (data._id) {
                        series.dataPoints.push({
                            label: data._id,
                            y: data[field] || 0
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


function fabProcessingPerWafer (datalist) {
    _.each(ChartDefs.fabLedPerWafer, function (chartDef) {
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

        var counter = 0;
        _.each(datalist, function (expObj) {
            counter += 1;
            var series = {
                type: 'scatter',
                markerSize: 4,
                toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Wafer</strong> {code} <br/><strong> Value</strong> {y}</span>",
                name: expObj._id,
                showInLegend: false,
                dataPoints: []
            };
            _.each(expObj.data, function (dataObj) {
                series.dataPoints.push({
                    x: counter,
                    y: dataObj[chartDef.yfields[0]] || '',
                    code: dataObj.code,
                    label: expObj._id
                });

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
