Meteor.publish("konica", function(search) {

    var limit = 100;
    var q = {};

    if (search && search.text) {
        q.code = {
            $regex: '^' + search.text
        };
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
