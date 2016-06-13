myApp.controller('rankCtrl', function($scope,USERSURL){
     $scope.usersBycountedpeaced=[];
    $scope.limitRank=5;
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
        sref:"home.user.ranking.me"
    };
    $scope.ranknavbaritem.push($scope.mystats,$scope.mensile,$scope.buddy);

   
    
    $scope.orderBycountedpeace=function () {
        var ref = new Firebase(USERSURL);
        ref.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            $scope.usersBycountedpeaced.push(childSnapshot.val());
            });

        });

    };
    $scope.orderBycountedpeace();

});

