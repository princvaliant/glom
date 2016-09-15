/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

Meteor.startup(function() {

    SyncedCron.add({
        name: 'Prepare collections for assembly page',
        schedule: function(parser) {
            // parser is a later.parse object
            return parser.text('every 1 hour');
        },
        job: function() {
            return scheduler.executeAggregate('dataReport', getPipeline());
        }
    });
    SyncedCron.start();
});


// For testing in developmentdf
Meteor.methods({
    'exec_assembly': function() {
        scheduler.executeAggregate('dataReport', getPipeline());
    }
});

var query = {
    parentCode: null,
    'value.tags': {$in: [
        'nwLED|direct_view_baseline|metal_patterning',
        'nwLED|direct_view_baseline|mesa_etch_pr_strip'
    ]},
    'value.productCode': '100'
};

var fields = {
    __id: '$_id',
    code: '$code',
    expId: '$value.experimentId',
    metpat: '$value.metal_patterning',
    mesaetchpr: '$value.mesa_etch_pr_strip'
};

function getPipeline() {

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
    return  JSON.stringify(pipeline);
}
