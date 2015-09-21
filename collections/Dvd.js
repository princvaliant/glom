
Dvd = new Meteor.Collection("dvd");

Dvd.allow({
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
