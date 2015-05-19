
KonicaData = new Meteor.Collection("konicaData");

KonicaData.allow({
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
