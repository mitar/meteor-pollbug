Test = new Meteor.Collection('Test');

if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.subscribe('broken', {
      onError: function () {
        console.log('onError', arguments);
      },
      onReady: function () {
        console.log('onReady', arguments);
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
	if (Test.find({}).count() === 0) {
      Test.insert({ "importing" : [ { "foo": "a" }, { "foo": "b" } ], "jobs" : [ { "status" : "completed" } ] });
      Test.insert({ "importing" : [ { "foo": "b" } ], "jobs" : [ { "status" : "completed" } ] });
    }
  });

  Meteor.publish('broken', function () {
    return Test.find({ "importing.foo": "b" }, { fields: { jobs: { '$slice': -1 }, 'importing.$': 1 } });
  });

  Meteor.publish('all', function () {
    return Test.find({});
  });
}
