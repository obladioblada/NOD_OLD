'use strict';
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    options.async = true;
});
var myApp=angular.module('mainApp',['ngAudio','firebase','ngSanitize','ui.router','ngSanitize'])
    .constant('NODURL','https://nod-music.firebaseio.com')
    .constant('USERSURL','https://nod-music.firebaseio.com/users/')
    .constant('CHATSURL','https://nod-music.firebaseio.com/chats/')
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
                            .state('home.user',{
                                url:'/user',
                                controller:'userPageCtrl',
                                templateUrl:'views/home_userpage.html'
                            })
                                        .state('home.user.music', {
                                            url:'/music',
                                            templateUrl:'views/home_music.html',
                                        })
                                        .state('home.user.relation',{
                                            url:'/relation',
                                            templateUrl:'views/home_userpage_relations.html'
                                        })
                                        .state('home.user.playlist',{
                                            url:'/playlist',
                                            controller:'playlistCtrl',
                                            templateUrl:'views/home_userpage_playlist.html'
                                        })
                                        .state('home.user.songs',{
                                            url:'/songs',
                                            controller:'songCtrl',
                                            templateUrl:'views/home_userpage_songs.html'
                                        })
                                        .state('home.user.albums',{
                                            url:'/albums',
                                            controller:'albumCtrl',
                                            templateUrl:'views/home_userpage_albums.html'
                                        })
                                        .state('home.user.ranking',{
                                            url:'/ranking',
                                            controller:'rankCtrl',
                                            templateUrl:'views/home_userpage_ranking.html'
                                        })
                                            .state('home.user.ranking.me',{
                                                url:'/me',
                                                templateUrl:'views/home_userpage_ranking_me.html'
                                            })
                                            .state('home.user.ranking.monthly',{
                                                url:'/monthly',
                                                templateUrl:'views/home_userpage_ranking_monthly.html'
                                            })

                                        .state('home.user.chat',{
                                            url:'/chat:myParam',
                                            templateUrl:'views/home_chat.html',
                                            controller:'chatCtrl',
                                            params: {myParam: null}

                                        })
                                        .state('home.user.nodder',{
                                            url:'/nodder:nodder',
                                            templateUrl:'views/home_nodder.html',
                                            controller:'nodderCtrl',
                                            params: {nodder: null}
                            
                                        })
                                        .state('home.user.settings',{
                                            url:'/setting',
                                            controller:'settingsCtrl',
                                            templateUrl:'views/home_userpage_settings.html'
                                        });

        $urlRouterProvider.otherwise('home/user/music');
    })

    .run(['$rootScope','$state',function($rootScope,$state,USERSURL){
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
                var ref = new Firebase("https://nod-music.firebaseio.com/users/"+$rootScope.ref.getAuth().uid);
                ref.update({
                    isTyping: false
                });
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

    .directive('scrollIf', function () {
        return function (scope, element, attributes) {
            setTimeout(function () {
                if (scope.$eval(attributes.scrollIf)) {
                    var elmnt = document.getElementById("left");
                    elmnt.scrollTop=element[0].offsetTop - 100;
                   // elmnt.scrollTo(0, element[0].offsetTop - 100)
                }
            });
        }
    })

    .directive('ngEnter', function(USERSURL,$rootScope) {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .directive('contenteditable', ['$sce', function($sce) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Specify how UI should be updated
                ngModel.$render = function() {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function() {
                    scope.$evalAsync(read);
                });
                read(); // initialize

                // Write data to the model
                function read() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if ( attrs.stripBr && html == '<br>' ) {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    }])

    .filter('html',function($sce){
        return function(input){
            return $sce.trustAsHtml(input);
        }
    })

    .directive('scrolly', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                console.log('loading directive');

                element.bind('scroll', function () {
                  //  console.log('in scroll');
                  //  console.log(raw.scrollTop + raw.offsetHeight);
                  //  console.log(raw.scrollHeight);
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-5) {
                       // console.log("I am at the bottom");
                        scope.$apply(attrs.scrolly);
                    }
                });
            }
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

