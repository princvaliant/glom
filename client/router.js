Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'template404'
});

var routeSecure = function (self, route) {
  if (Meteor.userId()) {
    self.layout('layoutSecure');
    self.render(route);
  } else {
    self.layout('layoutPublic');
    self.render('signUp');
  }
};

var routePublic = function (self, route) {
  self.layout('layout');
  self.render(route);
};

Router.map(function () {
  this.route('/', function () {
      routePublic(this, 'dashboard');
  });
  this.route('/tdi', function () {
      routePublic(this, 'testVisualizationLatest');
  });
  this.route('/dashboard', function () {
      routePublic(this, 'dashboard');
  });
  this.route('/testVisualization', function () {
    routePublic(this, 'testVisualization');
  });
  this.route('/konicaAnalysis', function () {
    routePublic(this, 'konicaAnalysis');
  });
  this.route('/testCharts', function () {
    routePublic(this, 'testCharts');
  });
});

