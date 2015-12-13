(function() {
    'use strict';
    var mainIndexApp = angular.module('categoryApp', ['ngAnimate', 'ui.bootstrap']);

    mainIndexApp.controller('mainSearchController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {


        $scope.currentUser = {};
        $http.get("/api/user").then(function (response) {
            $scope.currentUser = response.data;
        });

        $scope.typeahead = function(val) {
            return $http.get("/api/coursesbyname/"+val).then(function (response) {
                console.log(JSON.stringify(response.data));
                return response.data.map(function(course) {
                    return course.courseName;
                });
            });
        }

        $scope.queryCourse = function(val) {
            return $http.get("/api/coursesbyname/"+val).then(function (response) {
                $scope.selectedCourse = response.data[0];
                return response.data[0];
            });
        }

    }]);


    mainIndexApp.controller('loadCoursesController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

        var categoryParam = $location.search();
        //alert(JSON.stringify(courseIdParam));
        $scope.category = categoryParam.name;
        $http.get("/api/category/"+$scope.category).then(function (response) {
            $scope.listOfCourses = response.data;
            var i,j,temparray,chunk = 4;
            $scope.allCourseRows = [];
            for (i=0,j=$scope.listOfCourses.length; i<j; i+=chunk) {
                temparray = $scope.listOfCourses.slice(i,i+chunk);
                $scope.allCourseRows.push(temparray);
            }

        });

    }]);

    mainIndexApp.controller('indexRatingController', function ($scope) {
        $scope.courseRating = 5;
        $scope.courseRatingMax = 5;
        $scope.courseRatingIsReadOnly = true;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];
    });




})();
