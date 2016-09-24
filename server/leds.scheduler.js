'use strict';
/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

var threshold = 16;
var dvid = 'T343';

Meteor.startup(function () {
    SyncedCron.add({
        name: 'Calculate tresholds for leds',
        schedule: function (parser) {
            // parser is a later.parse object
            return parser.text('every 10 hours');
        },
        job: function () {
            return exec();
        }
    });
});

var map = function () {
    var result = 0;
    for (var i = threshold; i <= 255; i++) {
        result += i * this["n" + i];
    }
    emit({
            id: this.DVid,
            f: this.file,
            c: this.color,
            t: NumberInt(threshold),
            d: NumberInt(this.devName)
        },
        NumberInt(result)
    );
};

var reduce = function (id, values) {
    return values;
};

var options = {
    out: {
        reduce: "ledscalc"
    },
    query: {
        "DVid": dvid
    },
    sort: {
        "DVid": 1,
        "file": 1,
        "color": 1,
        "devName": 1
    },
    scope: {threshold: threshold}
};

function exec () {
    scheduler.executeMapReduce(
        'leds',
        map,
        reduce,
        JSON.stringify(options));

};

// For testing in development
Meteor.methods({
    'ledssched': function () {
        return exec();
    }
});
