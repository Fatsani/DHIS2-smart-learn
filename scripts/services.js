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
        //get all user quizes
        getAllUserQuizes:function (allScores) {
          var topScore=[];
          var allArrays=[];
          var count=0;
          var deferred = $q.defer();
          function sendToArray(scores,count){
              
              topScore.push(scores.quizes.length);
              topScore.sort(function (b, a) {
                    return parseFloat(a) - parseFloat(b);
                });
                topScore = topScore.slice(0,3);
                  allArrays.push(topScore);
                  if(typeof allArrays[count]=='undefined'){
                  }
                  else {
                    deferred.resolve(allArrays[count]);
                  }
                return topScore;
          }
          $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/')
              .success(function (allQuizes) {
                  count=allQuizes.length-1;
                for (var i = 0; i <allQuizes.length; i++) {
                    if(allQuizes[i]=="mentors"){
                        count=count-1;
                    }
                    else{
                  $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/'+allQuizes[i])
                      .success(function (scores){
                         sendToArray(scores,count);

                      });
                    }
                 
                    }
                });
          return deferred.promise;
        },
        /*get specific user scores
        getUserScores:function(userUrl){
          var deferred = $q.defer();
          $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/'+userUrl)
              .success(function (scores) {
                  deferred.resolve(scores);
              });
          return deferred.promise;
        },
        */
        //get user quizes
        getUserQuizes:function (username) {
          var deferred = $q.defer();
          $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/VJFS_'+username+'_quizes')
              .success(function (quizes) {
                  deferred.resolve(quizes);
              });
          return deferred.promise;
        },
        //save quizes
        saveCompletedQuiz:function (quizes,username){
          var deferred = $q.defer();
          $http.put(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/VJFS_'+username+'_quizes',quizes)
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

//mentors
appSeedServices.factory('mentorsManager', function ($http, $q, $location, userManager,coursesManager,quizesManager) {
    var mentorsManager = {
        //get course
        getUserCourses: function () {
            var deferred = $q.defer();
           $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/')
                .success(function (data) {
                    deferred.resolve(data);
                }).error(console.log("error"));
            return deferred.promise;
        },
        //get mentors
        getCourseMentor: function () {
            var deferred = $q.defer();
           $http.get(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/mentors')
                .success(function (data) {
                    deferred.resolve(data);
                }).error(console.log("error"));
            return deferred.promise;
        },
        //save mentors for course
        saveCourseMentor: function (mentorToPost,action) {
            var deferred = $q.defer();
           if(action==1){
            $http.post(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/mentors',mentorToPost)
                .success(function (response) {
                    deferred.resolve(response);
                });
           }
           else {
            $http.put(dhis2.settings.baseUrl  +'/../' +'../api/dataStore/coursetaker/mentors',mentorToPost)
                .success(function (response) {
                    deferred.resolve(response);
                });
           }
           
            return deferred.promise;
        }
    };
    return mentorsManager;
});
