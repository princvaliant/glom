

Meteor.methods({
  'getIf2v': function() {
    return If2v.find({}).fetch();
  }
});
