Meteor.methods({

    getEpifabData: function() {

        var query = {
            parentCode: null,
            'value.tags': 'W|epifab',
            'value.productCode': {$regex: 'W$'},
            'value.actualStart': {
                $gt: moment('2017-01-01').toDate()
            },
            'value.experimentId': {$nin: ['EXPD9999', 'EXPD000']}
        };

        var fields = {
            __id: '$_id',
            code: '$code',
            expId: '$value.experimentId',
            prod: '$value.productCode'
        };

        _.each(AssemblyChartDefs.epifab, function (chart) {
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

        return  DataReports.aggregate([{
            $match: query
        }, {
            $project: fields
        }]);
    },

    getFabassemblyData: function() {

        var query = {
            parentCode: null,
            'value.tags': 'C|fabassembly',
            'value.productCode': {$regex: 'C$'},
            'value.actualStart': {
                $gt: moment('2017-01-01').toDate()
            },
            'value.experimentId': {$nin: ['EXPD9999', 'EXPD000']}
        };

        var fields = {
            __id: '$_id',
            code: '$code',
            expId: '$value.experimentId',
            prod: '$value.productCode'
        };

        _.each(AssemblyChartDefs.fabassembly, function (chart) {
            _.each(chart.yfields, function (field) {
                var step = field.split('.')[0];
                fields[field] = '$value.' + field;
                fields[step + '.actualStart'] = '$value.' + step + '.actualStart';
            });
        });

        return  DataReports.aggregate([{
            $match: query
        }, {
            $project: fields
        }]);
    },

    getAssemblyDataPerExperiment: function () {

        var query = {
            parentCode: null,
            'value.tags': 'C|fabassembly',
            'value.productCode': '100C',
            'value.actualStart': {
                $gt: moment('2016-08-01').toDate()
            },
            'value.experimentId': {$nin: ['EXPD9999', 'EXPD000', '', null]}
        };

        var project = {
            expId: '$value.experimentId',
            dt: '$value.actualStart'
        };

        _.each(AssemblyChartDefs.fabLedAvgPerExperiment, function (chart) {
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
    }
});
