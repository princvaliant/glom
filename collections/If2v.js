
If2v = new Meteor.Collection("if2v");

If2v.allow({
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
