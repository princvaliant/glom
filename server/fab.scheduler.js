/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

Meteor.startup(function () {

    SyncedCron.add({
        name: 'Prepare collections for assembly page',
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
            'nwLED|direct_view_baseline|mesa_etch_pr_strip',
            'nwLED|direct_view_baseline|lto_ald_deposition',
            'nwLED|direct_view_baseline|lto_ald_pr_strip',
            'nwLED|direct_view_baseline|metal_patterning',
            'nwLED|direct_view_baseline|post_anneal',
            'nwLED|direct_view_baseline|metal_liftoff',
            'nwLED|direct_view_baseline|isolation_patterning',
            'nwLED|direct_view_baseline|isolation_pr_strip',
            'nwLED|direct_view_baseline|post_bond_pad_inspection',
            'nwLED|direct_view_baseline|post_isolation_bond_pad_inspection',
            'DVD|jasper_backplane|metal_patterning_1',
            'DVD|jasper_backplane|metal_patterning_2',
            'DVD|jasper_backplane|post_fab_visual'
        ]
    },
    'value.productCode': {$in: ['100', '111']}
};

var fields = {
    __id: '$_id',
    code: '$code',
    expId: '$value.experimentId',
    itomesa: '$value.ito_mesa_patterning',
    mesaetchpr: '$value.mesa_etch_pr_strip',
    ltoalddep: '$value.lto_ald_deposition',
    ltoaldpr: '$value.lto_ald_pr_strip',
    metpat: '$value.metal_patterning',
    postann: '$value.post_anneal',
    metlift: '$value.metal_liftoff',
    isopat: '$value.isolation_patterning',
    isopr: '$value.isolation_pr_strip',
    postinsp: '$value.post_bond_pad_inspection',
    postinspi: '$value.post_isolation_bond_pad_inspection',
    jaspmet1: '$value.metal_patterning_1',
    jaspmet2: '$value.metal_patterning_2',
    jaspfv: '$value.post_fab_visual'
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
