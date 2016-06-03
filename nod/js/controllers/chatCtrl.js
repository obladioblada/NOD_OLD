myApp.controller('chatCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject,$firebaseArray){
    $scope.messagetext="";
    console.log("volume "+ $scope.showVolume);
   // $scope.receiver=$firebaseObject(chatref);
    console.log("il parametro passato" + $stateParams.myParam);
    $scope.receiverid=$stateParams.myParam;
    $scope.currentChat=[];
    $scope.msg="";

    $scope.createutc= function(){
        var today = new Date();
        var day = today.getUTCDate();
        var month = today.getUTCMonth()+1; //January is 0!
        var year = today.getUTCFullYear();
        var hours = today.getUTCHours();
        var minutes = today.getUTCMinutes();
        var seconds = today.getUTCSeconds();

        if(day<10) {
            day='0'+day;
        }

        if(month<10) {
            month='0'+month;
        }
        if(hours<10) {
            hours='0'+hours;
        }
        if(minutes<10) {
            minutes='0'+minutes;
        }
        if(seconds<10) {
            seconds='0'+seconds;
        }
        var currentDate = year.toString()+'-'+month.toString()+'-'+day.toString()+'-'+hours.toString()+':'+minutes.toString()+':'+seconds.toString();
        return currentDate;
    };

    $scope.setChat=function(){
        var userRef = new Firebase(USERSURL+$scope.receiverid);
        $scope.receiverObj=$firebaseObject(userRef);
        $scope.receiverObj.$bindTo($scope, 'receiver');
        console.log($scope.receiver.$id);
        var mioid=$rootScope.ref.getAuth().uid;
        console.log("mioid"+mioid);
        $scope.uidchat=mioid+"-"+$scope.receiverid;
        if(mioid.localeCompare($scope.receiverid)==-1) $scope.uidchat=$scope.receiverid+"-"+mioid;
        console.log("uidchat "+$scope.uidchat);
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
            isTyping: false
        });
    };
    $scope.$watch('currentChat',function(){
            setTimeout(function () {
                $(".chat-messages").scrollTop(9999999);
            });
        });

    $scope.$watch('receiver.isTyping',function(){
        console.log("conrollo se l'altro scrive "+$scope.receiver.isTyping);
        if($scope.receiver.isTyping){
            friendIsTyping();
        }else {
            friendStoppedTyping();
        }
    });

    $scope.$watch('msg',function(){
        var typing=true;
        if($scope.msg.length==0) typing=false;
        var ref = new Firebase(USERSURL+$rootScope.ref.getAuth().uid);
        ref.update({
            isTyping: typing
        });
    });


    $scope.setChat();

    $scope.sendMessageAngular=function(){
        var message=$scope.msg;
        console.log($scope.msg);
        if(message=="") return;
        $scope.chatref.push({
            sender: $rootScope.ref.getAuth().uid,
            text:message,
            utc: $scope.createutc()
        });
        $scope.msg="";
        setTimeout(function () {
            $(".chat-messages").scrollTop(9999999);
        });
    };


    getchatmessages=function () {
        var messagesref = new Firebase(MESSAGEURL);
        $scope.chatmessages=$firebaseArray(messagesref.limit(20));
        console.log($scope.message);
    };
  
});

