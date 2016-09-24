
LedsCalc = new Meteor.Collection('ledscalc');

LedsCalc.allow({
  insert: function (userId, party) {
    return false;
  },
  update: function (userId, party) {
    return false;
  },
  remove: function(userId, doc) {
    return false;
  }
});
