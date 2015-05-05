
KonicaRaw = new Meteor.Collection("konicaRaw");

KonicaRaw.allow({
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

