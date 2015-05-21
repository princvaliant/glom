Meteor.publish("konica", function(query) {

    var limit = 100;
    var q = {};
    if (query && query.search) {
        q.code = {
            $regex: '^' + query.search
        };
        limit = 100;
    }

    return Konica.find(q, {
        limit: limit,
        sort: {
            'date': -1
        }
    });
});

Meteor.publish("konicaRaw", function(query, m) {
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

Meteor.publish("konicaData", function(code, testId, testType) {

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
