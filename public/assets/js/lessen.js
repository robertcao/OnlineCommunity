(function() {
    'use strict';
    var lessenCreateApp = angular.module('lessenCreateApp', ['ngAnimate', 'ui.bootstrap', 'cgBusy']);

    lessenCreateApp.controller('lessenCreateController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

        $scope.lessen = {};
        $scope.isSaving = undefined;

        $scope.currentUser = {};
        $http.get("/api/user").then(function (response) {
            $scope.currentUser = response.data;
            $scope.lessen.instructor = $scope.currentUser;
        });

        $scope.submitMylessenForm = function () {

            $scope.isSaving = true;
            $scope.submitPromise = $http.post('/api/lessens', $scope.lessen);
            $scope.submitPromise.success(function (data, status, headers, config) {
                $scope.message = data;
                $window.location.href = '/lessen#?lessenId=' + data.id;

            });
            $scope.submitPromise.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
                $scope.isSaving = false;
            });
        }

    }]);


    lessenCreateApp.controller('DatePickController', ['$scope', '$http', function ($scope, $http) {

        $scope.today = function () {
            $scope.lessen.startDate = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.lessen.starDate = null;
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

    lessenCreateApp.controller('TimePickController', ['$scope', '$http', function ($scope, $http) {

        //$scope.lessen.startTime = new Date();
        //$scope.lessen.endTime = new Date();

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
            $scope.mytime = d;
            console.log('Time updated to:' + $scope.myTime);
        };

        $scope.changedStart = function () {
            console.log('Time start changed to: ' + $scope.lessen.startDate);
        };

        $scope.changedEnd = function () {
            console.log('Time end changed to: ' + $scope.lessen.endDate);
        };

        $scope.clear = function () {
            $scope.mytime = null;
        };

    }]);

})();