

TestDataImages = new Meteor.Collection("testDataImages");

TestDataImages.allow({
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
