myApp.controller('nodderCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject){
    var nodderlikedRef  = new Firebase(USERSURL+$stateParams.nodder+"/peaced/");
    var nodderRef;
    var mykeypeaced;

    $scope.setnodder=function () {
        $scope.nodder="";
        nodderRef = new Firebase(USERSURL+$stateParams.nodder);
        console.log("il parametro passato è" + $stateParams.nodder);
        console.log("il ref è" + nodderRef);
        $scope.nodderOBJ=$firebaseObject(nodderRef);
        console.log("il nodderOBJ id  è" + $scope.nodderOBJ.$id);
        $scope.nodderOBJ.$bindTo($scope, 'nodder').then(function () {
        });

    };
    $scope.setnodder();

    $scope.gotochat=function (receiverid) {
        $state.go('home.user.chat', { myParam: receiverid});
    };


    $scope.setPeaceToNodder=function () {
        console.log("dentro set");
        if($scope.checkIfNodderExist($rootScope.ref.getAuth().uid)==false){
             nodderlikedRef.push($rootScope.ref.getAuth().uid);
        }
        else{ nodderlikedRef.child(mykeypeaced).remove(); }
    };

    $scope.checkIfNodderExist=function (id) {
        var bool=false;
        nodderlikedRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                  mykeypeaced = childSnapshot.key();
                var value = childSnapshot.val();
                if(angular.equals(value,id)) {
                    bool = true;
                }
            });
            if(snapshot.numChildren()>0) count=snapshot.numChildren()-1;
            else count=0;
        });
        return bool;
    };

});


