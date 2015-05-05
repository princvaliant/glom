tdiSearchResult = new Meteor.Collection("tdiSearchResult");

Tracker.autorun(function () {
  Meteor.subscribe("searchTestDataImages");
});

Template.tdiSearchBox.helpers({
    settings: function () {
      return {
        position: "bottom",
        limit: 10,
        rules: [{
          token: '',
          collection: tdiSearchResult,
          field: "_id",
          sort: false,
          template: Template.tdiSearchItem,
          callback : function (doc, element) {
             Session.set("tdiSearchBoxValue", doc);
          }
        }]
      };
    }
});
