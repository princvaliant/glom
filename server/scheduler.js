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
  executeMapReduce: function (collection, mapreduce) {

    var ret = '';
    var aggr = process.env.MONGO_URL.replace('db://', ' ') + ' --eval \'db.' + collection + '.mapReduce(' + mapreduce + ')\'';
    child = exec(aggr, function (error, stdout, stderr) {
      ret = 'stdout: ' + stdout + ' stderr: ' + stderr;
      if (error !== null) {
        ret += 'exec error: ' + error;
        console.log(error);
      }
    });
  }
};
