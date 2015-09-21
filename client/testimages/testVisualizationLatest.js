

Template.testVisualizationLatest.rendered = function () {
    Meteor.subscribe("testDataImagesLatest");
    Meteor.setInterval(function() {
      Meteor.subscribe("testDataImagesLatest");
      Session.set("tdiTimeout", new Date());
    },3600000);
};

Template.testVisualizationLatest.helpers({
  testImages: function () {
      var s = Session.get("tdiTimeout");
      return TestDataImages.find().fetch();
  }
});
