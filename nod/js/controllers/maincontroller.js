myApp.controller('mainCtrl', function ($scope, $rootScope, $state, ngAudio, ngAudioGlobals,$timeout, $firebaseArray, $firebaseObject, $window, NODURL,USERSURL,CHATSURL,$http){
    ngAudioGlobals.unlock = false;
    $scope.makeItBounce=[false,false,false,false];
    $scope.deltas=[0,90,180,270];
    $scope.showIconLike=false;
    $scope.the4users=['','','',''];
    $scope.showSuggestions=false;
    $scope.userid="ballalsfbas";
    $scope.myuserid="Gary";
    $scope.users=[];
    $scope.karaoke=false;
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
    var user=$scope.myUser.username;
    $scope.currentLineSong="";
    $scope.nextLineSong="";
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
    $(".notification").trigger('load');
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
        delete $scope.audio;
        $scope.audio = ngAudio.load("https://nod-music.firebaseapp.com/audio/"+$scope.songs[$i].title+".mp3");
        $scope.audio.progress=0;
        $scope.currentSongIndex=$i;
        $scope.audio.currentTime=0;
        $scope.myUser.time=0;
        if($scope.myUser.volume!=null) $scope.audio.volume=$scope.myUser.volume;
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
        if($scope.audio!=undefined){
            $scope.volumeStyle = ".volumebar{ background-image: -webkit-gradient(linear,left top,right top,color-stop(" + $scope.audio.volume + ", #841E21),color-stop(" + $scope.audio.volume + ", white));";
            $scope.myUser.volume=$scope.audio.volume;
            console.log("volume "+$scope.myUser.volume);
        }
    });

    $scope.$watch('audio.currentTime',function(){
       // if($scope.audio!=null) console.log("il tempo è    "+ $scope.audio.currentTime);
        if($scope.audio!=undefined) {
            $scope.updateBar();
            if ($scope.audio.remaining < 1) {
                $scope.nextSong();
            }
            if($scope.audio.currentTime!=null){
                $scope.myUser.time=$scope.audio.currentTime;
                $scope.myUser.volume=$scope.audio.volume;
            }
            $scope.myUser.song=$scope.songs[$scope.currentSongIndex];
            var lineN=0;
            var itmp=0;
            angular.forEach($scope.songs[$scope.currentSongIndex].lyric, function (line) {
                var lineArray=line.split('&&');
                if(lineArray[0]<$scope.audio.currentTime){
                    $scope.currentLineSong=lineArray[1];
                    lineN=itmp+1;
                }
                if(lineN==itmp){
                    $scope.nextLineSong=lineArray[1];
                }
                itmp++;
            });
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
        setTimeout(function () {
            $scope.sendPush( $scope.myUser.name +" é online!" , "Noddati  con lui!",'http://localhost:63342/nod/nod/index.html#/home/user/nodder'+$scope.myUser.$id, $scope.myUser.image );
            $(".notification").trigger('play');
        },2000);
        $scope.myUser.online=true;
        $scope.getMessagesNotifications(true);
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
                lastTimeOnline: new Date().toJSON(),
                time:0
            });
        }
    });



/************************ notifiche  *************************/

