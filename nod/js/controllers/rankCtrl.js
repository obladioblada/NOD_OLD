myApp.controller('rankCtrl', function($scope,USERSURL,$rootScope,$firebaseObject){
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
        var ref = new Firebase(USERSURL);
        ref.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            $scope.usersBycountedpeaced.push(childSnapshot.val());
            });

        });

    };
    $scope.orderBycountedpeace();

    $scope.takeBuddy= function(){
        var max=0;
        var nodBuddyid={};
        var ref = new Firebase(USERSURL+$rootScope.ref.getAuth().uid);
        $scope.message = $firebaseObject(ref);
        $scope.message.$bindTo($scope, "myUser").then(function(){
            for(var nodder in $scope.myUser.nodbuddy) {
                for(var count in nodder){
                    if(count>max&&!isNaN(count)){
                        nodBuddyid=nodder;
                        max=count;
                    }
                }
            }
            var ref = new Firebase(USERSURL+nodBuddyid);
            $scope.message = $firebaseObject(ref);
            $scope.message.$bindTo($scope, "nodBuddy");
            $scope.countnodbuddy=max;
        });
    };
    $scope.takeBuddy();

});

