addToSessionArray = function  (name, key, value) {
      var obj = Session.get(name);
      var o = obj[key];
      if (o) {
          var exist = _.filter(o, function(item) {
            return item[key] === value;
          });
          if (exist.length === 0) {
              var o2 = {};
              o2[key] = value;
              o.push(o2);
          }
      }
      Session.set(name, obj);
};

removeFromSessionArray = function  (name, key, value) {

      var obj = Session.get(name);
      var o = obj[key];
      if (o) {
          o = _.filter(o, function(item) {
            return item[key] !== value;
          });
          obj[key] = o;
      }
      Session.set(name, obj);
};