$scope.notification="";
    $scope.notRef = new Firebase('https://nod-music.firebaseio.com/notification');
    $scope.notob=$firebaseObject($scope.notRef);
    $scope.notob.$bindTo($scope,'notification').then(function(){
        $scope.$watch('notification',function () {
            var values=[];
            for(var key in $scope.notification) {
                values.push($scope.notification[key]);
            }
            console.log(values);
            if(navigator.serviceWorker.controller!=null){
                navigator.serviceWorker.controller.postMessage({'title': values[4],'body':values[2], 'tag': values[5], 'img':values[3] });}
        });
    });
    $scope.sendPush = function(title, body, id, img){
        $scope.notRef = new Firebase('https://nod-music.firebaseio.com/notification');
        var jsonToFb={
            title:title,
            body:body,
            uid: id,
            image: img
        };
        $scope.notRef.update(jsonToFb);
        $scope.subObj= $firebaseObject(new Firebase(NODURL+"/subscribe/"));
        $scope.subcriptionArray=[];
        $scope.subObj.$loaded()
            .then(function(){
                angular.forEach( $scope.subObj, function(s) {
                    $scope.subcriptionArray.push(s);
                    console.log($scope.subcriptionArray.length);
                });

                var Content = {
                    registration_ids:$scope.subcriptionArray
                };
                console.log(Content);
                var req = {
                    method: 'POST',
                    url: 'https://android.googleapis.com/gcm/send',
                    headers: {
                        'Authorization': 'key= AIzaSyA2osVlaB52G_k5Rp1D4VP8QG0NrhnRAm8' ,
                        'Content-Type': 'application/json'
                    },
                    data : Content
                };

                $http(req).then(function(response){
                    console.log("requeste http sended correctly!" + response);
                    console.log(response);
                }, function(response){
                    console.log("ERROR: requeste http not sended correctly!" + response);

                });

            });

    };

 /********************  fine notifiche *************************/

    $scope.canListen=function(idM){
        setTimeout(function(idM){
            if($scope.audio.canPlay){
                var ref= new Firebase("https://nod-music.firebaseio.com/users/"+idM+"/time");
                var time = $firebaseObject(ref);
                time.$loaded().then(function(){
                    $scope.audio.setCurrentTime=time;
                    $scope.audio.play();
                });
            }else{
                $scope.canListen();
            }
        },200);
    };


    $scope.listenTo=function($song,$time,idmaster){
        if($scope.audio!=undefined) {
            $scope.audio.pause();
            $scope.audio.audio.src = "";
        }
        console.log($song+" - "+$time+" - "+idmaster);
        $time+=0.5;
        $scope.audio = ngAudio.load("https://nod-music.firebaseapp.com/audio/"+$song.title+".mp3#t="+$time);
        if($scope.myUser.volume!=null) $scope.audio.volume=$scope.myUser.volume;
        $scope.audio.loop=false;
        $scope.currentSongIndex=$scope.searchSongIndex($song);
        $scope.myUser.isPlaying=true;
        $scope.canListen(idmaster);
        $scope.idMaster=idmaster;
        $scope.countnodbuddy=$scope.myUser.nodbuddy[idmaster].count;
        if($scope.countnodbuddy==""||$scope.countnodbuddy==null) $scope.countnodbuddy=0;
        $scope.countnodbuddy++;
        console.log($scope.countnodbuddy+" <- countnodbuddy");
        ref = new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/nodbuddy/"+idmaster);
        ref.set({
            count: $scope.countnodbuddy
        });
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
    });
    $(".chatContainer").css({
        width: $( window ).width()-100-310
    });


    $scope.gotochat=function (receiverid) {
        $state.go('home.user.chat', { myParam: receiverid});
    };

    $scope.gotonodder=function (nodderid) {
        $state.go('home.user.nodder', { nodder: nodderid});
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
                ret=true;
            }
        });
        return ret;
    };

    $scope.addalbumtoprefered= function (album) {
        console.log("canzoni preferite " + song.title);
        var ref = new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/preferredalbum");
        ref.push(
            {   album: album 
            });

    };


    $scope.messaggiNonLetti=[];
    $scope.isFirstTimeIChek=true;

    $scope.getMessagesNotifications=function(first){
        if($rootScope.ref.getAuth()!=null) {
            setTimeout(function () {
                var userRef = new Firebase(USERSURL);
                userRef.once("value", function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var altroid = childSnapshot.key();
                        if($rootScope.ref.getAuth()!=null) {
                            var mioid = $rootScope.ref.getAuth().uid;
                            var uidchat = mioid + "-" + altroid;
                            if (mioid.localeCompare(altroid) == -1) uidchat = altroid + "-" + mioid;

                            var ref = new Firebase(CHATSURL + uidchat);
                            ref.once("value", function (snapshot) {
                                snapshot.forEach(function (childSnapshot) {
                                    var key = childSnapshot.key();
                                    var mess = childSnapshot.val();
                                   if($rootScope.ref.getAuth()!=null) {
                                    $scope.isFirstTimeIChek = first;
                                    if (mess.read == false && mess.sender != $rootScope.ref.getAuth().uid) {
                                        $scope.messaggiNonLetti.pushIfNotExist(mess, function (e) {
                                            return e.sender === mess.sender && e.text === mess.text && e.utc == mess.utc && e.read == mess.read;
                                        });
                                    }
                                }
                                });
                            });
                        }
                    });
                });
                //$scope.isFirstTimeIChek=false;
                $scope.$apply();
                $scope.getMessagesNotifications(false);
            }, 2000);
        }
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
            if($scope.isFirstTimeIChek==false){
                if($scope.myUser.chatShutUp==false)
                    $(".notification").trigger('play');
            }
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
    $scope.emoji=[
        "&#x1F520;","&#x1F521;","&#x1F524;","&#x1F300;","&#x1F301;","&#x1F302;","&#x1F303;","&#x1F304;","&#x1F305;","&#x1F306;","&#x1F307;","&#x1F308;","&#x1F309;","&#x1F30A;","&#x1F30B;","&#x1F30C;","&#x1F30D;","&#x1F30E;","&#x1F30F;","&#x1F310;","&#x1F311;","&#x1F312;","&#x1F313;","&#x1F314;","&#x1F315;","&#x1F316;","&#x1F317;","&#x1F318;","&#x1F319;","&#x1F31A;","&#x1F31B;","&#x1F31C;","&#x1F31D;","&#x1F31E;","&#x1F31F;","&#x1F320;","&#x1F330;","&#x1F331;","&#x1F332;","&#x1F333;","&#x1F334;","&#x1F335;","&#x1F337;","&#x1F338;","&#x1F339;","&#x1F33A;","&#x1F33B;","&#x1F33C;","&#x1F33D;","&#x1F33E;","&#x1F33F;","&#x1F340;","&#x1F341;","&#x1F342;","&#x1F343;","&#x1F344;","&#x1F345;","&#x1F346;","&#x1F347;","&#x1F348;","&#x1F349;","&#x1F34A;","&#x1F34B;","&#x1F34C;","&#x1F34D;","&#x1F34E;","&#x1F34F;","&#x1F350;","&#x1F351;","&#x1F352;","&#x1F353;","&#x1F354;","&#x1F355;","&#x1F356;","&#x1F357;","&#x1F358;","&#x1F359;","&#x1F35A;","&#x1F35B;","&#x1F35C;","&#x1F35D;","&#x1F35E;","&#x1F35F;","&#x1F360;","&#x1F361;","&#x1F362;","&#x1F363;","&#x1F364;","&#x1F365;","&#x1F366;","&#x1F367;","&#x1F368;","&#x1F369;","&#x1F36A;","&#x1F36B;","&#x1F36C;","&#x1F36D;","&#x1F36E;","&#x1F36F;","&#x1F370;","&#x1F371;","&#x1F372;","&#x1F373;","&#x1F374;","&#x1F375;","&#x1F376;","&#x1F377;","&#x1F378;","&#x1F379;","&#x1F37A;","&#x1F37B;","&#x1F37C;","&#x1F380;","&#x1F381;","&#x1F382;","&#x1F383;","&#x1F384;","&#x1F385;","&#x1F386;","&#x1F387;","&#x1F388;","&#x1F389;","&#x1F38A;","&#x1F38B;","&#x1F38C;","&#x1F38D;","&#x1F38E;","&#x1F38F;","&#x1F390;","&#x1F391;","&#x1F392;","&#x1F393;","&#x1F3A0;","&#x1F3A1;","&#x1F3A2;","&#x1F3A3;","&#x1F3A4;","&#x1F3A5;","&#x1F3A6;","&#x1F3A7;","&#x1F3A8;","&#x1F3A9;","&#x1F3AA;","&#x1F3AB;","&#x1F3AC;","&#x1F3AD;","&#x1F3AE;","&#x1F3AF;","&#x1F3B0;","&#x1F3B1;","&#x1F3B2;","&#x1F3B3;","&#x1F3B4;","&#x1F3B5;","&#x1F3B6;","&#x1F3B7;","&#x1F3B8;","&#x1F3B9;","&#x1F3BA;","&#x1F3BB;","&#x1F3BC;","&#x1F3BD;","&#x1F3BE;","&#x1F3BF;","&#x1F3C0;","&#x1F3C1;","&#x1F3C2;","&#x1F3C3;","&#x1F3C4;","&#x1F3C6;","&#x1F3C7;","&#x1F3C8;","&#x1F3C9;","&#x1F3CA;","&#x1F3E0;","&#x1F3E1;","&#x1F3E2;","&#x1F3E3;","&#x1F3E4;","&#x1F3E5;","&#x1F3E6;","&#x1F3E7;","&#x1F3E8;","&#x1F3E9;","&#x1F3EA;","&#x1F3EB;","&#x1F3EC;","&#x1F3ED;","&#x1F3EE;","&#x1F3EF;","&#x1F3F0;","&#x1F400;","&#x1F401;","&#x1F402;","&#x1F403;","&#x1F404;","&#x1F405;","&#x1F406;","&#x1F407;","&#x1F408;","&#x1F409;","&#x1F40A;","&#x1F40B;","&#x1F40C;","&#x1F40D;","&#x1F40E;","&#x1F40F;","&#x1F410;","&#x1F411;","&#x1F412;","&#x1F413;","&#x1F414;","&#x1F415;","&#x1F416;","&#x1F417;","&#x1F418;","&#x1F419;","&#x1F41A;","&#x1F41B;","&#x1F41C;","&#x1F41D;","&#x1F41E;","&#x1F41F;","&#x1F420;","&#x1F421;","&#x1F422;","&#x1F423;","&#x1F424;","&#x1F425;","&#x1F426;","&#x1F427;","&#x1F428;","&#x1F429;","&#x1F42A;","&#x1F42B;","&#x1F42C;","&#x1F42D;","&#x1F42E;","&#x1F42F;","&#x1F430;","&#x1F431;","&#x1F432;","&#x1F433;","&#x1F434;","&#x1F435;","&#x1F436;","&#x1F437;","&#x1F438;","&#x1F439;","&#x1F43A;","&#x1F43B;","&#x1F43C;","&#x1F43D;","&#x1F43E;","&#x1F440;","&#x1F442;","&#x1F443;","&#x1F444;","&#x1F445;","&#x1F446;","&#x1F447;","&#x1F448;","&#x1F449;","&#x1F44A;","&#x1F44B;","&#x1F44C;","&#x1F44D;","&#x1F44E;","&#x1F44F;","&#x1F450;","&#x1F451;","&#x1F452;","&#x1F453;","&#x1F454;","&#x1F455;","&#x1F456;","&#x1F457;","&#x1F458;","&#x1F459;","&#x1F45A;","&#x1F45B;","&#x1F45C;","&#x1F45D;","&#x1F45E;","&#x1F45F;","&#x1F460;","&#x1F461;","&#x1F462;","&#x1F463;","&#x1F464;","&#x1F465;","&#x1F466;","&#x1F467;","&#x1F468;","&#x1F469;","&#x1F46A;","&#x1F46B;","&#x1F46C;","&#x1F46D;","&#x1F46E;","&#x1F46F;","&#x1F470;","&#x1F471;","&#x1F472;","&#x1F473;","&#x1F474;","&#x1F475;","&#x1F476;","&#x1F477;","&#x1F478;","&#x1F479;","&#x1F47A;","&#x1F47B;","&#x1F47C;","&#x1F47D;","&#x1F47E;","&#x1F47F;","&#x1F480;","&#x1F481;","&#x1F482;","&#x1F483;","&#x1F484;","&#x1F485;","&#x1F486;","&#x1F487;","&#x1F488;","&#x1F489;","&#x1F48A;","&#x1F48B;","&#x1F48C;","&#x1F48D;","&#x1F48E;","&#x1F48F;","&#x1F490;","&#x1F491;","&#x1F492;","&#x1F493;","&#x1F494;","&#x1F495;","&#x1F496;","&#x1F497;","&#x1F498;","&#x1F499;","&#x1F49A;","&#x1F49B;","&#x1F49C;","&#x1F49D;","&#x1F49E;","&#x1F49F;","&#x1F4A0;","&#x1F4A1;","&#x1F4A2;","&#x1F4A3;","&#x1F4A4;","&#x1F4A5;","&#x1F4A6;","&#x1F4A7;","&#x1F4A8;","&#x1F4A9;","&#x1F4AA;","&#x1F4AB;","&#x1F4AC;","&#x1F4AD;","&#x1F4AE;","&#x1F4AF;","&#x1F4B0;","&#x1F4B1;","&#x1F4B2;","&#x1F4B3;","&#x1F4B4;","&#x1F4B5;","&#x1F4B6;","&#x1F4B7;","&#x1F4B8;","&#x1F4B9;","&#x1F4BA;","&#x1F4BB;","&#x1F4BC;","&#x1F4BD;","&#x1F4BE;","&#x1F4BF;","&#x1F4C0;","&#x1F4C1;","&#x1F4C2;","&#x1F4C3;","&#x1F4C4;","&#x1F4C5;","&#x1F4C6;","&#x1F4C7;","&#x1F4C8;","&#x1F4C9;","&#x1F4CA;","&#x1F4CB;","&#x1F4CC;","&#x1F4CD;","&#x1F4CE;","&#x1F4CF;","&#x1F4D0;","&#x1F4D1;","&#x1F4D2;","&#x1F4D3;","&#x1F4D4;","&#x1F4D5;","&#x1F4D6;","&#x1F4D7;","&#x1F4D8;","&#x1F4D9;","&#x1F4DA;","&#x1F4DB;","&#x1F4DC;","&#x1F4DD;","&#x1F4DE;","&#x1F4DF;","&#x1F4E0;","&#x1F4E1;","&#x1F4E2;","&#x1F4E3;","&#x1F4E4;","&#x1F4E5;","&#x1F4E6;","&#x1F4E7;","&#x1F4E8;","&#x1F4E9;","&#x1F4EA;","&#x1F4EB;","&#x1F4EC;","&#x1F4ED;","&#x1F4EE;","&#x1F4EF;","&#x1F4F0;","&#x1F4F1;","&#x1F4F2;","&#x1F4F3;","&#x1F4F4;","&#x1F4F5;","&#x1F4F6;","&#x1F4F7;","&#x1F4F9;","&#x1F4FA;","&#x1F4FB;","&#x1F4FC;","&#x1F500;","&#x1F501;","&#x1F502;","&#x1F503;","&#x1F504;","&#x1F505;","&#x1F506;","&#x1F507;","&#x1F508;","&#x1F509;","&#x1F50A;","&#x1F50B;","&#x1F50C;","&#x1F50D;","&#x1F50E;","&#x1F50F;","&#x1F510;","&#x1F511;","&#x1F512;","&#x1F513;","&#x1F514;","&#x1F515;","&#x1F516;","&#x1F517;","&#x1F518;","&#x1F519;","&#x1F51A;","&#x1F51B;","&#x1F51C;","&#x1F51D;","&#x1F51E;","&#x1F51F;","&#x1F522;","&#x1F523;","&#x1F525;","&#x1F526;","&#x1F527;","&#x1F528;","&#x1F529;","&#x1F52A;","&#x1F52B;","&#x1F52C;","&#x1F52D;","&#x1F52E;","&#x1F52F;","&#x1F530;","&#x1F531;","&#x1F532;","&#x1F533;","&#x1F534;","&#x1F535;","&#x1F536;","&#x1F537;","&#x1F538;","&#x1F539;","&#x1F53A;","&#x1F53B;","&#x1F53C;","&#x1F53D;","&#x1F550;","&#x1F551;","&#x1F552;","&#x1F553;","&#x1F554;","&#x1F555;","&#x1F556;","&#x1F557;","&#x1F558;","&#x1F559;","&#x1F55A;","&#x1F55B;","&#x1F55C;","&#x1F55D;","&#x1F55E;","&#x1F55F;","&#x1F560;","&#x1F561;","&#x1F562;","&#x1F563;","&#x1F564;","&#x1F565;","&#x1F566;","&#x1F567;","&#x1F5FB;","&#x1F5FC;","&#x1F5FD;","&#x1F5FE;","&#x1F5FF;","&#x1F600;","&#x1F601;","&#x1F602;","&#x1F603;","&#x1F604;","&#x1F605;","&#x1F606;","&#x1F607;","&#x1F608;","&#x1F609;","&#x1F60A;","&#x1F60B;","&#x1F60C;","&#x1F60D;","&#x1F60E;","&#x1F60F;","&#x1F610;","&#x1F611;","&#x1F612;","&#x1F613;","&#x1F614;","&#x1F615;","&#x1F616;","&#x1F617;","&#x1F618;","&#x1F619;","&#x1F61A;","&#x1F61B;","&#x1F61C;","&#x1F61D;","&#x1F61E;","&#x1F61F;","&#x1F620;","&#x1F621;","&#x1F622;","&#x1F623;","&#x1F624;","&#x1F625;","&#x1F626;","&#x1F627;","&#x1F628;","&#x1F629;","&#x1F62A;","&#x1F62B;","&#x1F62C;","&#x1F62D;","&#x1F62E;","&#x1F62F;","&#x1F630;","&#x1F631;","&#x1F632;","&#x1F633;","&#x1F634;","&#x1F635;","&#x1F636;","&#x1F637;","&#x1F638;","&#x1F639;","&#x1F63A;","&#x1F63B;","&#x1F63C;","&#x1F63D;","&#x1F63E;","&#x1F63F;","&#x1F640;","&#x1F645;","&#x1F646;","&#x1F647;","&#x1F648;","&#x1F649;","&#x1F64A;","&#x1F64B;","&#x1F64C;","&#x1F64D;","&#x1F64E;","&#x1F64F;","&#x1F680;","&#x1F681;","&#x1F682;","&#x1F683;","&#x1F684;","&#x1F685;","&#x1F686;","&#x1F687;","&#x1F688;","&#x1F689;","&#x1F68A;","&#x1F68B;","&#x1F68C;","&#x1F68D;","&#x1F68E;","&#x1F68F;","&#x1F690;","&#x1F691;","&#x1F692;","&#x1F693;","&#x1F694;","&#x1F695;","&#x1F696;","&#x1F697;","&#x1F698;","&#x1F699;","&#x1F69A;","&#x1F69B;","&#x1F69C;","&#x1F69D;","&#x1F69E;","&#x1F69F;","&#x1F6A0;","&#x1F6A1;","&#x1F6A2;","&#x1F6A3;","&#x1F6A4;","&#x1F6A5;","&#x1F6A6;","&#x1F6A7;","&#x1F6A8;","&#x1F6A9;","&#x1F6AA;","&#x1F6AB;","&#x1F6AC;","&#x1F6AD;","&#x1F6AE;","&#x1F6AF;","&#x1F6B0;","&#x1F6B1;","&#x1F6B2;","&#x1F6B3;","&#x1F6B4;","&#x1F6B5;","&#x1F6B6;","&#x1F6B7;","&#x1F6B8;","&#x1F6B9;","&#x1F6BA;","&#x1F6BB;","&#x1F6BC;","&#x1F6BD;","&#x1F6BE;","&#x1F6BF;","&#x1F6C0;","&#x1F6C1;","&#x1F6C2;","&#x1F6C3;","&#x1F6C4;","&#x1F6C5;","&#x00A9;","&#x00AE;","&#x1F004;","&#x1F0CF;","&#x1F170;","&#x1F171;","&#x1F17E;","&#x1F17F;","&#x1F18E;","&#x1F191;","&#x1F192;","&#x1F193;","&#x1F194;","&#x1F195;","&#x1F196;","&#x1F197;","&#x1F198;","&#x1F199;","&#x1F19A;","&#x1F201;","&#x1F202;","&#x1F21A;","&#x1F22F;","&#x1F232;","&#x1F233;","&#x1F234;","&#x1F235;","&#x1F236;","&#x1F237;","&#x1F238;","&#x1F239;","&#x1F23A;","&#x1F250;","&#x1F251;","&#x203C;","&#x2049;","&#x20E3;","&#x2122;","&#x2139;","&#x2194;","&#x2195;","&#x2196;","&#x2197;","&#x2198;","&#x2199;","&#x21A9;","&#x21AA;","&#x231A;","&#x231B;","&#x23E9;","&#x23EA;","&#x23EB;","&#x23EC;","&#x23F0;","&#x23F3;","&#x24C2;","&#x25AA;","&#x25AB;","&#x25B6;","&#x25C0;","&#x25FB;","&#x25FC;","&#x25FD;","&#x25FE;","&#x2600;","&#x2601;","&#x260E;","&#x2611;","&#x2614;","&#x2615;","&#x261D;","&#x263A;","&#x2648;","&#x2649;","&#x264A;","&#x264B;","&#x264C;","&#x264D;","&#x264E;","&#x264F;","&#x2650;","&#x2651;","&#x2652;","&#x2653;","&#x2660;","&#x2663;","&#x2665;","&#x2666;","&#x2668;","&#x267B;","&#x267F;","&#x2693;","&#x26A0;","&#x26A1;","&#x26AA;","&#x26AB;","&#x26BD;","&#x26BE;","&#x26C4;","&#x26C5;","&#x26CE;","&#x26D4;","&#x26EA;","&#x26F2;","&#x26F3;","&#x26F5;","&#x26FA;","&#x26FD;","&#x2702;","&#x2705;","&#x2708;","&#x2709;","&#x270A;","&#x270B;","&#x270C;","&#x270F;","&#x2712;","&#x2714;","&#x2716;","&#x2728;","&#x2733;","&#x2734;","&#x2744;","&#x2747;","&#x274C;","&#x274E;","&#x2753;","&#x2754;","&#x2755;","&#x2757;","&#x2764;","&#x2795;","&#x2796;","&#x2797;","&#x27A1;","&#x27B0;","&#x27BF;","&#x2934;","&#x2935;","&#x2B05;","&#x2B06;","&#x2B07;","&#x2B1B;","&#x2B1C;","&#x2B50;","&#x2B55;","&#x3030;","&#x303D;","&#x3297;","&#x3299;","&#xE50A;"
    ];

    $scope.showKaraoke= function(){
        if($scope.audio!=undefined){$scope.karaoke=!$scope.karaoke}
    };

