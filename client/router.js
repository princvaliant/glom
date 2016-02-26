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
      routePublic(this, 'konicaAnalysis');
  });
  this.route('/tdi', function () {
      routePublic(this, 'testVisualizationLatest');
  });
  this.route('/konica', function () {
    routePublic(this, 'konicaAnalysis');
  });
  this.route('/konicacharts', function () {
    routePublic(this, 'konicaCharts');
  });
  this.route('/dvd', function () {
    routePublic(this, 'dvdAnalysis');
  });
  this.route('/dvdif2v', function () {
    routePublic(this, 'dvdIF2V');
  });
  this.route('/couponYield', function () {
    routePublic(this, 'couponYield');
  });
  this.route('/testimages', function () {
    routePublic(this, 'testVisualization');
  });
});

