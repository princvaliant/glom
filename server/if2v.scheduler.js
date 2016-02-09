/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

Meteor.startup(function() {

  SyncedCron.add({
    name: 'Prepare collections for if2v page',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 6 hours');
    },
    job: function() {
      return scheduler.executeAggregate('testData', getPipeline());
    }
  });

  SyncedCron.start();
});


// For testing in development
Meteor.methods({
  'formatif2v': function() {
    scheduler.executeAggregate('testData', getPipeline());
  }
});

var query = {
  'value.testId': {
    $gt: 150801000000
  },
  'value.tkey': 'test_data_visualization',
  'value.parentCode': {
    $ne: null
  }
};

var fields = {
  _id: '$_id',
  code: '$value.parentCode',
  data: '$value.data.Datavoltage.data'
};

function getPipeline() {

  var offset = Math.abs(moment().utcOffset() * 60000);

  var pipeline = [{
    $match: query
  }, {
    $project: fields
  }, {
    $unwind: '$data'
  }, {
    $project: {
      code: '$code',
      v: {
        $arrayElemAt: ['$data', 0]
      },
      i: {
        $arrayElemAt: ['$data', 1]
      }
    }
  }, {
    $match: {
      v: {
        $gt: 1.95,
        $lt: 2.05
      }
    }
  }, {
    $group: {
      _id: '$code',
      iavg: {
        $avg: '$i'
      },
      istd: {
        $stdDevPop: '$i'
      }
    }
  }, {
    $out: 'if2v'
  }];
  var p = JSON.stringify(pipeline);
  return p;
}
