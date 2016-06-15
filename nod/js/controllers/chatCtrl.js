myApp.controller('chatCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject){
    $scope.messagetext="";
    console.log("volume "+ $scope.showVolume);
   // $scope.receiver=$firebaseObject(chatref);
    $scope.receiverid=$stateParams.myParam;
    $scope.currentChat=[];
    $scope.msg="";
    $scope.lastType=0;
    $scope.currenttype=0;
    $scope.emojiOpened=false;
    $scope.receiver="";
    $scope.inputIndex=0;

    $scope.openEmoji=function(){
        $scope.emojiOpened=!$scope.emojiOpened;
    };
    var userRef;
    var mioid;
    $scope.setChat=function(){
       // console.log("sono dentro");
        if($stateParams.myParam==null&&$scope.myUser.lastreceiver!=null) {
        //    console.log("il parametro passato" + $stateParams.myParam);
         //   console.log("last receiver is" + $scope.myUser.lastreceiver);
            $scope.receiverid = $scope.myUser.lastreceiver;
        }else {
            if($stateParams.myParam==null&&$scope.myUser.lastreceiver==null) {
                $scope.receiverid = "facebook:10209013240030119";
            }
        }
      //  console.log("receiverid è "+$scope.receiverid);
        userRef = new Firebase(USERSURL+$scope.receiverid);
        $scope.receiverObj=$firebaseObject(userRef);
        $scope.receiverObj.$bindTo($scope, 'receiver').then(function () {
            console.log("il receiver è" + $scope.receiver.name);
            mioid=$rootScope.ref.getAuth().uid;
            $scope.uidchat=mioid+"-"+$scope.receiverid;
            if(mioid.localeCompare($scope.receiverid)==-1) $scope.uidchat=$scope.receiverid+"-"+mioid;
            console.log("uidchat "+$scope.uidchat);
            console.log("il receiver è" + $scope.receiver);
            $scope.chatref= new Firebase(CHATSURL+$scope.uidchat);
            $scope.chatref.orderByChild("utc").on("child_added", function(snapshot){
            });
            $scope.chatObj=$firebaseObject($scope.chatref);
            $scope.chatObj.$bindTo($scope, 'currentChat');
            $scope.chatObj.$loaded()
                .then(function(){
                    setTimeout(function () {
                        $(".chat-messages").scrollTop(9999999);
                    });
                });
            var ref = new Firebase(USERSURL+$rootScope.ref.getAuth().uid);
            ref.update({
                currentChat:$scope.uidchat,
                isTyping: false,
                lastreceiver:$scope.receiver.$id
            });
        });


    };

    $scope.$watch('currentChat',function(){
        var ref = new Firebase(CHATSURL+$scope.uidchat);
        ref.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key();
                var mess = childSnapshot.val();

                if(mess.read==false&&mess.sender!=$rootScope.ref.getAuth().uid){
                    //console.log(mess.text);
                    ref.child(key).update({
                        read: true
                    });


                    var index = -1;
                   // console.log("devo rimuovere "+mess.text);
                    for(var i= 0;i<$scope.messaggiNonLetti.length;i++){
                        var curr=$scope.messaggiNonLetti[i];
                        if(curr.sender==mess.sender&&curr.utc==mess.utc&&curr.text==mess.text){
                            index=i;
                            i=$scope.messaggiNonLetti.length;
                        }
                    }

                    if (index > -1) {
                        $scope.messaggiNonLetti.splice(index, 1);
                    }
                }

            });
        });
         setTimeout(function () {
                $(".chat-messages").scrollTop(9999999);
            });
    });

    $scope.$watch('receiver.isTyping',function(){
        if($scope.receiver.currentChat==$scope.uidchat) {
            if ($scope.receiver.isTyping) {
                friendIsTyping();
            } else {
                if($state.current.name=="home.user.chat")
                   setTimeout(friendStoppedTyping(),2000);
            }
        }
    });

    function friendIsTyping() {
        if($state.current.name=="home.user.chat"){
        var $effectContainer=$(".chat-effect-container");
            var $infoContainer=$(".chat-info-container");

            var $dots = $("<div/>")
                .addClass('chat-effect-dots')
                .css({
                    top: -30 + bleeding,
                    left: 10
                })
                .appendTo($effectContainer)
            ;
        for (var i = 0; i < 3; i++) {
            var $dot = $("<div/>")
                    .addClass("chat-effect-dot")
                    .css({
                        left: i * 20
                    })
                    .appendTo($dots)
                ;
            TweenMax.to($dot, 0.3, {
                delay: -i * 0.1,
                y: 30,
                yoyo: true,
                repeat: -1,
                ease: Quad.easeInOut
            })
        }
        ;

        var $info = $("<div/>")
            .addClass("chat-info-typing")
            .text("il tuo amico Nodder sta scrivendo...")
            .css({
                transform: "translate3d(0,30px,0)"
            })
            .appendTo($infoContainer)

        TweenMax.to($info, 0.3, {
            y: 0,
            force3D: true
        });

        gooOn();
    }
    }

    function friendStoppedTyping(){
        if($state.current.name=="home.user.chat"){
            var $effectContainer=$(".chat-effect-container");
            var $infoContainer=$(".chat-info-container");


            var $dots=$effectContainer.find(".chat-effect-dots");
        TweenMax.to($dots,0.3,{
            y:40,
            force3D:true,
            ease:Quad.easeIn,
        });

        var $info=$infoContainer.find(".chat-info-typing");
        TweenMax.to($info,0.3,{
            y:30,
            force3D:true,
            ease:Quad.easeIn,
            onComplete:function(){
                $dots.remove();
                $info.remove();

                gooOff();
            }
        });
            }
    }

    $scope.checkingYet=false;
    $scope.delayCheck=2000;

    $scope.$watch('msg',function(){
        var typing=true;
        if($scope.msg.length==0) typing=false;
        var ref = new Firebase(USERSURL+$rootScope.ref.getAuth().uid);
        ref.update({
            isTyping: typing
        });
        $scope.lenghtOfLastModify=$scope.msg.length;
        $scope.currenttype = new Date().getTime();
        if($scope.checkingYet==false){
            $scope.checkIfTyping();
        }
    });

    $scope.checkIfTyping=function(){
        $scope.checkingYet=true;
        setTimeout(function(){
            $scope.checkingYet=true;
            var sub=new Date().getTime()-$scope.currenttype;
            if($scope.lenghtOfLastModify==$scope.msg.length && sub>$scope.delayCheck){
                var ref = new Firebase(USERSURL + $rootScope.ref.getAuth().uid);
                ref.update({
                    isTyping: false
                });
                $scope.checkingYet=false;
            }else{
                setTimeout($scope.checkIfTyping());
            }
        },$scope.delayCheck);
    };


    $scope.addEmojiToMsg=function(m){
        var first = $scope.msg.slice(0,$scope.inputIndex);
        var last = $scope.msg.slice($scope.inputIndex,$scope.msg.length);
        $scope.msg = first+m+last;
    };

    $scope.limit=150;
    $scope.loadMore = function() {
        $scope.limit += 150;
    };

    setTimeout($scope.setChat());

    $scope.sendMessageAngular=function(){
        $scope.emojiOpened=false;
        $scope.searchForEmoji(0);
        var message=$scope.msg;
      //  console.log($scope.msg);
        if(message=="") return;
        $scope.chatref.push({
            sender: $rootScope.ref.getAuth().uid,
            text:message,
            utc: new Date().toJSON(),
            read: false
        });
        $scope.sendPush( $scope.myUser.name +" ti ha scritto" , $scope.msg, "https://nod-music.firebaseapp.com/#/home/user/chat"+$scope.uidchat, $scope.myUser.image );
        $scope.msg="";
        setTimeout(function () {
            $(".chat-messages").scrollTop(9999999);
        });
    };

    $scope.smiles=[":\\)",":P",":p","B\\)","B\\|",":\\*",":o",":O",":S",":s","&lt;3","\\\\\/",":\\(","spotify","deezer"];
    $scope.emojis=["&#x1F60A;","&#x1F60B;","&#x1F60B;","&#x1F60E;","&#x1F60E;","&#x1F618;","&#x1F62E;","&#x1F631;","&#x1F633;","&#x1F633;"," &#x2764;","&#x270C;"," &#x1F61E;","&#x1F4A9;","&#x1F4A9;"];
    $scope.searchForEmoji= function(indexsmile){
        var smile=$scope.msg.search($scope.smiles[indexsmile]);
        var cuore=3;
        if(indexsmile!=10){cuore=0;}
        if(indexsmile==13){cuore=5;}
        if(indexsmile==14){cuore=4;}
        if(smile!=-1){
            var before=$scope.msg.slice(0,smile);
            var after=$scope.msg.slice(smile+2+cuore,$scope.msg.length);
            $scope.msg=before+$scope.emojis[indexsmile]+after;
            $scope.searchForEmoji(indexsmile);
        }else{
            indexsmile++;
            if(indexsmile<$scope.smiles.length){
                $scope.searchForEmoji(indexsmile);
            }
        }
    }

    function getCaretPosition(editableDiv) {
        var caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode == editableDiv) {
                    caretPos = range.endOffset;
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() == editableDiv) {
                var tempEl = document.createElement("span");
                editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                var tempRange = range.duplicate();
                tempRange.moveToElementText(tempEl);
                tempRange.setEndPoint("EndToEnd", range);
                caretPos = tempRange.text.length;
            }
        }
        return caretPos;
    }
    var updateInputIndex = function() {
        $scope.inputIndex=getCaretPosition(this);
    };
    $('.chat-input').on("mousedown mouseup keydown keyup", updateInputIndex);

});

