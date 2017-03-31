/* global angular */

'use strict';

angular.module('UserMainController', [])
//USer main controller
.controller('UserMainController', function ($scope, $window, $timeout, $location, ModalService, $routeParams,userManager) {
   
    var mainWindow, quizWindow, home;
         $scope.showUserCourse = function () {
                //$location.path("/userCourses");
                //home = $window.open("#/");
                mainWindow = $window.open("../../..","mainNavigationWindow", "width=250, height=250, location=yes, scrollbars=yes");
                quizWindow  = $window.open("#/userCourses", "quizPanel", "width=250,height=250, location=yes, scrollbars=yes");
         quizWindow.resizeTo(500, screen.height);
        mainWindow.resizeTo(screen.width - 570, screen.height);
        quizWindow.moveTo(screen.width - 500, 50);
        mainWindow.moveTo(0, 100);
        mainWindow.focus();
        quizWindow.focus();
        }      
});
        