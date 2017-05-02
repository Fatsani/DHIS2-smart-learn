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
     var courseQuizes=[];
     var userCourseQuizes=[];

     $scope.errorMessage="";
     $scope.buttonActive=buttonActive;
     $scope.responseError=quizQuestion;
     //Check if quize is already taken to hide buttons from user quizes
     quizesManager.getUserQuizes($scope.username).then(function(answeredQuizes){
       $scope.answeredQuizes=answeredQuizes;
       if (answeredQuizes.quizes.length>0) {
         for (var i = 0; i < answeredQuizes.quizes.length; i++) {
           if (answeredQuizes.quizes[i].courseID==$routeParams.courseId) {
             userCourseQuizes.push(answeredQuizes.quizes[i].quizID);
           }         
         }
       }  
     });
     //get all quizes
     quizesManager.getQuizes().then(function(quizes){
        $scope.allQuizes=quizes;
        for (var i = 0; i < $scope.allQuizes.quizes.length; i++) {
          if ($scope.allQuizes.quizes[i].courseID==$routeParams.courseId) {
            courseQuizes.push($scope.allQuizes.quizes[i].quizID);
          }
          //console.log(JSON.parse($scope.allQuizes.quizes[i].quizDescription));
        }
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
           responseError=[];
           $scope.errorMessage="";
           if ( quizQuestions.length>0) {
             for (var i = 0; i < quizQuestions.length; i++) {
               for (var y = 0; y < quizQuestions[i].questionAlternatives.length; y++) {
                 if ((quizQuestions[i].value==quizQuestions[i].questionAlternatives[y].alternativeValue || quizQuestions[i].value=="")&&quizQuestions[i].questionAlternatives[y].alternativeChecked==false) {
                     responseError.push(
                      quizQuestions[i].questionID
                     );
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
             $scope.responseError=[];
           }

         }
         $scope.saveAnswers=function (quizQuestions) {
           quizesManager.getUserQuizes($scope.username).then(function(answeredQuizes){
                $scope.answeredQuizes=answeredQuizes;
                  if (answeredQuizes.quizes.length>0) {
                      for (var i = 0; i < answeredQuizes.quizes.length; i++) {
                        if (answeredQuizes.quizes[i].courseID==$routeParams.courseId) {
                          userCourseQuizes.push(answeredQuizes.quizes[i].quizID);
                        }         
                      }
                    }
              });
              quizesManager.getQuizes().then(function(quizes){
                $scope.allQuizes=quizes;
                for (var i = 0; i < $scope.allQuizes.quizes.length; i++) {
                  if ($scope.allQuizes.quizes[i].courseID==$routeParams.courseId) {
                    courseQuizes.push($scope.allQuizes.quizes[i].quizID);
                  }
                }
              });
           var data={'quizes':[]};
           data.quizes.push({
             'courseID':$scope.courseId,
             'quizID':$scope.quizeId
           });
           if ($scope.answeredQuizes.quizes.length>0) {

             for (var i = 0; i < $scope.answeredQuizes.quizes.length; i++) {
               if ($scope.quizeId==$scope.answeredQuizes.quizes[i].quizID) {
                 window.alert("Quiz already taken!");  
                 $scope.buttonActive=2;               
               }
               else {
                 data.quizes.push({
                   'courseID':$scope.answeredQuizes.quizes[i].courseID,
                   'quizID':$scope.answeredQuizes.quizes[i].quizID
                 });
               }

             }
           }
          
          quizesManager.saveCompletedQuiz(data,$scope.username).then(function (response) {
            if (courseQuizes.length>userCourseQuizes.length) {
              quizesManager.getUserQuizes($scope.username).then(function(answeredQuizes){
                $scope.answeredQuizes=answeredQuizes;
                  if (answeredQuizes.quizes.length>0) {
                      for (var i = 0; i < answeredQuizes.quizes.length; i++) {
                        if (answeredQuizes.quizes[i].courseID==$routeParams.courseId) {
                          userCourseQuizes.push(answeredQuizes.quizes[i].quizID);
                        }         
                      }
                    }
              });
              quizesManager.getQuizes().then(function(quizes){
                $scope.allQuizes=quizes;
                for (var i = 0; i < $scope.allQuizes.quizes.length; i++) {
                  if ($scope.allQuizes.quizes[i].courseID==$routeParams.courseId) {
                    courseQuizes.push($scope.allQuizes.quizes[i].quizID);
                  }
                }
              }); 
              $scope.buttonActive=2;
            }
            else{
              $scope.buttonActive=3;
            }
            //$location.path("/userCourses");
           })   
         }
         $scope.nextQuiz=function(qID,courseId){
           for (var a = 0; a < courseQuizes.length; a++) {
             for(var b = 0; b< userCourseQuizes.length; b++){
                if(courseQuizes[a]==userCourseQuizes[b]){
                      console.log("already taken");
                  }
                  else{
                    var quizeId=courseQuizes[a];
                    $location.path("/userCourses/"+courseId+"/Quizes/"+quizeId+"/questions");
                  }
             }
           }
           /*for (var a = 0; a < courseQuizes.length; a++) {
             for(var b = 0; b< userCourseQuizes.length; b++){
               if(courseQuizes[a]==userCourseQuizes[b]){
                 console.log("already taken");
               }
               else{
                for (var i = 0; i <  $scope.allQuestions.questions.length; i++) {
                  if ($scope.allQuestions.questions[i].quizID==quizId) {
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
               }
             }
           }
           */

         }
         $scope.nextCourse=function(courseId){
           $location.path("/userCourses/"+courseId+"/mentors");
         }
        });       
    });
