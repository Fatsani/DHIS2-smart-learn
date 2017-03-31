/* global angular */

'use strict';

/* Services */

var appSeedServices = angular.module('appSeedServices', ['ngResource']);

appSeedServices.factory('userManager', function ($http, $q, $location) {

    var userManager = {
        //get logged in user dettails
        getUserDetails: function () {
            var deferred = $q.defer();
            //console.log(dhis2.settings.baseUrl );
            $http.get(dhis2.settings.baseUrl  +'/../' +'../api/24/me.json?fields=code,name,displayName,surname,firstName,userCredentials[id,username]')
                .success(function (user) {
                    deferred.resolve(user);
                });
            return deferred.promise;
        }

    };
    return userManager;
});

appSeedServices.factory('coursesManager', function ($http, $q, $location, userManager) {
    var coursesManager = {
        //get all courses
        getCourses: function () {
            var deferred = $q.defer();

            $http.get(dhis2.settings.baseUrl  +'/../' +'../api/systemSettings/VJFS_courses')
                .success(function (courses) {
                    deferred.resolve(courses);
                });
            return deferred.promise;
        }

    };
    return coursesManager;
});

appSeedServices.factory('quizesManager', function ($http, $q, $location, userManager,coursesManager) {
    var quizesManager = {
        //get all quizes
        getQuizes: function () {
            var deferred = $q.defer();

            $http.get(dhis2.settings.baseUrl  +'/../' +'../api/systemSettings/VJFS_quizes')
                .success(function (quizes) {
                    deferred.resolve(quizes);
                });
            return deferred.promise;
        },
        //get user quizes
        getUserQuizes:function (username) {
          var deferred = $q.defer();
          $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/VJFS_'+username+'_quizes')
              .success(function (quizes) {
                  deferred.resolve(quizes);
              });
          return deferred.promise;
        },
        saveCompletedQuiz:function (quizes,username){
          var deferred = $q.defer();
          $http.post(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/VJFS_'+username+'_quizes',quizes)
              .success(function (response) {
                  deferred.resolve(response);
              });
          return deferred.promise;
        }
    };

    return quizesManager;
});

appSeedServices.factory('questionsManager', function ($http, $q, $location, userManager,coursesManager,quizesManager) {
    var questionsManager = {
          //get all questions
        getQuestions: function () {
            var deferred = $q.defer();
            $http.get(dhis2.settings.baseUrl  +'/../' +'../api/systemSettings/VJFS_questions')
                .success(function (questions) {
                    deferred.resolve(questions);
                });
            return deferred.promise;
        }
    };
    return questionsManager;
});
