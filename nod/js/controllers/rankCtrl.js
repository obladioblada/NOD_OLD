myApp.controller('rankCtrl', function($scope,USERSURL,$rootScope,$firebaseObject,$state){
     $scope.usersBycountedpeaced=[];
    $scope.limitRank=10;
    $scope.ranknavbaritem=[];
    $scope.mensile={
        text:"Mensile",
        icon: "fa-calendar",
        sref:"home.user.ranking.monthly"
    };
    $scope.mystats={
        text:"io",
        icon: "fa-user",
        sref:"home.user.ranking.me"
    };
    $scope.buddy={
        text: "nodBuddy",
        icon: "fa-heartbeat",
        sref:"home.user.ranking.nodbuddy"
    };
    $scope.ranknavbaritem.push($scope.mystats,$scope.mensile,$scope.buddy);

   
    
    $scope.orderBycountedpeace=function () {
        console.log("scarico vutenti ");
        $scope.usersBycountedpeaced.length=0;
        var ref = new Firebase(USERSURL);
        ref.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                $scope.currentuser=childSnapshot.val();
                $scope.currentuser.id=childSnapshot.key();
            $scope.usersBycountedpeaced.push($scope.currentuser);
            });
        });
        console.log($scope.usersBycountedpeaced);
    };

    $scope.orderBycountedpeace();
    window.onload = function(){
        $scope.orderBycountedpeace();
    };

});

