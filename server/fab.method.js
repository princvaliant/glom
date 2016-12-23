Meteor.methods({

    getFab: function() {

        var query = {
            parentCode: null,
            'value.tags': 'nwLED|direct_view_baseline',
            'value.productCode': '100',
            'value.actualStart': {
                $gt: moment('2016-08-01').toDate()
            },
            'value.experimentId': {$nin: ['EXPD9999', 'EXPD000']}
        };

        var fields = {
            __id: '$_id',
            code: '$code',
            expId: '$value.experimentId',
            prod: '$value.productCode'
        };

        _.each(FabChartDefs.fabLed, function (chart) {
            _.each(chart.yfields, function (field) {
                var step = field.split('.')[0];
                fields[field] = '$value.' + field;
                fields[step + '.actualStart'] = '$value.' + step + '.actualStart';
            });
            _.each(chart.seriesFilter, function (filter) {
                _.keys(filter).forEach(function (key) {
                    fields[key] = '$value.' + key;
                });
            });
        });

        fields['post_bond_pad_inspection.pbpyield'] = {
            $sum: [{
                $cond: [{$eq: ['$value.post_bond_pad_inspection.pbpgrade001', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_bond_pad_inspection.pbpgrade002', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_bond_pad_inspection.pbpgrade003', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_bond_pad_inspection.pbpgrade004', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_bond_pad_inspection.pbpgrade005', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_bond_pad_inspection.pbpgrade006', 'pass']}, 1, 0]
            }]
        };
        fields['post_isolation_bond_pad_inspection.pibpyield'] =  {
            $sum: [{
                $cond: [{$eq: ['$value.post_isolation_bond_pad_inspection.pibpgrade001', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_isolation_bond_pad_inspection.pibpgrade002', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_isolation_bond_pad_inspection.pibpgrade003', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_isolation_bond_pad_inspection.pibpgrade004', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_isolation_bond_pad_inspection.pibpgrade005', 'pass']}, 1, 0]
            }, {
                $cond: [{$eq: ['$value.post_isolation_bond_pad_inspection.pibpgrade006', 'pass']}, 1, 0]
            }]
        };

        return  DataReports.aggregate([{
            $match: query
        }, {
            $project: fields
        }]);
    },

    getFabLedAveragePerExperiment: function () {

        var query = {
            parentCode: null,
            'value.tags': 'nwLED|direct_view_baseline',
            'value.productCode': '100',
            'value.actualStart': {
                $gt: moment('2016-08-01').toDate()
            },
            'value.experimentId': {$nin: ['EXPD9999', 'EXPD000', '', null]}
        };

        var project = {
            expId: '$value.experimentId',
            dt: '$value.actualStart'
        };

        _.each(FabChartDefs.fabLedAvgPerExperiment, function (chart) {
            if (chart.yname === 'post_bond_pad_inspection') {
                project['pbdefects'] = {$avg: []};
                project['pbyield'] = {$sum: []};
                for (var i = 1; i <= 6; i++) {
                    project['pbdefects'].$avg.push('$value.' + chart.yname + '.pbpdefects00' + i);
                    project['pbyield'].$sum.push({
                            $cond: [{$eq: ['$value.' + chart.yname + '.pbpgrade00' + i, 'pass']}, 1, 0]
                    });
                }
            } else if (chart.yname === 'post_isolation_bond_pad_inspection') {
                project['pibdefects'] = {$avg: []};
                project['pibyield'] = {$sum: []};
                for (var i = 1; i <= 6; i++) {
                    project['pibdefects'].$avg.push('$value.' + chart.yname + '.pibpdefects00' + i);
                    project['pibyield'].$sum.push({
                        $cond: [{$eq: ['$value.' + chart.yname + '.pibpgrade00' + i, 'pass']}, 1, 0]
                    });
                }
            }
        });

        var group = {
            _id:  '$expId',
            pbdefects: {
                $avg: '$pbdefects'
            },
            pbyield: {
                $avg: '$pbyield'
            },
            pibdefects: {
                $avg: '$pibdefects'
            },
            pibyield: {
                $avg: '$pibyield'
            },
            dt: {
                $last: '$dt'
            }
        };

        return  DataReports.aggregate([{
            $match: query
        }, {
            $project: project
        }, {
            $group: group
        }, {
            $sort: {
                dt: 1
            }
        }]);
    },

    getFabJasperPerExperiment: function () {

        var match = {
            parentCode: null,
            'value.tags': 'DVD|jasper_backplane',
            'value.productCode': '111'
        };

        var group = {
            _id: '$value.experimentId',
            dt: {
                $last: '$value.actualStart'
            }
        };
        var project = {
            _id: '$_id',
            dt: '$dt'
        };
        _.each(FabChartDefs.fabJasper, function (chart) {
            _.each(chart.yfields, function (field) {
                group[field + '_max'] = {$max: '$value.' + chart.yname + '.' + field};
                group[field + '_min'] = {$min: '$value.' + chart.yname + '.' + field};
                group[field + '_avg'] = {$avg: '$value.' + chart.yname + '.' + field};

                project[field] = [
                    '$' + field + '_avg',
                    '$' + field + '_max',
                    '$' + field + '_min',
                    '$' + field + '_avg'
                ]
            });
        });

        return DataReports.aggregate([{
            $match: match
        }, {
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
