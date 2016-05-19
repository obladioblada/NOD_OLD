'use strict';
var myApp=angular.module('mainApp',['ngAudio','firebase','ngSanitize','ui.router'])

    .constant('NODURL','https://nod-music.firebaseio.com')
    .constant('USERSURL','https://nod-music.firebaseio.com/users/')

    .config(function($stateProvider,$urlRouterProvider) {
        $stateProvider.
        state('login',{
            url:'/login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        }).
        state('register',{
            url: '/register',
            templateUrl:'views/register.html',
            controller:'registrationCtrl'
    }).
        state('home',{
            url: '/home',
            templateUrl:'views/home.html',
            controller:'mainCtrl'
        });
        $urlRouterProvider.otherwise('home');
    })

    .run(['$rootScope','$state',function($rootScope,$state){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if($rootScope.ref==null)
                $rootScope.ref=new Firebase("https://nod-music.firebaseio.com");
            var authData=$rootScope.ref.getAuth();
            if ( authData == null ) {
                if(toState.name!='login'&&toState.name!='register') {
                    event.preventDefault();
                    $state.go('login');
                }
            }else{
                if(toState.name=='login'||toState.name=='register') {
                    event.preventDefault();
                    $state.go('home');
                }
            }
        })
    }])


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

