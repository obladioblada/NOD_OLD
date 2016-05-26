myApp.controller('mainCtrl', function ($scope, $rootScope, $state, ngAudio, ngAudioGlobals, $firebaseArray, $firebaseObject, $window, NODURL,USERSURL){
    ngAudioGlobals.unlock = false;
    $scope.makeItBounce=[false,false,false,false];
    $scope.deltas=[0,90,180,270];
    $scope.showIconLike=false;
    $scope.the4users=['','','',''];
    $scope.showSuggestions=false;
    $scope.userid="ballalsfbas";
    $scope.myuserid="Gary";
    $scope.users=[];
    $scope.ricerca=[];
    $scope.myUser={
        id:'',
        username: '',
        song:'',
        time: '',
        isPlaying: false,
        image:''
    };
    $scope.min=false;
    $scope.itemsearched=null;
    $scope.showVolume=false;
    $scope.showLoading=true;
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

    $scope.charge = function(){
        $scope.showLoading=true;
    };


    $scope.stopCharge = function(){
        $scope.showLoading=false;
    };


    $scope.handleClick = function( event ){
        if (eventTarget.id!== 'suggestions'){
            $scope.showSuggestions=false;
            event.stopImmediatePropagation()
        }
    };
    $scope.songs=[];
    $scope.currentSongIndex="";
    $scope.idMaster="";
/*
    $scope.determinaUser=function(){
        angular.forEach( $scope.messages, function(user) {
            if(user.$id==$rootScope.ref.getAuth().$id){
                $scope.myUser=user;
            }else{
                $scope.myUser.image="";
            }
        })
    };
*/
    $scope.onExit = function() {
        $scope.myUser.isPlaying=false;
        $scope.messages.$save($scope.myUser);
    };
    $window.onbeforeunload =  $scope.onExit;

    $scope.hideSuggestions=function () {
        $scope.showSuggestions=false;

    };

    $scope.logout=function(){
        if($rootScope.ref==null)
            $rootScope.ref=new Firebase(NODURL);
        $rootScope.ref.unauth();
        $state.go('login');
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
       // $i++;
        $scope.audio = ngAudio.load("audio/"+$scope.songs[$i].title+".mp3");
        $scope.audio.progress=0;
        $scope.currentSongIndex=$i;
        $scope.audio.currentTime=0;
        $scope.myUser.time=0;
        $scope.audio.play();
        $scope.myUser.isPlaying=true;
        console.log("PLAYYYY!");
        $(".fa-play").addClass("fa-pause");
        $(".fa-pause").removeClass("fa-play");
    };
    $scope.percentage=0;
    $scope.checkIfPlaying=function(){
        if(!$scope.audio.paused) {
            $scope.audio.play();
            $scope.myUser.isPlaying=true;
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
            $scope.myUser.time=$scope.audio.currentTime;
            $scope.myUser.song=$scope.songs[$scope.currentSongIndex];
        }
    });
    $scope.playOrPause= function(){
        if($scope.audio.paused){
            $scope.audio.play();
            $scope.myUser.isPlaying=true;
            $(".fa-play").addClass("fa-pause");
            $(".fa-pause").removeClass("fa-play");
        }else{
            $(".fa-pause").addClass("fa-play");
            $(".fa-play").removeClass("fa-pause");
            $scope.audio.pause();
            $scope.myUser.isPlaying=false;
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
        if($scope.currentSongIndex<1){
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
                $scope.ricerca=[];
                $scope.suggestions=[];
                $scope.tmpSongs=$scope.songs;
                $scope.tmpSearched=$scope.itemsearched;
                $scope.tmpSearched=$scope.tmpSearched.toLowerCase();

                //ricerca canzone
                $scope.suggestSong=[];
                angular.forEach($scope.tmpSongs, function (song) {
                    var original=song;
                    song=song.title.toLowerCase();
                    if (song.indexOf($scope.tmpSearched) > -1) {
//                        console.log("sto cercando "+$scope.tmpSearched+" che corrisponde con "+song);
                        if ($scope.suggestSong.indexOf(original) == -1) {
//                            console.log(original.title+" non è presente in suggestions e lo inserisco");
                            $scope.suggestSong.push(original);
                        }
                    } else {
//                        console.log("sto cercando "+$scope.tmpSearched+" e non corrispone con "+song);
                        if($scope.suggestSong.indexOf(original)!=-1) {
//                            console.log(original.title+" è presente in suggestions e lo disinserisco "+$scope.suggestions.indexOf(original));
                            $scope.suggestSong.splice($scope.suggestSong.indexOf(original), 1);
                        }
                    }
                });
                if($scope.suggestSong.length!=0) {
                    $scope.suggestions.push($scope.suggestSong);
                    $scope.ricerca.push("Canzoni");
                }

                //ricerca artista
                $scope.suggestArtist=[];
                angular.forEach($scope.tmpSongs, function (song) {
                    var original=song;
                    song=song.artist.toLowerCase();
                    if (song.indexOf($scope.tmpSearched) > -1) {
//                        console.log("sto cercando "+$scope.tmpSearched+" che corrisponde con "+song);
                        if ($scope.suggestArtist.indexOf(original) == -1) {
//                            console.log(original.title+" non è presente in suggestions e lo inserisco");
                            $scope.suggestArtist.push(original);
                        }
                    } else {
//                        console.log("sto cercando "+$scope.tmpSearched+" e non corrispone con "+song);
                        if($scope.suggestArtist.indexOf(original)!=-1) {
//                            console.log(original.title+" è presente in suggestions e lo disinserisco "+$scope.suggestions.indexOf(original));
                            $scope.suggestArtist.splice($scope.suggestArtist.indexOf(original), 1);
                        }
                    }
                })
                if($scope.suggestArtist.length!=0){
                    $scope.suggestions.push($scope.suggestArtist);
                    $scope.ricerca.push("Artisti");
                }

                //ricerca album
                $scope.suggestAlbum=[];
                angular.forEach($scope.tmpSongs, function (song) {
                    var original=song;
                    song=song.album.toLowerCase();
                    if (song.indexOf($scope.tmpSearched) > -1) {
//                        console.log("sto cercando "+$scope.tmpSearched+" che corrisponde con "+song);
                        if ($scope.suggestAlbum.indexOf(original) == -1) {
//                            console.log(original.title+" non è presente in suggestions e lo inserisco");
                            $scope.suggestAlbum.push(original);
                        }
                    } else {
//                        console.log("sto cercando "+$scope.tmpSearched+" e non corrispone con "+song);
                        if($scope.suggestAlbum.indexOf(original)!=-1) {
//                            console.log(original.title+" è presente in suggestions e lo disinserisco "+$scope.suggestions.indexOf(original));
                            $scope.suggestAlbum.splice($scope.suggestAlbum.indexOf(original), 1);
                        }
                    }
                })
                if($scope.suggestAlbum.length!=0){
                    $scope.suggestions.push($scope.suggestAlbum);
                    $scope.ricerca.push("Album");
                }
            }
        }
    });

    $scope.gotouserPage=function () {
        $state.transitionTo('home.user');
    };

    $scope.gotoMusicPage=function () {
        $state.transitionTo('home.music');
    };




    /*
    $scope.sendToFB=function () {
        if ($scope.myUser != undefined && $scope.myUser != null) {
            $scope.myUser.song = $scope.currentSongIndex;
            $scope.myUser.time = $scope.audio.currentTime;
            if($scope.myUser.time==undefined) $scope.myUser.time=null;
            $scope.myUser.isPlaying=!$scope.audio.paused;
            $scope.message.$save($scope.myUser);
        }
    };
    */


    var ref = new Firebase(USERSURL+$rootScope.ref.getAuth().uid);
    $scope.message = $firebaseObject(ref);
    $scope.message.$bindTo($scope, "myUser");

    $scope.songObj = $firebaseArray(new Firebase(NODURL+"/songs"));
    //$scope.songObj.$bindTo($scope, "songs");
    $scope.songObj.$loaded()
        .then(function(){
            angular.forEach( $scope.songObj, function(s) {
                $scope.songs.push(s);
            });
            $scope.stopCharge();
        });

    var refusers = new Firebase(USERSURL);
    $scope.usersObj = $firebaseObject(refusers);
    $scope.usersObj.$bindTo($scope, 'users');

/*
$scope.usersObj.$loaded()
        .then(function(){
            angular.forEach( $scope.usersObj, function(user) {

                $scope.users.push(user);
            });
        });
*/

    $scope.listenTo=function($song,$time,$idmaster){
        if($scope.audio!=undefined) {
            $scope.audio.pause();
            $scope.audio.audio.src = "";
        }
        console.log($song+" - "+$time+" - "+$idmaster);
        $time+=0.5;
        $scope.audio = ngAudio.load("audio/"+$song.title+".mp3#t="+$time);
        $scope.audio.loop=false;
        $scope.currentSongIndex=$scope.searchSongIndex($song);
        $scope.audio.play();
        $scope.myUser.isPlaying=true;
        $scope.idMaster=$idmaster;

    };

    $scope.searchSongIndex= function($song){
        for(var i=0; i<$scope.songs.length; i++){
            if($scope.songs[i].title == $song.title && $scope.songs[i].artist == $song.artist && $scope.songs[i].album == $song.album){
                console.log($scope.songs[i].title);
                return i;
            }
        }
        return -1;
    };




});