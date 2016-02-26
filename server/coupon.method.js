

Meteor.methods({
  'getCoupons': function() {
     return getCoupons();
  }
});

function getCoupons() {
  var offset = Math.abs(moment().utcOffset() * 60000);
  var match = {
    'parentCode': null,
    'value.tags': 'DVD|dvd_assembly|coupon_on_wafer',
    'value.productCode': 'CPN1000',
    'value.coupon_on_wafer.actualStart': {
        $gt: moment().subtract(60, 'days').toDate()
    }
  };
  var fields = {
    c: '$code',
    d: {
      $dateToString: {
        format: '%Y-%m-%d',
        date: {
          $subtract: ['$value.coupon_on_wafer.actualStart', offset]
        }
      }
    },
    exp: '$value.post_bond_pad_inspection.experimentId',
    pbp: '$value.coupon_on_wafer.post_bone_pad',
    pbpt: '$value.coupon_on_wafer.post_bone_pad_test',
    pi: '$value.coupon_on_wafer.post_isolation',
  };

  var pipeline = [{
    $match: match
  }, {
    $project: fields
  }, {
    $sort: {
      exp: 1,
      c: 1
    }
  }];
  return DataReports.aggregate(pipeline);
}
