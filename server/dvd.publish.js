

Meteor.publish("dvd", function () {
    return Dvd.find({});
});

Meteor.methods({
  'getDvd': function () {
    return Dvd.find({}, {sort: {date:1}}).fetch();
  }
});
