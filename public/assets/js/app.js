var profileApp = angular.module('profileApp', []);

profileApp.controller('ProfileController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.message = "this is using AngularJS";
    $scope.currentUser = {};

    var userIdParam = $location.search();
    //alert(JSON.stringify(courseIdParam));
    $scope.instructorid = userIdParam.instructorid;

    if ($scope.instructorid == undefined) {
        $http.get("/api/user").then(function (response) {
            $scope.currentUser = response.data;
            $http.get("/api/courses/" + $scope.currentUser.user_name).then(function (response) {
                $scope.courses = response.data;
            });
            var learnerPromise = $http.get("/api/courses/registered/" + $scope.currentUser.id);
            learnerPromise.success(function(data) {
                if (typeof data !== 'undefined' && data.length > 0) {
                    $scope.registeredCourses = data;
                }
            });
            $scope.isInstructor = true;
        });
    }
    else {
        $http.get("/api/courses/instructor/" + $scope.instructorid).then(function (response) {
            $scope.courses = response.data;
        });
        $scope.isInstructor = false;
    }
}]);


var courseApp = angular.module('courseApp', ['ui.bootstrap']);

courseApp.controller('CourseController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
    $scope.message = "inside course";
    var courseIdParam = $location.search();
    //alert(JSON.stringify(courseIdParam));
    $scope.courseId = courseIdParam.courseId;
    if ($scope.courseId != undefined) {
        $http.get("/api/course/" + $scope.courseId).then(function (response) {
            $scope.courseDetail = response.data;

            var instructorPromise = $http.get("/api/user/username/" + $scope.courseDetail.instructor);
            instructorPromise.success(function(data) {
                console.log(JSON.stringify(data));
                $scope.instructor = data;
            });

            var lessonPromise = $http.get("/api/lesson/" + $scope.courseDetail.id);
            lessonPromise.success(function(data) {
                $scope.lessons = data;
            });

            $scope.goCreateLesson = function() {
                $window.location.href = '/lessoncreate#?courseId=' + $scope.courseDetail.id;
            }

            //further fetch lessons here
            //$scope.lessons = [
            //    {
            //        'id': '10001',
            //        'topic': 'Introduction',
            //        'available_time': $scope.courseDetail.startDate,
            //        'description' : 'first lesson meet the class'
            //    },
            //    {
            //        'id': '10002',
            //        'topic': 'Learn the tools',
            //        'available_time': $scope.courseDetail.startDate,
            //        'description' : 'learn how to use the tools for development'
            //    },
            //    {
            //        'id': '10003',
            //        'topic': 'Hands on implementation',
            //        'available_time': $scope.courseDetail.startDate,
            //        'description' : 'actual implementation'
            //    },
            //    {
            //        'id': '10004',
            //        'topic': 'Apply what you have learned',
            //        'available_time': $scope.courseDetail.startDate,
            //        'description' : 'DIY'
            //    }
            //]

            $scope.currentUser = {};
            $http.get("/api/user").then(function (response) {
                $scope.currentUser = response.data;
                if ($scope.courseDetail.instructor == $scope.currentUser.user_name) {
                    $scope.isUserInstructor = true;
                }
                else {
                    $scope.isUserInstructor = false;
                }
                if (!$scope.isUserInstructor) {

                    var learnerPromise = $http.get("/api/courses/registered/" + $scope.currentUser.id);
                    learnerPromise.success(function(data) {
                        //check if the registered list of courses contains this one
                        if (typeof data !== 'undefined' && data.length > 0) {
                            for (var i in data) {
                                if (data[i].id == $scope.courseDetail.id) {
                                    $scope.isUserRegistered = true;
                                    console.log('this user already registered');
                                    break;
                                }
                            }
                        }

                    });


                    $scope.takeThisCourseForm = function () {
                        $scope.takeCoursePromise = $http.post('/api/course/take/'+$scope.currentUser.id+'/'+$scope.courseDetail.id);
                        $scope.takeCoursePromise.success(function(data, status, headers, config) {
                            console.log("registration successful: " + data);
                            //$window.location.href = '/course#?courseId=' + data.id;
                            alert( "Thank you for: " + $scope.currentUser.first_name + " for registerating this course: " + $scope.courseDetail.courseName);
                            $scope.isUserRegistered = true;

                        });
                        $scope.takeCoursePromise.error(function(data, status, headers, config) {
                            alert( "registration failure message: " + JSON.stringify({data: data}));
                            //$scope.isSaving = false;
                        });
                    }

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

courseApp.controller('urlCtrl', function ($scope, $log, $window) {
    $scope.ToVideo = function () {
        var url = "http://ec2-52-11-111-157.us-west-2.compute.amazonaws.com/playvideo#" + $scope.lesson.id + ".mp4";
        $log.log(url);
        $window.location.href = url;
    };

    $scope.ToClass = function () {
        var url = "https://ec2-52-11-111-157.us-west-2.compute.amazonaws.com/#" + $scope.lesson.id + "#" + $scope.currentUser.user_name + "#" + $scope.isUserInstructor;
        $log.log(url);
        $window.location.href = url;
    };

    $scope.ToIntro = function () {
        var url = "https://ec2-52-11-111-157.us-west-2.compute.amazonaws.com/course#" + $scope.courseId;
        $log.log(url);
        $window.location.href = url;
    };
});


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





