
Tracker.autorun(function () {
  Meteor.subscribe("searchTestChart");
});

Template.tcSearchBox.helpers({
    settings: function () {
      return {
        position: "bottom",
        limit: 10,
        rules: [{
          subscription: "searchTestChart",
          collection: "Units",
          filter: {mask:'MASK8',productCode:'100'},
          field: "code",
          template: Template.tcSearchItem,
          callback : function (doc, element) {
             Session.set("tcSearchBoxValue", doc);
          }
        }]
      };
    }
});
