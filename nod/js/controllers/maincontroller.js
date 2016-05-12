myApp.controller('mainCtrl', function ($scope, ngAudio, ngAudioGlobals, $firebaseArray,$window,NODURL){
    ngAudioGlobals.unlock = false;
    $scope.makeItBounce=[false,false,false,false];
    $scope.deltas=[0,90,180,270];
    $scope.showIconLike=false;
    $scope.the4users=['','','',''];
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
    $scope.images=['http://ring.cdandlp.com/kawa84/photo_grande/114788855.jpg',
        'http://www.dvdcineshop.com/catalog/product_thumb.php?img=images/prodotti/201302/8032779962502.jpg&w=400&h=400',
        'http://images.rapgenius.com/fef2f69f0e0481d0141594bdc04317bb.450x446x1.jpg',
        'https://s-media-cache-ak0.pinimg.com/736x/58/9b/c0/589bc0e931ddb071f61c06ae5b001a08.jpg',
        'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/The_House_of_the_Rising_Sun_Frijid.png/220px-The_House_of_the_Rising_Sun_Frijid.png'];
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

    $scope.onExit = function() {
        $scope.myUser.isPlaying=false;
        $scope.messages.$save($scope.myUser);
    };
    $window.onbeforeunload =  $scope.onExit;

    $scope.hideSuggestions=function () {
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
        $scope.audio = ngAudio.load("audio/"+$scope.songs[$i]+".mp3");
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
                $scope.tmpSongs=$scope.songs;
                $scope.tmpSearched=$scope.itemsearched;
                $scope.tmpSearched=$scope.tmpSearched.toLowerCase();
                angular.forEach($scope.tmpSongs, function (song) {
                    var original=song;
                    song=song.toLowerCase();
                    if (song.indexOf($scope.tmpSearched) > -1) {
                        if ($scope.suggestions.indexOf(song) == -1) {
                            $scope.suggestions.push(original);
                        }
                    } else {
                        if($scope.suggestions.indexOf(song)!=-1) {
                            $scope.suggestions.splice($scope.suggestions.indexOf(original), 1);
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


    var ref = new Firebase(NODURL+"/users");
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
        if($scope.audio!=undefined) {
            $scope.audio.pause();
            $scope.audio.audio.src = "";
        }
        $time+=0.5;
        $scope.audio = ngAudio.load("audio/"+$scope.songs[$song]+".mp3#t="+$time);
        $scope.audio.loop=false;
        $scope.currentSongIndex=$song;
        $scope.myUser.time=0;
        $scope.audio.play();
        $scope.idMaster=$idmaster;

    };




});