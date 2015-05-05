
Tracker.autorun(function () {
    if (Session.get("tcSearchBoxValue")) {
      Meteor.call ("getTCData", Session.get("tcSearchBoxValue"), function(err, data) {
        if (err)
          console.log(err);
        Session.set('tcData', data);
      });
    }
});


Template.tcDevices.helpers({
  devices: function () {
      var devs = [];
      _.each(Session.get('tcData'), function (value, key) {
          devs.push({device:key});
      });
      return devs;
  }
});


Template.tcDevice.events({
  'click .device-item': function (evt) {
    var tt = Template.instance().$('.device-item');
    tt.addClass('active');
    Session.set("tcSelectedDevice", this.device);
  }
});
