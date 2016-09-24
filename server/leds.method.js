

Meteor.methods({
  'getLedsCalc': function(device, color, threshold) {
     var s =  getLedsCalc(device, color, threshold);
     return s;
  }
});

function getLedsCalc(device, color, threshold) {
  var match = {
    '_id.id': device,
    '_id.f': color,
    '_id.t': parseInt(threshold)
  };
  var fields = {
    x: '$_id.d',
    y: '$value',
    c: '$_id.c',
    _id: 0
  };

  var pipeline = [{
    $match: match
  }, {
    $project: fields
  }];
  return LedsCalc.aggregate(pipeline);
}
