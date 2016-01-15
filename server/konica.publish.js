

Meteor.publish("konicaReport", function () {
    return KonicaReport.find({});
});


Meteor.publish("konica", function (search) {

  var limit = 100;
  var q = {};

  if (search && search.text) {
    q.code = {
      $regex: '^' + search.text
    };

    if (search.text.substr(0, 4) === 'PBLD') {
      var units = Units.find({
        tagsCustom: search.text
      }, {
        fields: {
          code: 1
        },
        limit: 100
      }).fetch();

      q.code = {
        $in: _.pluck(units, 'code')
      };
    }

    limit = 100;
  } else {
    q.code = {
      $ne: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };
  }
  if (search) {
    if (search.testSource === "Camera only") {
      q.top200 = null;
    }
    if (search.testSource === "Top 200 only") {
      q.top200 = true;
    }
  }

  return Konica.find(q, {
    limit: limit,
    sort: {
      'date': -1
    }
  });
});

Meteor.publish("konicaRaw", function (query, m) {
  var fields = {
    code: 1,
    testId: 1,
    from3: 1,
    to3: 1,
    from4: 1,
    to4: 1,
    from5: 1,
    to5: 1,
    from8: 1,
    to8: 1
  };
  fields[m] = 1;
  return KonicaRaw.find(query, {
    limit: 1,
    fields: fields
  });
});

Meteor.publish("konicaData", function (code, testId, testType) {

  return KonicaData.find({
    code: code,
    testId: testId,
    testType: testType
  }, {
    sort: {
      'spot': 1
    }
  });
});

Meteor.methods({
  'histogram': function (code, testId, m, x, y) {

    var fields = {};
    fields[m] = 1;
    var raw = KonicaRaw.find({
      code: code,
      testId: testId
    }, {
      limit: 1,
      fields: fields
    }).fetch()[0][m];

    var w = raw.length;
    var h = raw[0].length;
    var y2 = h - 1 - y;

    console.log(m);
    console.log(w);
    console.log(h);

    var xpoints = [];
    var ypoints = [];
    for (var i = 1; i < w; i++) {
      xpoints.push({
        x: i,
        y: raw[i][y] > 0 ? raw[i][y] : 0
      });
    }
    for (var j = 1; j < h; j++) {
      ypoints.push({
        x: j,
        y: raw[x][h - j] > 0 ? raw[x][h - j]  : 0
      });
    }

    return {
      zoomEnabled: true,
      title: {
        text: 'X from left = ' + x + '  |  Y from bottom = ' + y2,
        fontSize: 14
      },
      axisX: {
        labelFontSize: 10
      },
      axisY: {
        gridThickness: 1,
        labelFontSize: 10
      },
      data: [{
        type: "scatter", //change type to bar, line, area, pie, etc
        showInLegend: true,
        'name': 'X',
        markerSize: 2,
        dataPoints: xpoints
      }, {
        type: "scatter",
        showInLegend: true,
        'name': 'Y',
        markerSize: 2,
        dataPoints: ypoints
      }]
    };
  }
});
