'use strict';
angular.module('mainApp',['ngAudio','firebase','ngSanitize',])
    .controller('mainCtrl', function ($scope, ngAudio, ngAudioGlobals, $firebaseArray){
        ngAudioGlobals.unlock = false;
        $scope.showSuggestions=true;
        $scope.userid="ballalsfbas";
        $scope.myuserid="Gary";
        $scope.myUser={
            song:'',
            time: '',
            isPlaying: false,
            image:''
        };
        $scope.min=false;
        $scope.itemsearched=null;
        $scope.showVolume=false;
        $scope.images=['img/glassanimals.jpg','img/glassanimals.jpg','img/glassanimals.jpg','img/glassanimals.jpg','img/glassanimals.jpg'];
        $scope.suggestions=[];
        /*
         'https://33.media.tumblr.com/tumblr_mbgjatOQYv1qb9nyp.gif',
         'http://replygif.net/i/1121.gif',
         'https://media.giphy.com/media/t5cTE9ZfHth4s/giphy.gif',
         'http://popcrush.com/files/2013/04/head-nod.gif',
         'https://m.popkey.co/8ff06f/vkvKJ.gif'
         http://bulk-share.slickpic.com/album/share/zNwZNO,MkMkOTm/10207872.0/org/p/06.gif
         http://bestanimations.com/Balls&Buttons/lisa-simpson-getting-hit-by-ball-funny-animated-gif.gif
         http://gifrific.com/wp-content/uploads/2013/03/House-Sad-Head-Nod.gif
         */
        $scope.handleClick = function( event ){
            if (eventTarget.id!== 'suggestions'){
                $scope.showSuggestions=false;
                 event.stopImmediatePropagation()
            }        };
        $scope.songs=["track00","track01","track02","track03","track04"];
        $scope.currentSongIndex="";
        $scope.idMaster="";
        $scope.determinaUser=function(){
            angular.forEach( $scope.messages, function(user) {
                if(user.$id==$scope.myuserid){
                    $scope.myUser=user;
                }else{
                    $scope.myUser.image="";
                }
            })
        };



        $scope.hideSuggestions=function ($event) {
            $scope.showSuggestions=false;

        };


        $scope.clickhandling=function ($event) {
            if ($event.currentTarget.id!== 'suggestions'){
                $scope.showSuggestions=false;
            }
            
        };
        
        
        $scope.chooseSong= function($i){
            if($scope.audio!=undefined) {
                $scope.audio.pause();
                $scope.audio.audio.src = "";
                $scope.audio.loop = false;
            }
            $scope.audio = ngAudio.load("audio/"+$scope.songs[$i]+".mp3#t");
            $scope.audio.progress=0;
            $scope.currentSongIndex=$i;
            $scope.audio.currentTime=0;
            $scope.myUser.time=0;
            $scope.audio.play();
        };
        $scope.percentage=0;
        $scope.checkIfPlaying=function(){
            if(!$scope.audio.paused) {
                $scope.audio.play();
            }
        };
        $scope.updateBar=function(){
            $scope.style = ".rangebar{ -webkit-appearance: none;height: 3px; width: 100%;background-image: -webkit-gradient(linear,left top,right top,color-stop(" + $scope.audio.progress + ", #841E21),color-stop(" + $scope.audio.progress + ", white));";
        };

        $scope.$watch('audio.volume',function(){
            if($scope.audio!=undefined)
            $scope.volumeStyle = ".volumebar{ background-image: -webkit-gradient(linear,left top,right top,color-stop(" + $scope.audio.volume + ", #841E21),color-stop(" + $scope.audio.volume + ", white));";
        });

        $scope.$watch('audio.currentTime',function(){
            if($scope.audio!=undefined) {
                $scope.updateBar();
                if ($scope.audio.remaining < 1) {
                    $scope.nextSong();
                }
                $scope.sendToFB();
            }
        });
        $scope.playOrPause= function(){
            if($scope.audio.paused){
                $scope.audio.play();
            }else{
                $scope.audio.pause();
            }

        };
        $scope.nextSong= function (){
            $scope.audio.progress=0;
            $scope.currentSongIndex++;
            if($scope.currentSongIndex==$scope.songs.length){
                $scope.currentSongIndex=0;
            }
            $scope.audio.stop();
            $scope.chooseSong($scope.currentSongIndex);
        };

        $scope.prevSong= function (){
            $scope.audio.progress=0;
            $scope.currentSongIndex--;
            if($scope.currentSongIndex<0){
                $scope.currentSongIndex=$scope.songs.length-1;
            }$scope.audio.stop();
            $scope.chooseSong($scope.currentSongIndex);
        };

        $scope.$watch('itemsearched',function () {
            if($scope.itemsearched!=null) {
                $scope.showSuggestions=true;
                if ($scope.itemsearched.length == 0) {
                    $scope.suggestions=[];
                } else {
                    angular.forEach($scope.songs, function (song) {
                        if (song.indexOf($scope.itemsearched) > -1) {
                            if ($scope.suggestions.indexOf(song) == -1) {
                                $scope.suggestions.push(song);
                            }
                        } else {
                            if($scope.suggestions.indexOf(song)!=-1) {
                                $scope.suggestions.splice($scope.suggestions.indexOf(song), 1);
                            }
                        }
                    })
                }
            }
        });

        $scope.sendToFB=function () {
            if ($scope.myUser != undefined && $scope.myUser != null) {
                $scope.myUser.song = $scope.currentSongIndex;
                $scope.myUser.time = $scope.audio.currentTime;
                if($scope.myUser.time==undefined) $scope.myUser.time=null;
                $scope.myUser.isPlaying=!$scope.audio.paused;
                $scope.messages.$save($scope.myUser);
            }
        };


        var ref = new Firebase("https://nod-music.firebaseio.com/users");
        $scope.messages = $firebaseArray(ref);

        $scope.messages.$loaded()
            .then(function(){
                angular.forEach( $scope.messages, function(user) {
                    if(user.$id==$scope.myuserid){
                        $scope.myUser=user;
                    }
                })
            });

        $scope.listenTo=function($song,$time,$idmaster){
            if($scope.audio!=undefined) $scope.audio.pause();
            $time+=0.5;
            $scope.audio = ngAudio.load("audio/"+$scope.songs[$song]+".mp3#t="+$time);
            $scope.audio.loop=false;
            $scope.currentSongIndex=$song;
            $scope.audio.currentTime=0;
            $scope.myUser.time=0;
            $scope.audio.play();
            $scope.idMaster=$idmaster;

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