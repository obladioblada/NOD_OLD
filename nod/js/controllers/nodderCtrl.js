myApp.controller('nodderCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject){
    var nodderlikedRef  = new Firebase(USERSURL+$stateParams.nodder+"/peaced/");
    var nodderRef;
    var mykeypeaced;
    $scope.count=0;

    $scope.setnodder=function () {
        $scope.nodder="";
        nodderRef = new Firebase(USERSURL+$stateParams.nodder);
        $scope.nodderOBJ=$firebaseObject(nodderRef);
        $scope.nodderOBJ.$bindTo($scope, 'nodder').then(function () {
        });

    };
    $scope.setnodder();

    $scope.gotochat=function (receiverid) {
        $state.go('home.user.chat', { myParam: receiverid});
    };


    $scope.setPeaceToNodder=function () {
        if($scope.checkIfNodderExist($rootScope.ref.getAuth().uid)==false){
            nodderlikedRef.push($rootScope.ref.getAuth().uid);
            nodderRef.update({
                countpeaced: $scope.count+1
            });

        }

        else{
            nodderlikedRef.child(mykeypeaced).remove();
            nodderRef.update({
                countpeaced: $scope.count-1
            });}
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
            $scope.count=snapshot.numChildren();

        });
        return bool;
    };

    /**
     * @return {boolean}
     */
    $scope.ThereArePrefered= function(){
        return $scope.nodder.preferredsong.length!=0;


    }

});


