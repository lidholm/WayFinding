

describe('WayFindingCtrl', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.distance', function() {
    it('calculates the distance between two points on x axis', function() {
      var $scope = {};
      var controller = $controller('WayFindingCtrl', { $scope: $scope });
      
      var pointA = [1,0];
      var pointB = [4,0];
      var distance = $scope.distance(pointA, pointB);
      expect(distance).toEqual(1);
    });
  });
});