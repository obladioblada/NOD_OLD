myApp.controller('chatCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject,$firebaseArray){
    $scope.messagetext="";
    console.log("volume "+ $scope.showVolume);
   // $scope.receiver=$firebaseObject(chatref);
    console.log("il parametro passato" + $stateParams.myParam);
    $scope.receiverid=$stateParams.myParam;
    $scope.currentChat=[];
    $scope.msg="";
    $scope.lastType=0;
    $scope.currenttype=0;


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
        console.log("Qualcosa è sucesso nella chat!!");
        $scope.chatref.once("value", function(snapshot) {
            // The callback function will only get called once since we return true
            snapshot.forEach(function(message) {
                var key = message.key();
                if(message.sender!=$rootScope.ref.getAuth().uid&&message.read==false){
                    console.log(message.text+" "+message.read);
                    $scope.chatref.child($scope.uidchat).child(key).update({
                        read: true
                    });
                }
                return true;
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
                friendStoppedTyping();
            }
        }
    });

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
                $scope.checkIfTyping();
            }
        },$scope.delayCheck);
    };


    $scope.setChat();

    $scope.sendMessageAngular=function(){
        var message=$scope.msg;
        console.log($scope.msg);
        if(message=="") return;
        $scope.chatref.push({
            sender: $rootScope.ref.getAuth().uid,
            text:message,
            utc: new Date().toJSON(),
            read: false
        });
        $scope.msg="";
        setTimeout(function () {
            $(".chat-messages").scrollTop(9999999);
        });
    };

});

