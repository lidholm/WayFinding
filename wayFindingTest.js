
describe('WayFindingCtrl', function() {
    beforeEach(module('wayFindingApp'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter
        // names when matching
        $controller = _$controller_;
    }));

    describe('$scope.distance', function() {
        it('calculates the distance between two points on x axis', function() {
            var $scope = {};
            var controller = $controller('WayFindingCtrl', {
                $scope : $scope
            });

            var pointA = [ 1, 0 ];
            var pointB = [ 4, 0 ];
            var distance = $scope.distance(pointA, pointB);
            expect(distance).toEqual(3);
        });

        it('calculates the distance between two points on y axis', function() {
            var $scope = {};
            var controller = $controller('WayFindingCtrl', {
                $scope : $scope
            });

            var pointA = [ 0, 3 ];
            var pointB = [ 0, -3 ];
            var distance = $scope.distance(pointA, pointB);
            expect(distance).toEqual(6);
        });

        it('calculates the distance between two "random" points', function() {
            var $scope = {};
            var controller = $controller('WayFindingCtrl', {
                $scope : $scope
            });

            var pointA = [ 3, 2 ];
            var pointB = [ 9, 7 ];
            var distance = $scope.distance(pointA, pointB);
            expect(distance).toEqual(7.810249675906654);
        });

        it('calculates the distance between two other "random" points',
                function() {
                    var $scope = {};
                    var controller = $controller('WayFindingCtrl', {
                        $scope : $scope
                    });

                    var pointA = [ -3, 5 ];
                    var pointB = [ 7, -1 ];
                    var distance = $scope.distance(pointA, pointB);
                    expect(distance).toEqual(11.661903789690601);
                });
    });

    describe('sort list of points by distance from given point', function() {
        it('sort list of points', function() {
            var $scope = {};
            var controller = $controller('WayFindingCtrl', {
                $scope : $scope
            });

            var point = [ 1, 0 ];
            var list = new Array();
            var lineA = [ [ 4, 0 ], [ 9, 9 ] ];
            var lineB = [ [ 5, 0 ], [ 9, 9 ] ];
            var lineC = [ [ 3, 0 ], [ 9, 9 ] ];
            list.push(lineA);
            list.push(lineB);
            list.push(lineC);

            var distance = $scope.sortByDistance(point, list);
            var expected = new Array();
            expected.push(lineC);
            expected.push(lineA);
            expected.push(lineB);

            expect(distance).toEqual(expected);
        });
    });

    describe('change directions on small lines to go from the main line and to the shop', function() {
        it('changes the direction for one main line', function() {
            var $scope = {};
            var controller = $controller('WayFindingCtrl', {
                $scope : $scope
            });
            
            var list = new Array();
            var lineA = new Array();
            lineA.push([2,0]);
            lineA.push([4,0]);
            var lineB = new Array();
            lineB.push([4,0]);
            lineB.push([6,0])	;
            list.push(lineA);
            list.push(lineB);

            var mainlines = new Array();
            var mainline1 = [[4,-2], [4,4]];
            mainlines.push(mainline1);

            var directedLines = $scope.changeDirectionOfSmallLines(list, mainlines);
            
            var expected = new Array();
            var lineAOut = new Array();
            lineAOut.push([4,0]);
            lineAOut.push([2,0]);
            var lineBOut = new Array();
            lineBOut.push([4,0]);
            lineBOut.push([6,0])	;
            expected.push(lineAOut);
            expected.push(lineBOut);
            

            expect(directedLines).toEqual(expected);
        });
    });

});