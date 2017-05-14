/**
 * Scheduled jobs for mongo aggregation
 * @type {meteor.startup}
 */

Meteor.startup(function () {

  // SyncedCron.add({
  //   name: 'Prepare collections for konica charts page',
  //   schedule: function (parser) {
  //     // parser is a later.parse object
  //     return parser.text('every 1 hour');
  //   },
  //   job: function () {
  //     return scheduler.executeAggregate('dataReport', getPipeline());
  //   }
  // });
  //
  // SyncedCron.start();
});


// For testing in development
Meteor.methods({
  'formatkon': function () {
    scheduler.executeAggregate('dataReport', getPipeline());
  }
});

var query = {
  'value.glo_camera_test': {
    $exists: true
  },
  'unit.build_number': {
    $regex: '^PBLD'
  },
  'value.iblu_incomming_inspection.actualStart': {
    $gt: 'DATEFILTER'
  }
};

var fields = {
  iblu: '$code',
  date: '$value.iblu_incomming_inspection.actualStart',
  dtype: '$unit.ilgp-iblu',
  build_number: '$unit.build_number',
  avg_135pt: '$value.glo_camera_test.avg_135pt',
  avg_13pt: '$value.glo_camera_test.avg_13pt',
  avg_50pt: '$value.glo_camera_test.avg_50pt',
  avg_69pt: '$value.glo_camera_test.avg_69pt',
  center_lv: '$value.glo_camera_test.center_lv',
  unif_135pt: '$value.glo_camera_test.unif_135pt',
  unif_13pt: '$value.glo_camera_test.unif_13pt',
  unif_50pt: '$value.glo_camera_test.unif_50pt',
  unif_69pt: '$value.glo_camera_test.unif_69pt',
  ciex_69pt: '$value.glo_camera_test.ciex_69pt',
  ciey_69pt: '$value.glo_camera_test.ciey_69pt',
  ciex_135pt: '$value.glo_camera_test.ciex_135pt',
  ciey_135pt: '$value.glo_camera_test.ciey_135pt',
  ciex_13pt: '$value.glo_camera_test.ciex_13pt',
  ciey_13pt: '$value.glo_camera_test.ciey_13pt',
  csarb_135pt: '$value.glo_camera_test.color_shift_arbitrary_135pt',
  csarb_126pt: '$value.glo_camera_test.color_shift_arbitrary_126pt',
  csarb_84pt: '$value.glo_camera_test.color_shift_arbitrary_84pt',
  csadj_135pt: '$value.glo_camera_test.color_shift_adjacent_135pt',
  csadj_126pt: '$value.glo_camera_test.color_shift_adjacent_126pt',
  csadj_84pt: '$value.glo_camera_test.color_shift_adjacent_84pt',
  comment: '$unit.comment',
  adhesive: '$unit.epoxy',
  encapsulant: '$unit.encapsulant',
  adhesive_doping: '$unit.epoxy doping',
  epoxy_thickness_center: '$value.ilgp_mechanical_characterization.epoxy_thickness_center',
  epoxy_thickness_tail: '$value.ilgp_mechanical_characterization.epoxy_thickness_fpc_side',
  epoxy_thickness_non_tail: '$value.ilgp_mechanical_characterization.epoxy_thickness_non_fpc_side',
  offset_tail: '$value.ilgp_mechanical_characterization.lgp_offset_fpc_side',
  offset_non_tail: '$value.ilgp_mechanical_characterization.lgp_offset_non_fpc_side',
  pull_force_kg: '$value.ilgp_pull_force_test.pull_force',
  build_date: {
    $cond: [{
       $eq : [{$toUpper:{$substr: [ "$unit.build_number", 0, 8 ]}}, 'PBLDILGP']
    }, {
      $concat: [{
        $substr: ["$unit.build_number", 12, 2]
      }, {
        $substr: ["$unit.build_number", 8, 2]
      }, {
        $substr: ["$unit.build_number", 10, 2]
      }]
    }, {
      $concat: [{
        $substr: ["$unit.build_number", 8, 2]
      }, {
        $substr: ["$unit.build_number", 4, 2]
      }, {
        $substr: ["$unit.build_number", 6, 2]
      }]
    }]
  }
};

function getPipeline() {

  var offset = Math.abs(moment().utcOffset() * 60000);

  var pipeline = [{
    $match: query
  }, {
    $project: fields
  }, {
    $sort: {
      build_date: -1
    }
  }, {
    $out: 'konicaReport'
  }];

  var p = JSON.stringify(pipeline);

  p = p.replace('\"DATEFILTER\"', 'new ISODate(\"' + moment().subtract(150, 'days').toISOString() + '\")');

  return p;
}
