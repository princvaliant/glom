

Meteor.publish("dvd", function () {
    return Dvd.find({});
});
