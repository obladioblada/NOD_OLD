'use strict';
var myApp=angular.module('mainApp',['ngAudio','firebase','ngSanitize','ui.router'])

    .constant('NODURL','https://nod-music.firebaseio.com')
    .constant('USERSURL','https://nod-music.firebaseio.com/users/')

   /* .config(function(){
        var config = {
            apiKey: "AIzaSyCPTQTNayDcJt9wHOdy3F_GAlvMLUOh-Jc",
            authDomain: "nod-music.firebaseapp.com",
            databaseURL: "https://nod-music.firebaseio.com",
            storageBucket: "nod-music.appspot.com"
        };
        firebase.initializeApp(config);
    })*/

    .config(function($stateProvider,$urlRouterProvider) {
        $stateProvider.
        state('login',{
            url:'/login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
            .state('register',{
            url: '/register',
            templateUrl:'views/register.html',
            controller:'registrationCtrl'
    })
            .state('home',{
            url:'/home',
            templateUrl:'views/home.html',
            controller: 'mainCtrl'
        })
                            .state('home.user.music', {
                                url:'/music',
                                templateUrl:'views/home_music.html'
                        })
                            .state('home.user',{
                                url:'/user',
                                controller:'userPageCtrl',
                                templateUrl:'views/home_userpage.html'
                            })
                                        .state('home.user.relation',{
                                            url:'/relation',
                                            templateUrl:'views/home_userpage_relations.html'
                                        })
                                        .state('home.user.playlist',{
                                            url:'/playlist',
                                            templateUrl:'views/home_userpage.html'
                                        })
                                        .state('home.user.songs',{
                                            url:'/songs',
                                            templateUrl:'views/home_userpage_songs.html'
                                        })
                                        .state('home.user.albums',{
                                            url:'/albums',
                                            templateUrl:'views/home_userpage_albums.html'
                                        })
                                        .state('home.user.ranking',{
                                            url:'/ranking',
                                            templateUrl:'views/home_userpage_ranking.html'
                                        })
                                        .state('home.user.chat',{
                                            url:'/chat',
                                            templateUrl:'views/home_chat.html'
                                        })
                                        .state('home.user.settings',{
                                            url:'/setting',
                                            templateUrl:'views/home_userpage_albums.html'
                                        });

        $urlRouterProvider.otherwise('home/user/music');
    })

    .run(['$rootScope','$state',function($rootScope,$state){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            console.log("sono in "+toState.name);

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
                    $state.go('home.user.music');
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

