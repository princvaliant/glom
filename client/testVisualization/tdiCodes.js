Template.tdiCodes.helpers({
  codes: function () {
      var ret = tdiQueryResult.find().fetch()[0];
      if (ret)
        return ret.code;
  }
});


Template.tdiCode.events({
  'click .code-item': function (evt) {
    var tt = Template.instance().$('.code-item');
    if (tt.hasClass('active')) {
      tt.removeClass('active');
      removeFromSessionArray("selectedTdis", "code", this.code);
    }
    else {
      tt.addClass('active');
      addToSessionArray("selectedTdis", "code", this.code);
    }
  }
});