/*
    $scope.lyric="[00:03.38]Well it's one for the money,two for the show&&" +
        "[00:05.90]three get ready now go cat go&&" +
        "[00:08.23]But don't you step on my blue suede shoes&&" +
        "[00:13.01]You can do anything&&" +
        "[00:14.23]but lay off of my blue suede shoes&&" +
        "[00:18.36]You can knock me down,step on my face&&" +
        "[00:20.63]slander my name all over the place&&" +
        "[00:23.18]Do anything you wanna do&&" +
        "[00:25.39]But ah ah honey lay off of my shoes&&" +
        "[00:28.16]But don't you step on my blue suede shoes&&" +
        "[00:33.03]You can do anything&&" +
        "[00:33.93]but lay off of my blue suede shoes&&" +
        "[00:36.68]&&" +
        "[00:52.57]You can burn my house,steal my car&&" +
        "[00:55.10]drink my liquors from the old fruit jar&&" +
        "[00:57.61]Do anything you wanna do&&" +
        "[00:59.98]But ah ah honey lay off of my shoes&&" +
        "[01:02.44]But don't you step on my blue suede shoes&&" +
        "[01:07.09]You can do anything&&" +
        "[01:08.25]but lay off of my blue suede shoes&&" +
        "[01:11.17]&&" +
        "[01:27.02]One for the money,two for the show&&" +
        "[01:29.52]three get ready now go go go&&" +
        "[01:31.92]But don't you step on my blue suede shoes&&" +
        "[01:36.53]You can do anything&&" +
        "[01:37.73]but lay off of my blue suede shoes&&" +
        "[01:41.44]Blue blue blue suede shoes&&" +
        "[01:44.69]Blue blue blue suede shoes&&" +
        "[01:46.47]Blue blue blue suede shoes&&" +
        "[01:49.47]Blue blue blue suede shoes&&" +
        "[01:51.25]You can do anything&&" +
        "[01:52.30]but lay off of my blue suede shoes&&" +
        "[01:58.73]&&";

    $scope.lyricArray=[];
    $scope.test=function(){
        $scope.lyricArray = $scope.lyric.split('&&');
        for(var i= 0;i<$scope.lyricArray.length;i++){
            var hms= $scope.lyricArray[i].slice(1,9);
            var rest=$scope.lyricArray[i].slice(10,$scope.lyricArray[i].length);
//            hms=hms.replace(".", ":");
//            var hms = '02:04:33';   // your input string
            var a = hms.split(':'); // split it at the colons
// minutes are worth 60 seconds. Hours are worth 60 minutes.
            var seconds = (a[0]) * 60  + (+a[1]);
console.log(seconds+"&&"+rest);

            var ref= new Firebase("https://nod-music.firebaseio.com/songs/-KJXHK4mmS3WOs-IO6Cs/lyric");
            ref.push(seconds+"&&"+rest);
        }
    }

*/
    

    if($rootScope.ref.getAuth()==null){
        state.go("login");
    }

    /*
     -KJXH1PYd8stQgpsWrMpaddclose
     album:
     "Garage Inc."
     artist:
     "Metallica"
     category:
     "rock"
     duration:
     "4:45"
     image:
     "http://pxhst.co/avaxhome/6c/13/000d136c_medium...."
     title:
     "Whiskey in the jar"
     -KJXH1PYd8ztQtpsWrMp
     album:
     " Stoalin'"
     artist:
     "Isbells"
     category:
     "Indie"
     duration:
     "2:38"
     image:
     "http://www.incendiarymag.com/images/Issue85/In_..."
     title:
     "Baskin"

     */
});