Template.tcSelectedInfo.helpers({
  code: function () {
    if (Session.get("tcSearchBoxValue"))
      return Session.get("tcSearchBoxValue").code;
  },
  experimentId: function () {
    if (Session.get("tcSearchBoxValue"))
      return Session.get("tcSearchBoxValue").experimentId;
  }
});
