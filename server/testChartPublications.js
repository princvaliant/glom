Meteor.publish("searchTestChart", function (selector, options, collName) {
  if (selector !== undefined && selector.code) {
    collection = global[collName];
    Autocomplete.publishCursor(
      Units.find(selector, {
        fields: {
          'experimentId': 1,
          'code': 1
        },
        sort: {
          'lastUpdated': -1
        },
        limit: 10
      }), this);
    this.ready();
  }
});

Meteor.methods ({
  getTCData : function (code) {
    var result = Meteor.http.get("http://mes/gloreport/mask19Sum/getPerDeviceType?tkey=test_data_visualization&code=8542-4");
    var obj = JSON.parse(result.content);
    return obj;
  },
  getTCDataSum : function (code) {
    var result = Meteor.http.get("http://mes/gloreport/mask19Sum/getPerDeviceType?tkey=test_data_visualization&code=8542-4");
    var obj = JSON.parse(result.content);
    return obj;
  }

});
