myApp.controller('chatCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject,$firebaseArray){
    $scope.messagetext="";
    console.log("volume "+ $scope.showVolume);
   // $scope.receiver=$firebaseObject(chatref);
    console.log("il parametro passato" + $stateParams.myParam);
    $scope.receiverid=$stateParams.myParam;
    $scope.currentChat=[];

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
        console.log("utc" + currentDate);
        return currentDate;
    };

    $scope.setChat=function(){
        var userRef = new Firebase(USERSURL+$scope.receiverid);
        $scope.receiver=$firebaseObject(userRef);
        console.log($scope.receiver.$id);
        var mioid=$rootScope.ref.getAuth().uid;
        console.log("mioid"+mioid);
        $scope.uidchat=mioid+"-"+$scope.receiverid;
        if(mioid.localeCompare($scope.receiverid)==-1) $scope.uidchat=$scope.receiverid+"-"+mioid;
        console.log("uidchat "+$scope.uidchat);
        $scope.chatref= new Firebase(CHATSURL+$scope.uidchat);
        $scope.chatObj=$firebaseObject($scope.chatref);
        $scope.chatObj.$bindTo($scope, 'currentChat');

        $scope.chatref.push({
            receiver:"sempronio",
            sender:"pippo",
            text:"coccola",
            utc: $scope.createutc()
        });

    };

    $scope.setChat();


    
    getchatmessages=function () {
        var messagesref = new Firebase(MESSAGEURL);
        $scope.chatmessages=$firebaseArray(messagesref.limit(20));
        console.log($scope.message);
    };
  
});

