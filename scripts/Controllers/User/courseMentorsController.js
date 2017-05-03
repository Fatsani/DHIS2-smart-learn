/* global angular */

'use strict';

angular.module('courseMentorsController', [])
//User main controller
.controller('courseMentorsController', function ($scope, $window, $timeout, $location, ModalService, $routeParams,userManager,Notification, coursesManager,quizesManager,questionsManager,mentorsManager) {
   $scope.courseId=$routeParams.courseId;
   var mentors=[];
   var mentorToPost={"mentors":[]};
   var showMentors=0;
   userManager.getUserDetails().then(function(userDetails){
        $scope.username=userDetails.userCredentials.username;
        $scope.userDetails=userDetails;
    });
    $scope.showMentors=showMentors;
    //get course mentors
    $scope.addMentor=function(courseId){
        $scope.showMentors=1;
        coursesManager.getCourses().then(function(courses){
            $scope.allCourses=courses;
            for (var x = 0; x < $scope.allCourses.courses.length; x++) {
                if ($scope.allCourses.courses[x].courseID==courseId) {
                    if ($scope.allCourses.courses[x].courseMentors.length>0) {
                        for(var y=0; y < $scope.allCourses.courses[x].courseMentors.length; y++){
                            mentors.push({
                                "mentorUsername":$scope.allCourses.courses[x].courseMentors[y].mentorUsername,
                                "mentorName":$scope.allCourses.courses[x].courseMentors[y].mentorName,
                                "mentorID":$scope.allCourses.courses[x].courseMentors[y].mentorID
                            })
                        }
                    }

                }
            }
        });
        $scope.mentors=mentors;
    }
    $scope.saveMentor=function(courseId,mentorUsername,studentUsername){
        mentorsManager.getUserCourses().then(function(response){
            var action=0;
            if(response.indexOf("mentors")==-1){
                action=1;
                mentorToPost.mentors.push({               
                        "mentorUsername": mentorUsername,
                        "attendantUsername": studentUsername,
                        "courseID":courseId                      
                 });
                 mentorsManager.saveCourseMentor(mentorToPost,action).then(function(result){
                $location.path("/userCourses");
                Notification.success('Mentor Added Successfully');  
            });
            }
            else{
                
                action=2;
                mentorsManager.getCourseMentor().then(function(data){
                    data.mentors.push({
                        "mentorUsername": mentorUsername,
                        "attendantUsername": studentUsername,
                        "courseID":courseId 
                    });
                     mentorsManager.saveCourseMentor(data,action).then(function(result){
                $location.path("/userCourses");
                 Notification.success('Mentor Added Successfully');
                });
               
            });
            }
        });
    }
    $scope.listCourses=function(){
        $location.path("/userCourses");
         Notification.success('Select Next Course');
    }
});
