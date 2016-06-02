myApp.controller('chatCtrl', function($scope,USERSURL,$firebaseObject){
    $scope.currentChatFriend="Franco";
    $scope.users=[];
    var refusers = new Firebase(USERSURL);
    $scope.usersObj = $firebaseObject(refusers);
    $scope.usersObj.$bindTo($scope, 'users');
    $scope.usersObj.$loaded()
        .then(function(){
            setTimeout(function () {
                $(".chat-messages").scrollTop(9999999);
            });
    });
});
