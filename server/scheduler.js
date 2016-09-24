var exec = Npm.require('child_process').exec;

// Execute aggregation that stores result in separate collections

scheduler = {

  executeAggregate: function (collection, pipeline) {

    var ret = '';
    var aggr = process.env.MONGO_URL.replace('db://', ' ') + ' --eval \'db.' + collection + '.aggregate(' + pipeline + ', {allowDiskUse: true})\'';
    child = exec(aggr, function (error, stdout, stderr) {
      ret = 'stdout: ' + stdout + ' stderr: ' + stderr;
      if (error !== null) {
        ret += 'exec error: ' + error;
        console.log(ret);
      }
    });
  },
  executeMapReduce: function (collection, map, reduce, options) {
    var ret = '';
    var res = '';
    var regex = /\/\/\s\d+|\/\//g;
    var maps = (map + '').replace('map(', '(').replace(regex, '');
    var reduces = (reduce + '').replace('reduce(', '(').replace(regex, '');
    var conn = process.env.MONGO_URL.replace('db://', ' ');
    conn = conn.split((/[\s,?@$:]+/));

    var aggr = process.env.MONGO_URL.replace('db://', ' ') + ' --eval \'db.' + collection + '.mapReduce(' + maps + ', '  + reduces  + ', ' + options + ')\'';
    child = exec(aggr, function (error, stdout, stderr) {
      ret = 'stdout: ' + stdout + ' stderr: ' + stderr;
      if (error !== null) {
        ret += 'exec error: ' + error;
        console.log(error);
      }
    });
  }
};
