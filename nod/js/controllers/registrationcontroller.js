myApp.controller('registrationcCtrl', function ($scope,$firebaseArray){
    var ref = new Firebase("https://nod-music.firebaseio.com/users");
    $scope.users = $firebaseArray(ref);
    $scope.newUser={
        email:'',
        pwd:'',
        username:''
    };
    $scope.userNameAlreadyUsed=false;
    $scope.found=false;
    $scope.checkUserName=function (){
        angular.forEach($scope.users, function (user) {
            if(user.$id==$scope.newUser.username &&$scope.found==false) {
                $scope.userNameAlreadyUsed = true;
                $scope.found=true;
            }
           // if(user.$id!=$scope.newUser.username)  $scope.userNameAlreadyUsed=false;
        })
        if($scope.found==false)
            $scope.userNameAlreadyUsed=false;
        $scope.found=false;
    };
    $scope.users.$loaded()
        .then($scope.checkUserName());
    $scope.$watch('newUser.username',$scope.checkUserName);

    $scope.registerNewUser=function () {
    };
});