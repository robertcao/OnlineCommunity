(function() {
    'use strict';
    var lessonCreateApp = angular.module('lessonCreateApp', ['ngAnimate', 'ui.bootstrap', 'cgBusy']);

    lessonCreateApp.controller('lessonCreateController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

        $scope.lesson = {};
        $scope.isSaving = undefined;

        var courseIdParam = $location.search();
        //alert(JSON.stringify(courseIdParam));
        $scope.courseId = courseIdParam.courseId;
        if ($scope.courseId != undefined) {
            $http.get("/api/course/" + $scope.courseId).then(function (response) {
                $scope.courseDetail = response.data;

                $scope.currentUser = {};
                $http.get("/api/user").then(function (response) {
                    $scope.currentUser = response.data;
                    //$scope.lesson.instructor_name = $scope.currentUser.;
                });

                var lessonPromise = $http.get("/api/lesson/" + $scope.courseDetail.id);
                lessonPromise.success(function(data) {
                    $scope.lessons = data;
                });




                $scope.submitMylessonForm = function () {

                    $scope.isSaving = true;
                    $scope.lesson.course_id =  $scope.courseDetail.id;
                    $scope.lesson.course_name =  $scope.courseDetail.name;

                    $scope.submitPromise = $http.post('/api/lesson', $scope.lesson);
                    $scope.submitPromise.success(function (data, status, headers, config) {

                        $scope.message = data;
                        $window.location.href = '/course#?courseId=' + $scope.courseDetail.id;
                        //$window.location.href = '/lesson#?lessonId=' + data.id;

                    });
                    $scope.submitPromise.error(function (data, status, headers, config) {
                        alert("failure message: " + JSON.stringify({data: data}));
                        $scope.isSaving = false;
                    });
                }




            });
        }
        else {
            alert("you must pick a course first from profile page");
            $window.location.href = '/profile';

        }



    }]);


    lessonCreateApp.controller('DatePickController', ['$scope', '$http', function ($scope, $http) {

        $scope.today = function () {
            $scope.lesson.available_time = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.lesson.available_time = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];


    }]);

    lessonCreateApp.controller('TimePickController', ['$scope', '$http', function ($scope, $http) {

        //$scope.lesson.startTime = new Date();
        //$scope.lesson.endTime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function () {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function () {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.available_time = d;
            console.log('Time updated to:' + $scope.myTime);
        };

        $scope.changedStart = function () {
            console.log('Time start changed to: ' + $scope.lesson.available_time);
        };

        $scope.changedEnd = function () {
            console.log('Time end changed to: ' + $scope.lesson.endDate);
        };

        $scope.clear = function () {
            $scope.available_time = null;
        };

    }]);

})();