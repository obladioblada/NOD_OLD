myApp.controller('nodderCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject){

    $scope.setnodder=function () {
        $scope.nodder="";
        var nodderRef = new Firebase(USERSURL+$stateParams.nodder);
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

});

/**
 * Created by gianpaolobasilico on 5/6/16.
 */
