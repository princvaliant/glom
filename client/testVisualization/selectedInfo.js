Template.selectedInfo.helpers({
  name: function () {
    if (Session.get("selectedTdis") && Session.get("selectedTdis").search)
      return Session.get("selectedTdis").search._id;
  },
  key: function () {
    if (Session.get("selectedTdis") && Session.get("selectedTdis").search)
      return Session.get("selectedTdis").search.key;
  }
});
