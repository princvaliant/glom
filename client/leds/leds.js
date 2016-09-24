Template.leds.rendered = function () {

};

Template.leds.helpers({
    tasksLoading: function () {
        return Session.get('tasksLoading');
    }
});

Template.leds.events({
    'click .populate': function (evt, template) {
        var device = template.find('.device').value;
        var color = template.find('.color').value;
        var threshold = template.find('.threshold').value;

        Session.set('tasksLoading', true);
        Meteor.call('getLedsCalc', device, color, threshold, function (error, datalist) {
            Session.set('tasksLoading', false);
            populateCharts(datalist, device, color, threshold);
        });
    }
});

var chartDefs = [{
    id: 'chart',
    title: 'Distribution',
    // ymax: 3,
    // ymin: 0,
    ytitles: ['Dev Name'],
    yfields: ['value']
}];

function populateCharts (datalist, device, color, threshold) {

    _.each(chartDefs, function (chartDef) {
        var chart = {
            title: {
                text: chartDef.title + ' for ' + device + ': ' + color + ' at threshold ' + threshold,
                fontSize: 16
            },
            animationEnabled: false,
            animationDuration: 700,
            axisX: {
                title: "",
                titleFontSize: 14,
                labelFontSize: 10,
                labelAngle: -35,
                interval: 3000

            },
            axisY: {
                title: chartDef.title,
                titleFontSize: 14,
                labelFontSize: 10,
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

        if (chartDef.yfields[0]) {
            var series = {
                type: 'scatter',
                markerSize: 3,
                toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong>dev name</strong> {x} <br/><strong> value</strong></span> {y}<br/>",
                name: chartDef.ytitles[0],
                showInLegend: true,
                dataPoints: _.map(datalist, function(m) {
                    return {
                        x: m.x,
                        y: m.y,
                        color: m.c === 'B' ? 'blue' : (m.c === 'G' ? 'green' : 'red')
                    };
                })
            };
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
}
