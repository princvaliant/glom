
KonicaReport = new Meteor.Collection("konicaReport");

KonicaReport.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return false;
  }
});

