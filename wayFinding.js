
var app = angular.module('wayFindingApp', []);

app.controller('WayFindingCtrl', function($scope) {
    // angular.element(document).ready(function() {
    // $scope.load();
    // });

    // $http.get('TestMap.svg').success(function(data) {
    // alert("funkar");
    // $scope.persons = data['items'];
    // //alert(data['userId']);
    // $scope.userId = data['userId'];
    // });

    $scope.load = function() {
        $scope.log = "";

        $scope.mainlineHolder = document.getElementById('mainline');
        $scope.mainline = $scope.mainlineHolder.children[0];

        $scope.lines = $scope
                .getSmallLines(document.getElementById('lines').children);

        var mainlineParts = $scope
                .getMainlineParts($scope.mainline.pathSegList);
        document.getElementById('mainline').remove();

        $scope.lines = $scope.changeDirectionOfSmallLines($scope.lines,
                mainlineParts);

        angular.forEach($scope.lines, function(line) {
            $scope.log += line + ";   ";

        });

        var choppedMainlines = $scope.createMainlines(mainlineParts);

        angular.forEach(choppedMainlines, function(choppedLines) {
            angular.forEach(choppedLines, function(choppedLine) {
                var svg = document.getElementsByTagName('svg')[0]; // Get svg element
                var newElement = document.createElementNS(
                        "http://www.w3.org/2000/svg", 'path'); // Create a path in SVG's namespace
                var path = "M " + choppedLine[0][0] + "," + choppedLine[0][1]
                          + " " + choppedLine[1][0] + "," + choppedLine[1][1];
                newElement.setAttribute("d", path);
                newElement.style.stroke = "#0f0";
                newElement.style.strokeWidth = "4px";
                svg.appendChild(newElement);
            });
        });
    }

    $scope.getMainlineParts = function(points) {
        var parts = new Array();
        var start = null;
        var end = null;
        
        $.each(points, function(index, value) {
            if (start == null) {
                start = new Array();
                start.push(value.x);
                start.push(value.y);
            } else {
                end = new Array();
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

        $.each(gLines, function(index, value) {
            start = new Array();
            start.push(value.pathSegList[0].x);
            start.push(value.pathSegList[0].y);

            end = new Array();
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
    	for( var i = 0; i < smallLines.length; i++) {
    		var smallLine = smallLines[i];
        	alert("smallLine: " + smallLine);
            directedSmallLine = new Array();
            for( var j = 0; j < mainlineParts.length; j++) {
            	var mainline = mainlineParts[j];
            	alert("mainline: " + mainline);
                if ($scope.pointIsOnLine(smallLine[0], mainline[0], mainline[1])) {
                    directedSmallLine.push(smallLine[0]);
                    directedSmallLine.push(smallLine[1]);
                    directedSmallLines.push(directedSmallLine);
                    continue;
                } else if ($scope.pointIsOnLine(smallLine[1], mainline[0], mainline[1])) {
                    directedSmallLine.push(smallLine[1]);
                    directedSmallLine.push(smallLine[0]);
                    directedSmallLines.push(directedSmallLine);
                    continue;
                }
            }
        }
        return directedSmallLines;
    };

    $scope.pointIsOnLine = function(point, lineStart, lineEnd) {
    	alert("lineStart: " + lineStart);
    	alert("lineEnd  : " + lineEnd);
        deltaY = lineEnd[1] - lineStart[1]
        deltaX = lineEnd[0] - lineStart[0];

        if (deltaX == 0) {
            if (point[0] == lineStart[0]) {
            	alert("true");
                return true;
            }
            alert("false");
            return false;
        }
        k = deltaY / deltaX;
        m = lineEnd[1] - k * lineEnd[0];

        if (point[1] == k * point[0] + m) {
            return true;
        }
        return false;
    };

    $scope.createMainlines = function(mainlineParts) {
        var lines = [];
        angular.forEach(mainlineParts, function(part) {
            var innerLines = $scope.createMainlinesInner(part);
            lines.push(innerLines);
        });
        return lines;
    }

    $scope.createMainlinesInner = function(mainline) {
        var lines = [];
        var smallLines = $scope.removeNotOnLine(mainline, $scope.lines);
        smallLines = $scope.sortByDistance(mainline[0], smallLines);
        var start = mainline[0];

        angular.forEach(smallLines, function(smallLine) {
            end = smallLine[0];
            lines.push([ start, end ]);
            start = end;
        });
        if (mainline[1] != start && mainline[1] != end) {
            end = mainline[1];
            lines.push([ start, end ]);
        }
        return lines;
    }

    $scope.removeNotOnLine = function(mainline, lines) {
        onLines = [];
        angular.forEach(lines, function(line) {
            if ($scope.pointIsOnLine(line[0], mainline[0], mainline[1])) {
                onLines.push(line);
            }
        });
        return onLines;
    }

    $scope.sortByDistance = function(point, listOfLines) {
        listOfLines = qsort(listOfLines, $scope.distance, point);
        return listOfLines;
    }

    $scope.distance = function(pointA, pointB) {
        return Math.sqrt(Math.pow(pointA[0] - pointB[0], 2)
                + Math.pow(pointA[1] - pointB[1], 2));
    }

    qsort = function(listOfLines, func, point) {
        if (listOfLines.length == 0)
            return [];

        var left = [], right = [], pivot = func(point, listOfLines[0][0]);

        for (var i = 1; i < listOfLines.length; i++) {
            func(point, listOfLines[i][0]) < pivot ? left.push(listOfLines[i])
                    : right.push(listOfLines[i]);
        }
        var newList = [];
        var leftSide = qsort(left, func, point);
        var rightSide = qsort(right, func, point);
        if (leftSide.length > 0) {
            newList = newList.concat(leftSide);
        }
        newList.push(listOfLines[0]);
        if (rightSide.length > 0) {
            newList = newList.concat(rightSide);
        }
        return newList;
    }
    
    $scope.pathClick = function(name) {
        if (name.endsWith("Line") || name.endsWith("main")) {
            return;
        }
        var line = document.getElementById(name + 'Line').pathSegList;
        start = [line[0].x, line[0].y];
        end = [line[1].x, line[1].y];
        alert(start + "; "+ end);
    }
});

