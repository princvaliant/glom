/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

Meteor.startup(function() {

    SyncedCron.add({
        name: 'Prepare collections for dashboard page',
        schedule: function(parser) {
            // parser is a later.parse object
            return parser.text('every 1 hour');
        },
        job: function() {
            return scheduler.executeAggregate('measures', getPipeline());
        }
    });

    SyncedCron.start();
});


// For testing in developmentdf
Meteor.methods({
    'formatdash': function() {
        scheduler.executeAggregate('measures', getPipeline());
    }
});

var query = {
    TestType: 'test_data_visualization',
    mask: {
        $in: ['MASK28', 'MASK29']
    },
    devtype: '20x20',
    'DateTimeTested': {
        $gt: 'DATEFILTER'
    }
};

var fields = {
    __id: '$_id',
    exp: '$experimentId',
    wid: '$WaferID',
    did: '$DeviceID',
    cs: '$C',
    cv: '$Current',
    eqe: '$eqe',
    domwl: '$dominantWavelength',
    peakwl: '$PeakWavelength',
    volt: '$Volt',
    mask: '$mask',
    // lv: '$photometric',
    // u: '$u',
    // v: '$v1960',
    dt: '$devtype',
    area: '$actarea',
    date: '$TimeRun'
};

function getPipeline() {

    var offset = Math.abs(moment().utcOffset() * 60000);
    var pipeline = [{
        $match: query
    }, {
        $project: fields
    }, {
        $sort: {
            wid: 1,
            eqe: -1
        }
    }, {
        $group: {
            _id: {
                exp: '$exp',
                wid: '$wid'
            },
            'date': {
                $last: '$date'
            },
            '__id': {
                $last: '$__id'
            },
            data: {
                $push: {
                    did: '$did',
                    cv: '$cv',
                    cs: '$cs',
                    eqe: '$eqe',
                    domwl: '$domwl',
                    peakwl: '$peakwl',
                    volt: '$volt',
                    mask: '$mask',
                    // lv: '$lv',
                    // u: '$u',
                    // v: '$v',
                    dt: '$dt',
                    area: '$area'
                }
            }
        }
    }, {
        $project: {
            _id: '$__id',
            id: '$_id',
            date: '$date',
            data: '$data'
        }
    }, {
        $out: 'dvd'
    }];

    var p = JSON.stringify(pipeline);

    p = p.replace('\"DATEFILTER\"', 'new ISODate(\"' + moment().subtract(180, 'days').toISOString() + '\")');

    return p;
}
