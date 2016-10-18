/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

Meteor.startup(function () {

    SyncedCron.add({
        name: 'Prepare collections for fab LED and Jasper pages',
        schedule: function (parser) {
            // parser is a later.parse object
            return parser.text('every 1 hour');
        },
        job: function () {
            return scheduler.executeAggregate('dataReport', getPipeline());
        }
    });
    SyncedCron.start();
});


// For testing in developmentdf
Meteor.methods({
    'exec_assembly': function () {
        scheduler.executeAggregate('dataReport', getPipeline());
    }
});

var query = {
    parentCode: null,
    'value.tags': {
        $in: [
            'nwLED|direct_view_baseline|ito_mesa_patterning',
            'nwLED|direct_view_baseline|ito_wet_etch',
            'nwLED|direct_view_baseline|mesa_etch_pr_strip',
            'nwLED|direct_view_baseline|post_anneal',
            'nwLED|direct_view_baseline|lto_ald_deposition',
            'nwLED|direct_view_baseline|lto_ald_wet_etch',
            'nwLED|direct_view_baseline|lto_ald_pr_strip',
            'nwLED|direct_view_baseline|metal_patterning',
            'nwLED|direct_view_baseline|metal_liftoff',
            'nwLED|direct_view_baseline|post_bond_pad_inspection',
            'nwLED|direct_view_baseline|isolation_patterning',
            'nwLED|direct_view_baseline|post_isolation_bond_pad_inspection',

            'DVD|jasper_backplane|metal_patterning_1',
            'DVD|jasper_backplane|metal_liftoff_1',
            'DVD|jasper_backplane|metal_patterning_2',
            'DVD|jasper_backplane|metal_liftoff_2'
        ]
    },
    'value.productCode': {$in: ['100', '111']},
    'value.experimentId': {$nin: ['EXPD9999']}
};

var fields = {
    __id: '$_id',
    code: '$code',
    expId: '$value.experimentId',
    prod: '$value.productCode',
    date: '$value.actualStart',
    ito_mesa_patterning: '$value.ito_mesa_patterning',
    ito_wet_etch: '$value.ito_wet_etch',
    mesa_etch_pr_strip: '$value.mesa_etch_pr_strip',
    post_anneal: '$value.post_anneal',
    lto_ald_deposition: '$value.lto_ald_deposition',
    lto_ald_wet_etch: '$value.lto_ald_wet_etch',
    lto_ald_pr_strip: '$value.lto_ald_pr_strip',
    metal_patterning: '$value.metal_patterning',
    metal_liftoff: '$value.metal_liftoff',
    post_bond_pad_inspection: '$value.post_bond_pad_inspection',
    isolation_patterning: '$value.isolation_patterning',
    post_isolation_bond_pad_inspection: '$value.post_isolation_bond_pad_inspection',
    metal_patterning_1: '$value.metal_patterning_1',
    metal_liftoff_1: '$value.metal_liftoff_1',
    metal_patterning_2: '$value.metal_patterning_2',
    metal_liftoff_2: '$value.metal_liftoff_2',
    'pbyield': {
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
    },
    'pibyield': {
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
    }
};

function getPipeline () {

    var pipeline = [{
        $match: query
    }, {
        $project: fields
    }, {
        $sort: {
            'expId': 1,
            'code': 1
        }
    }, {
        $out: 'assembly'
    }];
    return JSON.stringify(pipeline);
}
