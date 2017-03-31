/* global angular */

'use strict';

angular.module('listUserCoursesController', [])
//User main controller
.controller('listUserCoursesController', function ($scope, $window, $timeout, $location, ModalService, $routeParams,userManager,coursesManager,quizesManager,questionsManager) {
   userManager.getUserDetails().then(function(userDetails){
        $scope.username=userDetails.userCredentials.username;
        $scope.userDetails=userDetails;
        //get user quizes
       quizesManager.getUserQuizes($scope.username).then(function(userQuizes){
             $scope.userQuizes=userQuizes;
             //console.log($scope.userQuizes);
         });
    });

    //get all courses
    coursesManager.getCourses().then(function(courses){
         $scope.allCourses=courses;
     });
     //get all quizes
    quizesManager.getQuizes().then(function(quizes){
          $scope.allQuizes=quizes;
      });

      //get all courses
    questionsManager.getQuestions().then(function(questions){
           $scope.allQuestions=questions;
       });

      $scope.getQuizeQuestions=function (quizeId,courseId) {
          $location.path("/userCourses/"+courseId+"/Quizes/"+quizeId+"/questions");
      }

});
