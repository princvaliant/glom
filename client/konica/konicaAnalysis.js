UI.registerHelper('formatNum', function (context, options) {
  return formatNum(context);
});

Template.konicaAnalysis.created = function () {
  this.screenSize = "55";
  this.selectedPackage = new ReactiveVar({});
  this.selectedTestType = new ReactiveVar({});
  this.selectedTestType2 = new ReactiveVar({});
  this.excludedSpots = new ReactiveArray();
  this.customValues = new ReactiveVar({});
  this.isTop200 = new ReactiveVar();
};

Template.konicaAnalysis.rendered = function () {

  var self = this;
  Measure(self);

  console.log($("#slider"));

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
    if (self.subKon) {
      self.subKon.stop();
    }
    self.subKon = Meteor.subscribe("konica", search);
  });

  // When package selected  changed
  this.autorun(function () {

    document.getElementById('chartxy').innerHTML = '';

    var selpkg = self.selectedPackage.get();
    if (selpkg) {
      self.isTop200.set(selpkg.top200);
      var measure = Session.get("measure");
      if (self.subRaw) {
        self.subRaw.stop();
      }
      self.subRaw = Meteor.subscribe("konicaRaw", {
        code: selpkg.code,
        testId: selpkg.testId
      }, measure);
    }
  });

  // If test type changed or package selected changed
  this.autorun(function () {

    document.getElementById('chartxy').innerHTML = '';

    var selpkg = self.selectedPackage.get();
    var testType = self.selectedTestType.get();
    if (!testType)
      self.excludedSpots.clear();
    if (selpkg && testType) {
      self.customValues.set({});
      if (self.sub)
        self.sub.stop();
      self.sub = Meteor.subscribe("konicaData",
        selpkg.code,
        selpkg.testId,
        testType + ' spots',
        function () {
          self.selectedTestType2.set(testType);
        });
    }

  });
};

