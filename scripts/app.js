'use strict';

/* App Module */

var appSeed = angular.module('appSeed',
                    ['ui.bootstrap',
                     'ngRoute',
                     'ngCookies',
                     'ngSanitize',
                     'appSeedDirectives',
                     'mainControllers',
                     'appSeedServices',
                     'appSeedFilters',
                     'd2Services',
                     'd2Controllers',
                     'pascalprecht.translate',
                     'd2HeaderBar'])

.value('DHIS2URL', '../'+dhis2.settings.baseUrl)

.config(function($translateProvider,$routeProvider) {

	$routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'UserMainController'
    }).when('/userCourses', {
        templateUrl: 'views/User/userCourses.html',
        controller: 'listUserCoursesController'
    }).when('/userCourses/:courseId/Quizes/:quizeId/questions', {
        templateUrl: 'views/User/quizQuestions.html',
        controller: 'quizeQuestionsController'
    })
    .otherwise({
        redirectTo : '/'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});
