Meteor.publish("dvd", function() {
  return Dvd.find({});
});

Meteor.methods({
  'getDvd': function() {
    return Dvd.find({}, {
      sort: {
        'id.exp': 1,
        'id.wid': 1
      }
    }).fetch();
  },

  'getDvdNoData': function() {
    return Dvd.find({}, {
      sort: {
        'id.exp': 1,
        'id.wid': 1
      },
      fields: {
        id : 1
      }
    }).fetch();
  },

  'getNiDot': function() {
    var ret = DataReports.find({
      parentCode: null,
      'value.tags': {
        $in: ['nwLED|epi|ni_dot_test']
      },
      'value.productCode': '100',
      'value.test_data_visualization.mask': {
        $in: ['MASK28', 'MASK29']
      }
      // ,
      // 'value.ni_dot_test.peak08': {
      //   $exists: 1
      // }
    }, {
      fields: {
        code: 1,
        'unit.experimentId': 1,
        'value.ni_dot_test': 1
      }
    }).fetch();
    return ret;
  }
});
