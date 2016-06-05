myApp.controller('mainCtrl', function ($scope, $rootScope, $state, ngAudio, ngAudioGlobals,$timeout, $firebaseArray, $firebaseObject, $window, NODURL,USERSURL,CHATSURL){
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
        image:'',
        online: false
    };
    $scope.min=false;
    $scope.itemsearched=null;
    $scope.showVolume=false;
    $scope.showLoading=true;
    $scope.suggestions=[];
    $scope.receiver="";
    $scope.logoutmenu={
        name: 'Logout',
        icon: 'fa-sign-out',
        styleIcon:'margin-left: 27px;',
        styleText: 'margin-left: 2px;'
    };

    $scope.preferredsong=[];
    $scope.preferredsongOBJ=$firebaseObject(new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/preferredsong"));
    $scope.preferredsongOBJ.$bindTo($scope, 'preferredsong');

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

    $scope.onExit = function() {
        $scope.myUser.isPlaying=false;
        $scope.myUser.online=false;
        console.log("exit-logout");
        console.log("onlile  ?" + $scope.myUser.online);
    };
    /*
    $window.addEventListener("beforeunload",function (e) {
        var ref = new Firebase(NODURL+"/users");
        ref.child($rootScope.ref.getAuth().uid).onDisconnect().onDisconnect().update({
            online:false,
            isPlaying: false
        },onComplete);
        console.log("sono dentro");
        (e || window.event).returnValue = null;
        return null;
    });
    */


    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
        }
    };



    $scope.hideSuggestions=function () {
        $scope.showSuggestions=false;

    };

    $scope.logout=function(){
        $scope.onExit();
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


    $scope.chooseSong= function($i,currentsong){
         $scope.currentsong=currentsong;
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
        $state.transitionTo('home.user.relation');
    };

    $scope.gotoMusicPage=function () {
        $state.transitionTo('home.user.music');
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


    $scope.usersObj.$loaded().then(function(){
        $scope.myUser.online=true;
        $scope.getMessagesNotifications();
    });

    var amOnline = new Firebase(NODURL+'/.info/connected');
    amOnline.on('value', function(snapshot) {
        console.log("snapshot "+snapshot.val());
        var ref = new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/online");
        ref.set(snapshot.val());
        if (snapshot.val()) {
            var ref = new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid);
           // ref.onDisconnect().remov;
            ref.onDisconnect().update({
                online: false,
                isPlaying:false,
                time:0
            });
        }
    });
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


    $( window ).resize(function() {
        $(".chatContainer").css({
            width: $( window ).width()-100-310
        });
    })
    $(".chatContainer").css({
        width: $( window ).width()-100-310
    });


    $scope.gotochat=function (receiverid) {
        $state.go('home.user.chat', { myParam: receiverid});
    };

    $scope.addsongtoprefered= function (song) {
        var ref = new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/preferredsong");
        var s={    album: song.album,
            artist:song.artist,
            category:song.category,
            image:song.image,
            title:song.title
        };

        var insert=true;
        var prefkey=null;
        console.log("attualmente ci sono "+$scope.preferredsong.size+" canzoni preferite");
        angular.forEach( $scope.preferredsongOBJ, function(value, key){
                console.log("controllo se "+ s.title+" è uguale a "+value.title);
                if(s.title==value.title&& s.album==value.album&& s.artist==value.artist&&insert){
                    insert=false;
                    prefkey=key;
                }
        });
        console.log("insert -> "+insert);

        if(insert) {
            console.log("canzoni preferite " + song.title+" aggiunta!");
            ref.push(s);
        }else{
            console.log("canzoni preferite " + song.title+" rimossa!");
            ref.child(prefkey).remove();
        }
    };

    $scope.checkIfPreferedYet= function (s) {
        var ret=false;
        angular.forEach($scope.preferredsongOBJ, function (value, key) {
            if (s.title == value.title && s.album == value.album && s.artist == value.artist) {
                console.log("è uguale");
                ret=true;
            }
        });
        return ret;
    };

    $scope.addalbumtoprefered= function (album) {
        console.log("canzoni preferite " + song.title);
        var ref = new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/preferredalbum");
        ref.push(
            {   album: album ,
            });

    };


    $scope.messaggiNonLetti=[];

    $scope.getMessagesNotifications=function(){
        setTimeout(function(){
            var userRef = new Firebase(USERSURL);
            userRef.once("value", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var altroid = childSnapshot.key();
                    var mioid=$rootScope.ref.getAuth().uid;
                    var uidchat=mioid+"-"+altroid;
                    if(mioid.localeCompare(altroid)==-1) uidchat=altroid+"-"+mioid;

                    var ref = new Firebase(CHATSURL+uidchat);
                    ref.once("value", function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var key = childSnapshot.key();
                            var mess = childSnapshot.val();

                            if(mess.read==false&&mess.sender!=$rootScope.ref.getAuth().uid){
                                console.log("ancora non hai letto "+mess.text+" inviato da "+mess.sender);
                                $scope.messaggiNonLetti.pushIfNotExist(mess, function(e) {
                                    return e.sender === mess.sender && e.text === mess.text && e.utc == mess.utc && e.read==mess.read;
                                });
                            }
                        });
                    });
                });
            });
            $scope.$apply();
            $scope.getMessagesNotifications();
        },2000);
    };

    // check if an element exists in array using a comparer function
// comparer : function(currentElement)
    Array.prototype.inArray = function(comparer) {
        for(var i=0; i < this.length; i++) {
            if(comparer(this[i])) return true;
        }
        return false;
    };

// adds an element to the array if it does not already exist using a comparer
// function
    Array.prototype.pushIfNotExist = function(element, comparer) {
        if (!this.inArray(comparer)) {
            this.push(element);
        }
    };


    $scope.messaggiDaId=function (id){
        var count=0;
        for(var i=0; i<$scope.messaggiNonLetti.length; i++) {
            if($scope.messaggiNonLetti[i].sender==id){
                count++;
            }
        }
        return count;
    };

});