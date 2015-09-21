tdiQueryResult = new Meteor.Collection("tdiQueryResult");

Session.set("selectedTdis", {});

Tracker.autorun(function () {
  Meteor.subscribe("testDataImages", Session.get("selectedTdis"));
});

Template.testVisualization.rendered = function () {
  this.autorun(function () {
    var search = Session.get("tdiSearchBoxValue");
    Meteor.subscribe("queryTestDataImages", search);
    var res = tdiQueryResult.find().fetch()[0];
    if (res)
      Session.set("selectedTdis", {
          search: search,
          tkey: [],
          current: [],
          item: [],
          code: []
      });
    else
      Session.set("selectedTdis", {});
  });
};



Template.testVisualization.helpers({
  testImages: function () {
      return TestDataImages.find().fetch();
  }
});

