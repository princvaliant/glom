UI.registerHelper('formatNum', function (context, options) {
  if (context) {
    if (context > 100)
      return context.toFixed(1);

    if (context < 1)
      return context.toFixed(3);
    return context.toFixed(2);
  }
  return context;
});

Template.konicaAnalysis.rendered = function () {

  Measure(this);

  $("#slider").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 100,
    from: 0,
    to: 100,
    prefix: "",
    onChange: function (data) {
      throttledSlider(data);
    }
  });

  // Subscribe to search packages
  this.autorun(function () {
    var search = Session.get("searchPackage");
    Meteor.subscribe("konica", {
      search: search
    });
  });

  // When package selected or measure changed
  this.autorun(function () {
    var konica2 = Session.get("selectedPackage");
    if (konica2) {
      var measure = Session.get("measure");
      Meteor.subscribe("konicaRaw", {
        code: konica2.code,
        testId: konica2.testId
      }, measure);
    }
  });
};

Template.konicaAnalysis.helpers({
  konica: function () {
    return Konica.find();
  },
  konicaInfo: function () {
    return Session.get("selectedPackage");
  },
  image: function () {

    var row = KonicaRaw.findOne();

    var from = Session.get('from' + Session.get("measure"));
    var to = Session.get('to' + Session.get("measure"));
    var meas = Session.get("measure");

    if (row) {
      var f = row[meas];
      if (f) {
        //     console.log(row['from' + meas] + ' ' + row['to' + meas] + ' ' + row._id);

        var w = f.length;
        var h = f[0].length;
        var min = 100000000;
        var max = 0;
        var bmp = new image(w, h);
        setImageHeader(bmp);

        for (var ny = 0; ny < 0 + h; ny++) {
          for (var nx = 0; nx < 0 + w; nx++) {
            if (f[nx][ny] < min && f[nx][ny] > 0) min = f[nx][ny];
            if (f[nx][ny] > max && f[nx][ny] > 0) max = f[nx][ny];
          }
        }

        var tr = to || max;
        var fr = from || min;
        var scale = chroma.scale(['blue', 'green', 'red']).domain([fr, tr]);

        for (var ny1 = 0; ny1 < 0 + h; ny1++) {
          for (var nx1 = 0; nx1 < 0 + w; nx1++) {
            var ny2 = h - 1 - ny1;
            bmp.data[ny2 * bmp.width + nx1] = calcColor(f[nx1][ny1], scale, fr, tr);
          }
        }

        var slider = $("#slider").data("ionRangeSlider");
        slider.update({
          min: min,
          max: max,
          from: fr,
          to: tr,
          step: 0.001
        });

        if (window.btoa !== undefined) {
          return 'data:image/bmp;base64,' + btoa(bmp.header + bmp.data.join(""));
        } else {
          return 'data:image/bmp;base64,' + $.base64.encode(bmp.header + bmp.data.join(""));
        }
      }
      return null;
    }
  },
  sCode: function () {
    var s = Session.get("selectedPackage");
    return s ? s.code : 'NONE';
  },
  sTestId: function () {
    var s = Session.get("selectedPackage");
    return s ? s.testId : 'NONE';
  },
  scales: function () {
    var scale = chroma.scale(['blue', 'green', 'red']).domain([0, 340]);
    var ret = new Array();
    for (var i = 0; i < 410; i += 5) {
      ret.push({
        s: i,
        s1: i + 5,
        col: scale(i)
      });
    }
    return ret;
  }
});

Template.konicaAnalysis.events({
  'keyup .searchPackage': function (evt, template) {
    throttledSearchPackage(template);
  },
  'click .package': function (evt) {
    Session.set("selectedPackage", this);
  },
  'change .measure': function (evt, template) {
    Measure(template);
  }
});

var throttledSearchPackage = _.debounce(searchPackage, 250);
var throttledSlider = _.debounce(Slider, 850);

function searchPackage(template) {
  Session.set('searchPackage', template.find('.searchPackage').value);
}

function Slider(data) {

  Session.setPersistent('from' + Session.get("measure"), data.from);
  Session.setPersistent('to' + Session.get("measure"), data.to);

  // var obj = {};
  // obj['from' + Session.get("measure")] = data.from;
  // obj['to' + Session.get("measure")] = data.to;
  // var kr = KonicaRaw.findOne();
  // if (kr) {
  //   KonicaRaw.update(kr._id, {
  //     $set: obj
  //   });
  // }
}

function Measure(template) {
  var sel = template.find('.measure').value;
  var m = '3';
  if (sel == 'x') m = '4';
  if (sel == 'y') m = '5';
  if (sel == 'tcp') m = '8';
  Session.set('measure', m);
}

function calcColor(val, scale, fr, tr) {
  if (val < 0)
    return String.fromCharCode(0, 0, 0, 1);
  var r = scale(val);
  return String.fromCharCode(r._rgb[2], r._rgb[1], r._rgb[0], 0);
}
