Template.tdiItems.helpers({
  items: function () {
      var ret = tdiQueryResult.find().fetch()[0];
      if (ret)
        return ret.item;
  }
});


Template.tdiItem.events({
  'click .item-item': function (evt) {
    var tt = Template.instance().$('.item-item');
    if (tt.hasClass('active')) {
      tt.removeClass('active');
      removeFromSessionArray("selectedTdis", "item", this.item);
    }
    else {
      tt.addClass('active');
      addToSessionArray("selectedTdis", "item", this.item);
    }
  }
});