Template.konicaAnalysis.helpers({
  konica: function () {
    return Konica.find();
  },
  konicaInfo: function () {
    return Template.instance().selectedPackage.get();
  },
  dim: function () {
    return imgDim();
  },
  carb_custom: function () {
    return Template.instance().customValues.get().carb;
  },
  cadj_custom: function () {
    return Template.instance().customValues.get().cadj;
  },
  spots: function () {

    Template.instance().customValues.set(
      ColorUniformity(Template.instance().selectedTestType2.get(), Template.instance().excludedSpots));

    return calculateSpots(
      Template.instance().screenSize,
      Template.instance().selectedTestType2.get(),
      Session.get('measure2'),
      Template.instance().excludedSpots);
  },
  image: function () {

    var row = KonicaRaw.findOne();

    var from = Session.get('from' + Session.get("measure"));
    var to = Session.get('to' + Session.get("measure"));
    var meas = Session.get("measure");
    var isTop200 = Template.instance().isTop200.get();

    if (isTop200 === undefined && row !== undefined) {
      var f = row[meas];
      if (f) {
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
        var scale = chroma.scale(['red', 'green', 'blue']).domain([fr, tr]);

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
    } else if (isTop200) {
      var hh = 554,
        ww = 317;
      var scale2 = chroma.scale(['red', 'green', 'blue']).domain([1, 20]);
      var bmp2 = new image(ww, hh);
      setImageHeader(bmp2);
      for (var y1 = 0; y1 < hh; y1++) {
        for (var x1 = 0; x1 < ww; x1++) {
          bmp2.data[y1 * ww + x1] = calcColor(10, scale2, 1, 20);
        }
      }
      return 'data:image/bmp;base64,' + btoa(bmp2.header + bmp2.data.join(""));
    }
  },
  sCode: function () {
    var s = Template.instance().selectedPackage.get();
    return s ? s.code : 'NONE';
  },
  sTestId: function () {
    var s = Template.instance().selectedPackage.get();
    return s ? s.testId : 'NONE';
  },
  scales: function () {
    var scale = chroma.scale(['red', 'green', 'blue']).domain([0, 420]);
    var ret = Array();
    for (var i = 0; i < 460; i += 5) {
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
  'change .testSource': function (evt, template) {
    throttledSearchPackage(template);
  },
  'click .package': function (evt, template) {

    evt.target.className += " active";
    template.selectedPackage.set(this);

  },
  'change .measure': function (evt, template) {
    Measure(template);
  },
  'click input[type=radio]': function (evt, template) {
    template.selectedTestType.set(evt.target.value);
  },
  'click .imagecont': function (evt, template) {
    var selpkg = template.selectedPackage.get();
    if (selpkg) {
      var x = evt.originalEvent.layerX;
      var y = evt.originalEvent.layerY;
      Meteor.call('histogram', selpkg.code, selpkg.testId, Session.get("measure"), x, y, function (error, data) {
        if (document.querySelector('#chartxy') !== null) {
          var chart = new CanvasJS.Chart('chartxy', data);
          chart.render();
        }
      });
    }
  },
  'click .spot': function (evt, template) {
    var n = evt.target.attributes.value.value;
    var i = template.excludedSpots.indexOf(n);
    if (i === -1) {
      template.excludedSpots.push(n);
    } else {
      template.excludedSpots.splice(i, 1);
    }
  },
  'click .excel-export': function (evt, template) {
    var row = KonicaRaw.findOne();
    var meas = Session.get("measure");
    if (row !== undefined) {
      var f = row[meas];
      if (f) {
        var w = f.length;
        var h = f[0].length;
        var ret = '';
        for (var ny1 = 5; ny1 < h - 10; ny1++) {
          var r = '';
          for (var nx1 = 5; nx1 < w - 10; nx1++) {
            r += f[nx1][ny1] + ',';
          }
          ret += r + '\n';
        }
        // Create link.
        a = document.createElement("a");
        // Set link on DOM.
        document.body.appendChild(a);
        // Set link's visibility.
        a.style = "display: none";
        // Set href on link.
        a.href = encodeURI('data:text/csv;' + ret);
        // Set file name on link.
        a.download = template.selectedPackage.get().code + '_' + template.find('.measure').value + '.csv';
        // Trigger click of link.
        a.click();
      }
    }
  }
});

var throttledSearchPackage = _.debounce(searchPackage, 250);
var throttledSlider = _.debounce(Slider, 850);

function searchPackage(template) {
  var obj = {};
  obj.text = template.find('.searchPackage').value;
  obj.testSource = template.find('.testSource').value;
  Session.set('searchPackage', obj);
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
  Session.set('measure2', sel);
}

function calcColor(val, scale, fr, tr) {
  if (val < 0)
    return String.fromCharCode(0, 0, 0, 1);
  var r = scale(val);
  return String.fromCharCode(r._rgb[2], r._rgb[1], r._rgb[0], 0);
}

function imgDim() {
  var row = KonicaRaw.findOne();
  var isTop200 = Template.instance().isTop200.get();
  if (isTop200 === undefined && row !== undefined) {
    var f = row['3'] || row['4'] || row['5'] || row['8'];
    if (f) {
      var w = f.length;
      var h = f[0].length;
      return {
        w: w,
        h: h
      };
    }
  } else {
    return {
      w: 317,
      h: 554
    };
  }
  return undefined;
}

function calculateSpots(screenSize, testType, meas, excludedSpots) {

  var data = Array();
  var spots = Spots[screenSize][testType];
  var dim = imgDim();
  var fontSize = 8;

  if (testType === undefined || testType === '' || spots === undefined || dim === undefined)
    return data;

  var rows = KonicaData.find({
    testType: testType + ' spots'
  }).fetch();

  if (spots.manual) {

    for (var i in spots.manual) {
      var v = spots.manual[i];
      var rec = _.findWhere(rows, {
        spot: parseInt(i)
      });
      if (rec) {
        var obj = {
          x: v.l + 8,
          xt: v.l + 17 - spots.height / 2,
          y: v.t + 8,
          yt: v.t + 12,
          r: spots.height / 2,
          d: spots.height + 1,
          opacity: excludedSpots.indexOf(i.toString()) >= 0 ? 1 : 0,
          v: formatNum(rec[meas]),
          fs: fontSize,
          idx: i
        };
        data.push(obj);
      }
    }
  } else if (spots.offset) {

    var effWidth = dim.w - 16 - spots.offset.left - spots.offset.right;
    var effHeight = dim.h - 16 - spots.offset.top - spots.offset.bottom;
    var distx = effWidth / (spots.col - 1 || 1);
    var disty = effHeight / (spots.row - 1 || 1);

    var xt = spots.offset.left - 2;
    var yt = spots.offset.top + 20;
    if (testType === '50') {
      xt = spots.offset.left + 10 + spots.height / 2;
      yt = spots.offset.top + 10;
    }
    if (testType === '69') {
      fontSize = 4;
      xt = spots.offset.left + spots.height / 2;
      yt = spots.offset.top + 14;
    }

    var n = 1;
    for (var r = spots.row - 1; r >= 0; r--) {
      for (var c = 0; c <= spots.col - 1; c++) {
        var rec2 = _.findWhere(rows, {
          spot: n
        });
        if (rec2) {
          var obj2 = {
            x: spots.offset.left + 8 + c * distx,
            xt: xt + c * distx,
            y: spots.offset.top + 8 + r * disty,
            yt: yt + r * disty,
            r: spots.height / 2,
            d: spots.height + 1,
            opacity: excludedSpots.indexOf(n.toString()) >= 0 ? 1 : 0,
            v: formatNum(rec2[meas]),
            fs: fontSize,
            idx: n
          };
          data.push(obj2);
        }
        n++;
      }
    }
  }
  return data;
}

function formatNum(context) {
  if (context) {
    if (context > 100)
      return context.toFixed(0);

    if (context < 1)
      return context.toFixed(3);
    return context.toFixed(2);
  }
  return context;
}
