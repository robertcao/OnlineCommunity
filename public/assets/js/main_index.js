(function() {
    'use strict';
    var mainIndexApp = angular.module('mainIndexApp', ['ngAnimate', 'ui.bootstrap']);

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
        $http.get("/api/courses").then(function (response) {
            $scope.listOfCourses = response.data
        });

    }]);



})();
