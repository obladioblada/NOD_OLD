'use strict';
angular.module('mainApp',['ngAudio','firebase','ngSanitize'])
    .controller('mainCtrl', function ($scope, ngAudio,  $firebaseArray){
        $scope.userid="ballalsfbas";
        $scope.myuserid="Jhonny";
        $scope.myUser={
            song:'',
            time: '',
            isPlaying: false
        };
        $scope.min=false;
        $scope.numero=0;
        $scope.images=[];
/*
 'https://33.media.tumblr.com/tumblr_mbgjatOQYv1qb9nyp.gif',
 'http://replygif.net/i/1121.gif',
 'https://media.giphy.com/media/t5cTE9ZfHth4s/giphy.gif',
 'http://popcrush.com/files/2013/04/head-nod.gif',
 'https://m.popkey.co/8ff06f/vkvKJ.gif'
http://bestanimations.com/Balls&Buttons/lisa-simpson-getting-hit-by-ball-funny-animated-gif.gif
      http://gifrific.com/wp-content/uploads/2013/03/House-Sad-Head-Nod.gif
*/
        $scope.songs=["track00","track01","track02","track03","track04"];
        $scope.currentSongIndex;

        $scope.determinaUser=function(){
            angular.forEach( $scope.messages, function(user) {
                if(user.$id==$scope.myuserid){
                    $scope.myUser=user;
                }else{
                    $scope.myUser.image="";
                }
            })
        };

        $scope.chooseSong= function($i){
            $scope.audio = ngAudio.load("audio/"+$scope.songs[$i]+".mp3");
            $scope.audio.loop=false;
            $scope.currentSongIndex=$i;
            $scope.audio.play();
        };
        $scope.percentage=0;
        $scope.chooseSong(0);
        $scope.checkIfPlaying=function(){
            if(!$scope.audio.paused) {
                $scope.audio.play();
            }
        };
        $scope.updateBar=function(){
            $scope.tot=$scope.audio.currentTime+$scope.audio.remaining;
            $scope.percentage=$scope.audio.currentTime*100/$scope.tot;
            $scope.percentage=100-$scope.percentage;
            $scope.style=".player-slider::before { top: 0; left: 0; bottom: 0; right: "+$scope.percentage+"%; border-radius: 4px; background: #222; } .player-slider::after { opacity: 1; right: "+$scope.percentage+"%; width: 10px; height: 10px; top: -2.5px; background: #fff; border-radius: 50%; box-shadow: 0 0 1px rgba(0,0,0,0.2); }";
        };
        $scope.$watch('audio.currentTime',function(){
            $scope.updateBar();
            if($scope.audio.remaining<1){
                $scope.nextSong();
            }
            $scope.sendToFB();
         });
        $scope.playOrPause= function(){
            if($scope.audio.paused){
                $scope.audio.play();
            }else{
                $scope.audio.pause();
            }

        };
        $scope.nextSong= function (){
            $scope.currentSongIndex++;
            if($scope.currentSongIndex==$scope.songs.length){
                $scope.currentSongIndex=0;
            }
            $scope.audio.stop();
            $scope.chooseSong($scope.currentSongIndex);
        };

        $scope.prevSong= function (){
            $scope.currentSongIndex--;
            if($scope.currentSongIndex<0){
                $scope.currentSongIndex=$scope.songs.length-1;
            }$scope.audio.stop();
            $scope.chooseSong($scope.currentSongIndex);
        };

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

        $scope.listenTo=function($song,$time){
            $scope.audio.stop();
            $scope.audio = ngAudio.load("audio/"+$scope.songs[$song]+".mp3");
            $scope.currentSongIndex=$song;
            $scope.audio.setCurrentTime($time);
            $scope.audio.play();
        };


    });