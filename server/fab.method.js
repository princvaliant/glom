Meteor.methods({
    'getFabPerWafer': function () {
        return Assembly.aggregate([{
            $match: {
                'metpat.actualStart': {
                    $gt: moment().subtract(60, 'days').toDate()
                }
            }
        }, {
            $sort: {
                'expId': 1,
                'code': 1
            }
        }
        ]);
    },
    'getFabPerExperiment': function () {

        var group = {
            _id: '$expId',
            'metpat1_max': {$max: '$metpat.pattern_depth1'},
            'metpat1_min': {$min: '$metpat.pattern_depth1'},
            'metpat1_avg': {$avg: '$metpat.pattern_depth1'},
            'metpat3_max': {$max: '$metpat.pattern_depth3'},
            'metpat3_min': {$min: '$metpat.pattern_depth3'},
            'metpat3_avg': {$avg: '$metpat.pattern_depth3'},
            'metpat6_max': {$max: '$metpat.pattern_depth6'},
            'metpat6_min': {$min: '$metpat.pattern_depth6'},
            'metpat6_avg': {$avg: '$metpat.pattern_depth6'},
            'jmetpat1_max': {$max: '$jaspmet1.pattern_depth_1'},
            'jmetpat1_min': {$min: '$jaspmet1.pattern_depth_1'},
            'jmetpat1_avg': {$avg: '$jaspmet1.pattern_depth_1'},
            'jmetpat2_max': {$max: '$jaspmet2.pattern_depth_2'},
            'jmetpat2_min': {$min: '$jaspmet2.pattern_depth_2'},
            'jmetpat2_avg': {$avg: '$jaspmet2.pattern_depth_2'},
            'isopat_max': {$max: '$isopat.resist_thickness_center'},
            'isopat_min': {$min: '$isopat.resist_thickness_center'},
            'isopat_avg': {$avg: '$isopat.resist_thickness_center'},
            'isopato_max': {$max: '$isopat.resist_thickness_OD'},
            'isopato_min': {$min: '$isopat.resist_thickness_OD'},
            'isopato_avg': {$avg: '$isopat.resist_thickness_OD'},
            'jaspfv_max': {$max: '$jaspfv.Metal 2 num_defect'},
            'jaspfv_min': {$min: '$jaspfv.Metal 2 num_defect'},
            'jaspfv_avg': {$avg: '$jaspfv.Metal 2 num_defect'}
        }
        for (var i = 1; i <= 6; i++) {
            group['pidefects' + i + '_avg'] = {$avg: '$postinsp.pbpdefects00' + 1};
            group['pidefects' + i + '_max'] = {$max: '$postinsp.pbpdefects00' + 1};
            group['pidefects' + i + '_min'] = {$min: '$postinsp.pbpdefects00' + 1};
        }


        return Assembly.aggregate([{
            $group: group
        }, {
            $project: {
                _id: '$_id',
                'metpat1': ['$metpat1_avg', '$metpat1_max', '$metpat1_min', '$metpat1_avg'],
                'metpat3': ['$metpat3_avg', '$metpat3_max', '$metpat3_min', '$metpat3_avg'],
                'metpat6': ['$metpat6_avg', '$metpat6_max', '$metpat6_min', '$metpat6_avg'],
                'jmetpat1': ['$jmetpat1_avg', '$jmetpat1_max', '$jmetpat1_min', '$jmetpat1_avg'],
                'jmetpat2': ['$jmetpat2_avg', '$jmetpat2_max', '$jmetpat2_min', '$jmetpat2_avg'],
                'isopatcent': ['$isopat_avg', '$isopat_max', '$isopat_min', '$isopat_avg'],
                'isopatod': ['$isopato_avg', '$isopato_max', '$isopato_min', '$isopato_avg'],
                'pidefects1': ['$pidefects1_avg', '$pidefects1_max', '$pidefects1_min', '$pidefects1_avg'],
                'pidefects2': ['$pidefects2_avg', '$pidefects2_max', '$pidefects2_min', '$pidefects2_avg'],
                'pidefects3': ['$pidefects3_avg', '$pidefects3_max', '$pidefects3_min', '$pidefects3_avg'],
                'pidefects4': ['$pidefects4_avg', '$pidefects4_max', '$pidefects4_min', '$pidefects4_avg'],
                'pidefects5': ['$pidefects5_avg', '$pidefects5_max', '$pidefects5_min', '$pidefects5_avg'],
                'pidefects6': ['$pidefects6_avg', '$pidefects6_max', '$pidefects6_min', '$pidefects6_avg'],
                'jaspfv': ['$jaspfv_avg', '$jaspfv_max', '$jaspfv_min', '$jaspfv_avg']
            }
        }, {
            $sort: {
                '_id': 1
            }
        }
        ]);
    }
});
