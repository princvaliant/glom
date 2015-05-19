ColorUniformity = function (testType, excludedSpots) {

  var u = Array();
  var v = Array();

  var rows = KonicaData.find({
    testType: testType + ' spots'
  }).fetch();

  for (var row in _.sortBy(rows, 'spot')) {
    u.push(rows[row].u);
    v.push(rows[row].v);
  }

  var calc = function (lst, p1, p2) {
    var du = 0;

    if (excludedSpots.indexOf(p1.toString()) >= 0 || excludedSpots.indexOf(p2.toString()) >= 0 ) {
        return undefined;
    }

    if (typeof lst[p1 - 1] === 'number' && typeof lst[p2 - 1] === 'number') {
      du = Math.pow(lst[p1 - 1] - lst[p2 - 1], 2);
    }
    return du;
  };

  var calculateArbitraryDiff = function () {
    var res = 0.0;
    var size = u.length;
    for (var i = 1; i <= size; i++) {
      for (var j = i + 1; j <= size; j++) {
        var d = Math.sqrt(calc(u, i, j) + calc(v, i, j));
        if (d !== undefined && d > res)
          res = d;
      }
    }
    return res;
  };

  var calculateAdjacentDiff = function () {
    var size = u.length;
    var cols = 9;
    var res = 0.0;
    for (var i = 1; i <= size; i++) {
      if (i + 1 <= size && i % cols !== 0) {
        var d = Math.sqrt(calc(u, i, i + 1) + calc(v, i, i + 1));
        if (d !== undefined && d > res)
          res = d;
      }
      if (i + cols <= size) {
        var d2 = Math.sqrt(calc(u, i, i + cols) + calc(v, i, i + cols));
        if (d2 !== undefined && d2 > res)
          res = d2;
      }
    }
    return res;
  };

  return {
    carb: calculateArbitraryDiff(),
    cadj: calculateAdjacentDiff()
  };
};
