Template.tdiCurrents.helpers({
  currents: function () {
      var ret = tdiQueryResult.find().fetch()[0];
      if (ret)
        return ret.current;
  }
});


Template.tdiCurrent.events({
  'click .current-item': function (evt) {
    var tt = Template.instance().$('.current-item');
    if (tt.hasClass('active')) {
      tt.removeClass('active');
      removeFromSessionArray("selectedTdis", "current", this.current);
    }
    else {
      tt.addClass('active');
      addToSessionArray("selectedTdis", "current", this.current);
    }
  }
});
