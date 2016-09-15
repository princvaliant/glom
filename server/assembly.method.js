Meteor.methods({
    'getAssembly': function () {
        return Assembly.aggregate([{
                $match: {
                    'metpat.actualStart': {
                        $gt: moment().subtract(60, 'days').toDate()
                    }
                }
            }, {
                $sort: {
                    'expId': 1,
                    'code': 1
                }
            }
        ]);
    }
});
