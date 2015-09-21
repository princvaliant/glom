var fs = Npm.require('fs');


Meteor.publish("searchTestDataImages", function () {
  var subscription = this;
  var cursor;
  var observeHandle;

  cursor = TestDataImages.find({}, {
    fields: {
      'experimentId': 1,
      'runNumber': 1,
      'code': 1,
      'testId': 1
    },
    sort : {
      'testId' : -1
    }
  });

  observeHandle = cursor.observe({
    added: function (doc, idx) {
      subscription.added("tdiSearchResult", doc.experimentId, {
        key: 'experimentId', testId: doc.testId
      });
      subscription.added("tdiSearchResult", doc.runNumber, {
        key: 'runNumber', testId: doc.testId
      });
      subscription.added("tdiSearchResult", doc.code, {
        key: 'code', testId: doc.testId
      });
    },
    changed: function (doc, idx) {
      subscription.changed("tdiSearchResult", doc.experimentId, {
        key: 'experimentId', testId: doc.testId
      });
      subscription.changed("tdiSearchResult", doc.runNumber, {
        key: 'runNumber', testId: doc.testId
      });
      subscription.changed("tdiSearchResult", doc.code, {
        key: 'code', testId: doc.testId
      });
    }
  });
  subscription.ready();

  subscription.onStop(function () {
    observeHandle.stop();
  });
});

Meteor.publish("queryTestDataImages", function (query) {

  var subscription = this;
  if (!query)
    return;
  var q = {};
  q[query.key] = query._id;

  tdis = TestDataImages.find(q).fetch();

  var uniqueTkey = _.uniq(tdis, function (item, key, a) {
    return item.tkey;
  });
  var uniqueCurrent = _.uniq(tdis, function (item, key, a) {
    return item.current;
  });
  var uniqueItem = _.uniq(tdis, function (item, key, a) {
    return item.item;
  });
  var uniqueCode = _.uniq(tdis, function (item, key, a) {
    return item.code;
  });

  subscription.added("tdiQueryResult", "tdi", {
    tkey: uniqueTkey,
    current: uniqueCurrent,
    item: uniqueItem,
    code: uniqueCode
  });
  subscription.ready();
});


Meteor.publish("testDataImages", function (query) {

  if (!query || !query.search)
    return;
  var q = {};
  q[query.search.key] = query.search._id;
  if (query.tkey && query.tkey.length > 0) {
    q.tkey = {
      $in: _.pluck(query.tkey, "tkey")
    };
  }
  if (query.current && query.current.length > 0) {
    q.current = {
      $in: _.pluck(query.current, "current")
    };
  }
  if (query.item && query.item.length > 0) {
    q.item = {
      $in: _.pluck(query.item, "item")
    };
  }
  if (query.code && query.code.length > 0) {
    q.code = {
      $in: _.pluck(query.code, "code")
    };
  }
  return TestDataImages.find(q);
});

Meteor.publish("testDataImagesLatest", function () {

  var q = {};
  q.item = 'EQE';
  return TestDataImages.find(q, {
    limit: 6,
    sort: {
      testId: -1,
      code: 1
    }
  });
});

WebApp.connectHandlers.use(function (req, res, next) {
  var re = /^\/uploads\/(.*)$/.exec(req.url);
  if (re !== null) { // Only handle URLs that start with /screenshots/*
    var filePath = (process.env.IMAGES_PATH || '/Volumes/MES_Backups/testDataImages/') + re[1];
    var data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'image'
    });
    res.write(data);
    res.end();
  } else { // Other urls will have default behaviors
    next();
  }
});
