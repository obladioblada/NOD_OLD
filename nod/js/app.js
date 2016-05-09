'use strict';
 var myApp=angular.module('mainApp',['ngAudio','firebase','ngSanitize','ngRoute'])
     .config(['$routeProvider', function($routeProvider) {
         $routeProvider.

         when('/login', {
             templateUrl: 'views/login.html',
             controller: 'loginCtrl',
             controllerAs: 'myApp'
         }).
         when('/home',{
             templateUrl:'views/home.html',
             controller:'mainCtrl',
             controllerAs:'myApp'
         }).
             when('/register',{
             templateUrl:'views/register.html',
             controller:'registrationcCtrl',
             controllerAs:'myApp'
         }).
         otherwise({
             redirectTo:'/home'
         });
     }])

    /*
     .run( function($rootScope, $location) {

         // register listener to watch route changes
         $rootScope.$on( "$routeChangeStart", function(event, next, current) {
             if ( $rootScope.loggedUser == null ) {
                 // no logged user, we should be going to #login
                 $location.path( "/login" );
             }
         });
     })
     */

    .controller('exitController', function($scope, $window) {
        $scope.onExit = function() {
            return ('bye bye');
        };
        $window.onbeforeunload =  $scope.onExit;
    })

    .directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

                // cross-browser wheel delta
                var event = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                if(delta > 0) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngMouseWheelUp);
                    });

                    // for IE
                    event.returnValue = false;
                    // for Chrome and Firefox
                    if(event.preventDefault) {
                        event.preventDefault();
                    }

                }
            });
        };
    })


    .directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

                // cross-browser wheel delta
                var event = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                if(delta < 0) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngMouseWheelDown);
                    });

                    // for IE
                    event.returnValue = false;
                    // for Chrome and Firefox
                    if(event.preventDefault)  {
                        event.preventDefault();
                    }

                }
            });
        };
    })


    .directive('clickOff', function($parse, $document) {
        var dir = {
            compile: function($element, attr) {
                // Parse the expression to be executed
                // whenever someone clicks _off_ this element.
                var fn = $parse(attr["clickOff"]);
                return function(scope, element, attr) {
                    // add a click handler to the element that
                    // stops the event propagation.
                    element.bind("click", function(event) {
                        event.stopPropagation();
                    });
                    angular.element($document[0].body).bind("click",function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };
            }
        };
        return dir;
    });

myApp.constant('NODURL','https://nod-music.firebaseio.com');