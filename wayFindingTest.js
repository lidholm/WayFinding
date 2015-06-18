

describe('WayFindingCtrl', function() {
  beforeEach(module('wayFindingApp'));

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
      expect(distance).toEqual(3);
    });
    
    it('calculates the distance between two points on y axis', function() {
        var $scope = {};
        var controller = $controller('WayFindingCtrl', { $scope: $scope });
        
        var pointA = [0,3];
        var pointB = [0,-3];
        var distance = $scope.distance(pointA, pointB);
        expect(distance).toEqual(6);
      });

    it('calculates the distance between two "random" points', function() {
        var $scope = {};
        var controller = $controller('WayFindingCtrl', { $scope: $scope });
        
        var pointA = [3,2];
        var pointB = [9,7];
        var distance = $scope.distance(pointA, pointB);
        expect(distance).toEqual(7.810249675906654);
      });

    it('calculates the distance between two other "random" points', function() {
        var $scope = {};
        var controller = $controller('WayFindingCtrl', { $scope: $scope });
        
        var pointA = [-3,5];
        var pointB = [7,-1];
        var distance = $scope.distance(pointA, pointB);
        expect(distance).toEqual(11.661903789690601);
      });
  });
  
  describe('sort list of points by distance from given point', function() {
    it('sort list of points', function() {
      var $scope = {};
      var controller = $controller('WayFindingCtrl', { $scope: $scope });
      
      var point = [1,0];
      var list = new Array();
      list.push([[4,0], [9,9]]);
      list.push([[5,0], [9,9]]);
      list.push([[3,0], [9,9]]);

      var distance = $scope.sortByDistance(point, list);
      var expected = new Array();
      expected.push([3,0], [9,9]);
      expected.push([4,0], [9,9]);
      expected.push([5,0], [9,9]);
      
      
      expect(distance).toEqual(expected);
    });

  });
});