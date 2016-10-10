Meteor.methods({
    'getFabLedPerExperiment': function () {

        var group = {
            _id: '$expId',
            dt: {
                $last: '$dateLed'
            }
        };
        var project = {
            _id: '$_id',
            dt: '$dt'
        };
        _.each(ChartDefs.fabLed, function (chart) {
            if (chart.yname === 'post_bond_pad_inspection') {
                group['pbdefects' + '_max'] = {$max: {$add: []}};
                group['pbdefects' + '_min'] = {$min: {$add: []}};
                group['pbdefects' + '_avg'] = {$avg: {$add: []}};
                for (var i = 1; i <= 6; i++) {
                    group['pbdefects' + '_max'].$max.$add.push('$' + chart.yname + '.pbpdefects00' + i);
                    group['pbdefects' + '_min'].$min.$add.push('$' + chart.yname + '.pbpdefects00' + i);
                    group['pbdefects' + '_avg'].$avg.$add.push('$' + chart.yname + '.pbpdefects00' + i);
                }
                group['pbyield' + '_max'] = {$max: '$pbyield'};
                group['pbyield' + '_min'] = {$min: '$pbyield'};
                group['pbyield' + '_avg'] = {$avg: '$pbyield'};
                project['pbdefects'] = [
                    '$' + 'pbdefects' + '_avg',
                    '$' + 'pbdefects' + '_max',
                    '$' + 'pbdefects' + '_min',
                    '$' + 'pbdefects' + '_avg'
                ]
                project['pbyield'] = [
                    '$' + 'pbyield' + '_avg',
                    '$' + 'pbyield' + '_max',
                    '$' + 'pbyield' + '_min',
                    '$' + 'pbyield' + '_avg'
                ]
            } else if (chart.yname === 'post_isolation_bond_pad_inspection') {
                group['pibdefects' + '_max'] = {$max: {$add: []}};
                group['pibdefects' + '_min'] = {$min: {$add: []}};
                group['pibdefects' + '_avg'] = {$avg: {$add: []}};
                for (var i = 1; i <= 6; i++) {
                    group['pibdefects' + '_max'].$max.$add.push('$' + chart.yname + '.pibpdefects00' + i);
                    group['pibdefects' + '_min'].$min.$add.push('$' + chart.yname + '.pibpdefects00' + i);
                    group['pibdefects' + '_avg'].$avg.$add.push('$' + chart.yname + '.pibpdefects00' + i);
                }
                group['pibyield' + '_max'] = {$max: '$pibyield'};
                group['pibyield' + '_min'] = {$min: '$pibyield'};
                group['pibyield' + '_avg'] = {$avg: '$pibyield'};
                project['pibdefects'] = [
                    '$' + 'pibdefects' + '_avg',
                    '$' + 'pibdefects' + '_max',
                    '$' + 'pibdefects' + '_min',
                    '$' + 'pibdefects' + '_avg'
                ]
                project['pibyield'] = [
                    '$' + 'pibyield' + '_avg',
                    '$' + 'pibyield' + '_max',
                    '$' + 'pibyield' + '_min',
                    '$' + 'pibyield' + '_avg'
                ]
            } else {
                _.each(chart.yfields, function (field) {
                    group[field + '_max'] = {$max: '$' + chart.yname + '.' + field};
                    group[field + '_min'] = {$min: '$' + chart.yname + '.' + field};
                    group[field + '_avg'] = {$avg: '$' + chart.yname + '.' + field};

                    project[field] = [
                        '$' + field + '_avg',
                        '$' + field + '_max',
                        '$' + field + '_min',
                        '$' + field + '_avg'
                    ]
                });
            }
        });

        return Assembly.aggregate([{
            $group: group
        }, {
            $project: project
        }, {
            $match: {
                dt: {$ne: null}
            }
        }, {
            $sort: {
                'dt': 1
            }
        }]);
    },
    'getFaJasperPerExperiment': function () {

        var group = {
            _id: '$expId',
            dt: {
                $last: '$dateJasper'
            }
        };
        var project = {
            _id: '$_id',
            dt: '$dt'
        };
        _.each(ChartDefs.fabJasper, function (chart) {
            _.each(chart.yfields, function (field) {
                group[field + '_max'] = {$max: '$' + chart.yname + '.' + field};
                group[field + '_min'] = {$min: '$' + chart.yname + '.' + field};
                group[field + '_avg'] = {$avg: '$' + chart.yname + '.' + field};

                project[field] = [
                    '$' + field + '_avg',
                    '$' + field + '_max',
                    '$' + field + '_min',
                    '$' + field + '_avg'
                ]
            });
        });

        return Assembly.aggregate([{
            $group: group
        }, {
            $project: project
        }, {
            $match: {
                dt: {$ne: null}
            }
        }, {
            $sort: {
                'dt': 1
            }
        }]);
    }
});