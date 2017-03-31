/* global angular */

'use strict';

angular.module('quizeQuestionsController', [])
//User main controller
.controller('quizeQuestionsController', function ($scope, $window, $timeout, $location, ModalService, $routeParams,userManager,coursesManager,quizesManager,questionsManager) {
   userManager.getUserDetails().then(function(userDetails){
     $scope.username=userDetails.userCredentials.username;
     $scope.userDetails=userDetails;
     $scope.quizeId=$routeParams.quizeId;
     $scope.courseId=$routeParams.courseId;

     var responseError=[];
     var quizQuestion=[];
     var count=0;
     var buttonActive=0;
     var answered=0;
     var quizes;
     $scope.errorMessage="";
     $scope.buttonActive=buttonActive;
     $scope.responseError=quizQuestion;
     //Check if quize is already taken to hide buttons from user quizes
     quizesManager.getUserQuizes($scope.username).then(function(answeredQuizes){
     });
     //get all quizes
     quizesManager.getQuizes().then(function(quizes){
        $scope.allQuizes=quizes;
     });
     //get all courses
     questionsManager.getQuestions().then(function(questions){
        $scope.allQuestions=questions;
          for (var i = 0; i <  $scope.allQuestions.questions.length; i++) {
             if ($scope.allQuestions.questions[i].quizID==$scope.quizeId) {
               quizQuestion.push({
                     'quizID':$scope.allQuestions.questions[i].quizID,
                     'questionID':$scope.allQuestions.questions[i].questionID,
                     'questionTitle':$scope.allQuestions.questions[i].questionTitle,
                     'questionQuestion':$scope.allQuestions.questions[i].questionQuestion,
                     'value':'',
                     'questionAlternatives':[]
                   });
                   if ($scope.allQuestions.questions[i].questionAlternatives.length>0) {
                     for (var x = 0; x < $scope.allQuestions.questions[i].questionAlternatives.length; x++) {
                       quizQuestion[count].questionAlternatives.push({
                         'alternativeValue':$scope.allQuestions.questions[i].questionAlternatives[x].alternativeValue,
                         'alternativeChecked':$scope.allQuestions.questions[i].questionAlternatives[x].alternativeChecked
                       });
                     }
                   }
                  count++;

                 }

               }
               $scope.quizQuestions=quizQuestion;
        });
         $scope.checkAnswers=function(quizQuestions){
           if ( quizQuestions.length>0) {
             for (var i = 0; i < quizQuestions.length; i++) {
               for (var y = 0; y < quizQuestions[i].questionAlternatives.length; y++) {
                 if (quizQuestions[i].value==quizQuestions[i].questionAlternatives[y].alternativeValue) {
                   if (quizQuestions[i].questionAlternatives[y].alternativeChecked==false) {
                     responseError.push(
                      quizQuestions[i].questionID
                     );
                   }
                 }
               }
             }
           }
           if (responseError.length>0) {
              $scope.responseError=responseError;
              $scope.errorMessage="Check Answers";
           }
           else {
             $scope.buttonActive=1;
           }

         }
         $scope.saveAnswers=function (quizQuestions) {
           //prepare payload to be saved
           var  userQuz= '{ "quizes" :[' +
          '{ "quizID":"'+  $scope.quizeId+'" , "courseID":"'+$scope.courseId+'" }]}';

           quizes = JSON.parse(userQuz);

           quizesManager.saveCompletedQuiz(quizes,$scope.username).then(function (response) {
             console.log(response);
           })
         }

         });
    });
