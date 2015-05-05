
Tracker.autorun(function () {
    if (Session.get("tcSearchBoxValue")) {
      Meteor.call ("getTCData", Session.get("tcSearchBoxValue"), function(err, data) {
        if (err)
          console.log(err);
        Session.set('tcData', data);
      });
    }
});

Template.tcContent.rendered = function () {
    google.load('visualization', '1', {packages: ['corechart']});
};

Template.tcChart.rendered = function () {
    var tt = Template.instance().$('.tc-chart-item');
    var dataTable = new google.visualization.DataTable();
    console.log(tt);
    var data = Session.get('tcData')[Session.get("tcSelectedDevice")][this.data.variable];
    for (var i = 0; i < data.columns.length; i++) {
      dataTable.addColumn('number', data.columns[i]);
    }
    dataTable.addRows(data.data);

    var options = {
        width: 1000,
        height: 400,
        hAxis: {
          title: 'Current density (A/cm2)'
        },
        vAxis: {
          title: this.data.variable
        }
      };

      var chart = new google.visualization.LineChart(tt[0]);
      chart.draw(dataTable, options);
};

Template.tcContent.helpers({
  charts: function () {
      var device = Session.get("tcSelectedDevice");
      if (Session.get("tcSelectedDevice")) {
        var ret =  _.map(_.keys(Session.get('tcData')[device]), function (item) {
            return {variable:item};
        });
        return ret;
      }
  }
});

