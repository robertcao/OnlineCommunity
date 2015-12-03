var profileApp = angular.module('profileApp', []);

profileApp.controller('ProfileController', ['$scope', '$http', function ($scope, $http) {
    $scope.message = "this is using AngularJS";
    $http.get("/products").then(function (response) {
        $scope.products = response.data;
    });

    $http.get("/api/courses").then(function (response) {
        $scope.courses = response.data;
    });

}]);


var courseApp = angular.module('courseApp', ['ui.bootstrap']);

courseApp.controller('CourseController', ['$scope', '$http', function ($scope, $http) {
    $scope.message = "inside course";
    $http.get("/products").then(function (response) {
        $scope.products = response.data;
    });

    $scope.selected = '';
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota',
        'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
        'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $http.get("/api/courses").then(function (response) {
        $scope.courses = response.data; //array of courses
    });



}]);


var courseCreateApp = angular.module('courseCreateApp', ['ngAnimate', 'ui.bootstrap', 'cgBusy']);

courseCreateApp.controller('CourseCreateController', ['$scope', '$http', function ($scope, $http) {

    $scope.course = {};
    $scope.isSaving = undefined;

    $scope.currentUser = {};
    $http.get("/api/user").then(function (response) {
        $scope.currentUser = response.data; //array of courses
        $scope.course.instructor = $scope.currentUser;
    });

    $scope.submitMyCourseForm = function () {

        $scope.isSaving = true;
        $scope.submitPromise = $http.post('/api/courses', $scope.course);
        $scope.submitPromise.success(function(data, status, headers, config) {
            $scope.message = data;
        });
        $scope.submitPromise.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
            $scope.isSaving = false;
        });
    }

}]);



courseCreateApp.controller('DatePickController', ['$scope', '$http', function ($scope, $http) {

    $scope.today = function () {
        $scope.course.startDate = new Date();
        $scope.course.endDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.course.starDate = null;
        $scope.course.endDate = null;
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

courseCreateApp.controller('TimePickController', ['$scope', '$http', function ($scope, $http) {

    //$scope.course.startTime = new Date();
    //$scope.course.endTime = new Date();

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
        console.log('Time start changed to: ' + $scope.course.startDate);
    };

    $scope.changedEnd = function () {
        console.log('Time end changed to: ' + $scope.course.endDate);
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };

}]);
