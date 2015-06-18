

var app = angular.module( 'wayFindingApp', [] );

app.controller( 'WayFindingCtrl', function( $scope ) {
//	angular.element(document).ready(function() {
//		$scope.load();
//	});
	
//	$http.get('TestMap.svg').success(function(data) {
//		alert("funkar");
//	      $scope.persons = data['items'];
//	      //alert(data['userId']);
//	      $scope.userId = data['userId'];
//	    });
	
	$scope.load = function(){
		$scope.log = "";
		
        $scope.mainline = document.getElementById('mainline').children[0];
        
        $scope.lines = $scope.getSmallLines(document.getElementById('lines').children);
        
        var mainlineParts = $scope.getMainlineParts($scope.mainline.pathSegList);
        document.getElementById('mainline').remove();
        
        $scope.lines = $scope.changeDirectionOfSmallLines($scope.lines, mainlineParts);
        
        angular.forEach($scope.lines, function(line) {
        	$scope.log += line + ";   ";
        });
        
        $scope.createMainlines(mainlineParts);
        
    }
    
    $scope.getMainlineParts = function(points) {
        var parts = new Array();
        var start = null;
        var end = null;
        
        $.each( points, function( index, value ){
             if (start == null) {
               start = new Array();
               start.push(value.x);
               start.push(value.y);
             } else {
               end= new Array();
               end.push(value.x);
               end.push(value.y);
               
               pair = new Array();
               pair.push(start);
               pair.push(end);
               
               parts.push(pair);
               start = end;
             }
        });
        return parts;
    };
    
    $scope.getSmallLines = function(gLines) {
        lines = new Array();
        
        $.each( gLines, function( index, value ){
            start = new Array();
            start.push(value.pathSegList[0].x);
            start.push(value.pathSegList[0].y);
            
            end= new Array();
            end.push(value.pathSegList[1].x);
            end.push(value.pathSegList[1].y);
            
            pair = new Array();
            pair.push(start);
            pair.push(end);
            
            lines.push(pair);
        });
        return lines;
    };
    
    $scope.changeDirectionOfSmallLines = function(smallLines, mainlineParts) {
        var directedSmallLines = new Array();
        $.each(smallLines, function(i, smallLines) {
            directedSmallLine = new Array();
            $.each(mainlineParts, function(j, mainline) {
                if ($scope.pointIsOnLine(smallLines[0], mainline[0], mainline[1])) {
                    directedSmallLine.push(smallLines[0]);
                    directedSmallLine.push(smallLines[1]);
                    directedSmallLines.push(directedSmallLine);
                    return false;
                }
                else if ($scope.pointIsOnLine(smallLines[1], mainline[0], mainline[1])) {
                    directedSmallLine.push(smallLines[1]);
                    directedSmallLine.push(smallLines[0]);
                    directedSmallLines.push(directedSmallLine);
                    return false;
                }
            });
        });
        return directedSmallLines;
    };
    
    $scope.drawNewMainlines = function(mainlineParts, smallLines) {
        var mainlines = new Array();
        
        $.each(mainlineParts, function(i, part) {
            var breakpoints = new Array();
            breakpoints.push(part[0]);
            breakpoints.push(part[1]);
            $.each(smallLines, function(j, smallLine) {
                
                if ($scope.pointIsOnLine(smallLine[0], part[0], part[1])) {
                    breakpoints.push(smallLine[0]);
                }
                if ($scope.pointIsOnLine(smallLine[1], part[0], part[1])) {
                    breakpoints.push(smallLine[1]);
                }
            });
            breakpoints = $scope.removeDuplicatesAndSortPoints(breakpoints);
        });
        
    };
    
    $scope.pointIsOnLine = function(point, lineStart, lineEnd) {
        deltaY = lineEnd[1] - lineStart[1]
        deltaX = lineEnd[0] - lineStart[0];
        
        if (deltaX == 0) {
            if (point[0] == lineStart[0]) {
                return true;
            }
            return false;
        }
        k = deltaY / deltaX;
        m = lineEnd[1] - k * lineEnd[0];
        
        if (point[1] == k * point[0] + m) {
            return true;
        }
        return false;
    };
    
    $scope.removeDuplicatesAndSortPoints = function(breakpoints) {
        return $scope.unique(breakpoints);
    };
    
    $scope.unique = function(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }
    
    $scope.createMainlines = function(mainlineParts) {
    	var lines = [];
    	angular.forEach(mainlineParts, function(part) {
    		var innerLines = $scope.createMainlinesInner(part);
    	});
    }

    $scope.createMainlinesInner = function(mainline) {
    	var lines = [];
    	var smallLines = $scope.sortByDistance(mainline[0], $scope.lines);

    	alert(""+smallLines);
    }
    
    $scope.sortByDistance = function(point, list) {
    	list = qsort(list, $scope.distance, point);/*(function(a, b) {
    		return $scope.distance(point, a[0]) - $scope.distance(point, b[0]);
    	});*/
    	return list;
    }
    
    $scope.distance = function(pointA, pointB) {
    	return Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)); 
    }
    
    qsort = function (a, func, point) {
        if (a.length == 0) return [];
     
        var left = [], right = [], pivot = func(point, a[0][0]);
     
        for (var i = 1; i < a.length; i++) {
            func(point, a[i][0]) < pivot ? left.push(a[i]) : right.push(a[i]);
        }
     
        return qsort(left, func, point).concat(a[0], qsort(right, func, point));
    }
});


