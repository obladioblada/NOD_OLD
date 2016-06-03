myApp.controller('chatCtrl', function($scope,$state,$rootScope,USERSURL,MESSAGEURL,$firebaseArray){
    $scope.messagetext="";
    console.log("volume "+ $scope.showVolume);

    
    
    createMessage= function(sender, senderName, receiver, text){
        var newMessage = {};
        newMessage['sender'] = sender;
        newMessage['senderName'] = senderName;
        newMessage['receiver'] = receiver;
        newMessage['text'] = $scope.messagetext;
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
        newMessage['utctime'] = currentDate;
        console.log("il nuovo messaggio è" + newMessage);
    };
    
    getchatmessages=function () {
        var messagesref = new Firebase(MESSAGEURL);
        $scope.chatmessages=$firebaseArray(messagesref.limit(20));
        console.log($scope.message);
    };
  
});

