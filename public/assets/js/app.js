var profileApp = angular.module('profileApp', []);

profileApp.controller('ProfileController', ['$scope', '$http', function ($scope, $http) {
    $scope.message = "this is using AngularJS";
    $scope.currentUser = {};
    $http.get("/api/user").then(function (response) {
        $scope.currentUser = response.data;
        $http.get("/api/courses/" + $scope.currentUser.user_name).then(function (response) {
            $scope.courses = response.data;
        });
    });
}]);


var courseApp = angular.module('courseApp', ['ui.bootstrap']);

courseApp.controller('CourseController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.message = "inside course";
    var courseIdParam = $location.search();
    //alert(JSON.stringify(courseIdParam));
    $scope.courseId = courseIdParam.courseId;
    if ($scope.courseId != undefined) {
        $http.get("/api/course/" + $scope.courseId).then(function (response) {
            $scope.courseDetail = response.data;


            //further fetch lessons here
            $scope.lessons = [
                {
                    'topic': 'Introduction',
                    'available_time': $scope.courseDetail.startDate,
                    'description' : 'first lesson meet the class'
                },
                {
                    'topic': 'Learn the tools',
                    'available_time': $scope.courseDetail.startDate,
                    'description' : 'learn how to use the tools for development'
                },
                {
                    'topic': 'Hands on implementation',
                    'available_time': $scope.courseDetail.startDate,
                    'description' : 'actual implementation'
                },
                {
                    'topic': 'Apply what you have learned',
                    'available_time': $scope.courseDetail.startDate,
                    'description' : 'DIY'
                }
            ]

            $scope.currentUser = {};
            $http.get("/api/user").then(function (response) {
                $scope.currentUser = response.data;
                if ($scope.courseDetail.instructor == $scope.currentUser.user_name) {
                    $scope.isUserInstructor = true;
                }
                else {
                    $scope.isUserInstructor = false;
                }

            });




        });
    }





}]);

courseApp.controller('DropdownController', ['$scope', function ($scope) {
    $scope.videoButtonItems = [
        'Record',
        'upload',
        'Share Desktop'
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
}]);


courseApp.controller('ratingController', function ($scope) {
    $scope.courseRating = 5;
    $scope.courseRatingMax = 5;
    $scope.courseRatingIsReadOnly = false;

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

courseApp.controller('SignUpDatePickController', ['$scope', '$http', function ($scope, $http) {

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
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




var courseCreateApp = angular.module('courseCreateApp', ['ngAnimate', 'ui.bootstrap', 'cgBusy']);

courseCreateApp.controller('CourseCreateController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

    $scope.course = {};
    $scope.isSaving = undefined;

    $scope.currentUser = {};
    $http.get("/api/user").then(function (response) {
        $scope.currentUser = response.data;
        $scope.course.instructor = $scope.currentUser.user_name;
    });

    $scope.submitMyCourseForm = function () {

        $scope.isSaving = true;
        $scope.submitPromise = $http.post('/api/courses', $scope.course);
        $scope.submitPromise.success(function(data, status, headers, config) {
            $scope.message = data;
            $window.location.href = '/course#?courseId=' + data.id;

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





