Template.tdiTests.helpers({
  tests: function () {
      var ret = tdiQueryResult.find().fetch()[0];
      if (ret) {
        if (ret.tkey.length === 1) {
            var tt = Template.instance().$('.test-item');
            tt.addClass('active');
            addToSessionArray("selectedTdis", "tkey", ret.tkey[0].tkey);
        }
        return ret.tkey;
      }
  }
});

Template.tdiTest.events({
  'click .test-item': function (evt) {
    var tt = Template.instance().$('.test-item');
    if (tt.hasClass('active')) {
      tt.removeClass('active');
      removeFromSessionArray("selectedTdis", "tkey", this.tkey);
    }
    else {
      tt.addClass('active');
      addToSessionArray("selectedTdis", "tkey", this.tkey);
    }
  }
});
