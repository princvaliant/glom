Template.testCharts.rendered = function () {

};

Template.testCharts.helpers({
  konikaConfigs: function () {
      return KonikaConfigs.find();
  }
});

Template.testCharts.events({
  'click .addKonikaConfig': function (evt) {
      Session.set("currentKonikaConfig", this);
  },
  'click .editKonikaConfig': function (evt) {
      console.log(this);
  }
});
