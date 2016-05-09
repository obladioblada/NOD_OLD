myApp.controller('loginCtrl',function($scope,$firebaseArray,$location){
    $scope.defaultImg='http://penerbitsalemba.com/v3/images/user_default.png';
    var ref = new Firebase("https://nod-music.firebaseio.com/users");
    $scope.users = $firebaseArray(ref);
    $scope.myUser={
        image:$scope.defaultImg,
        id:'',
        pwd:''
    };
    $scope.userFound=false;
    $scope.lookForUser=function(){
        angular.forEach( $scope.users, function(user) {
            if(user.$id==$scope.myUser.id &&  $scope.userFound==false){
                $scope.myUser.image=user.image;
                $scope.userFound=true;
            }
        })
        if($scope.userFound==false)
            $scope.myUser.image=$scope.defaultImg;
        $scope.userFound=false;
    };
    $scope.goToRegisterPage=function () {
        $location.path('register');
    };

    $scope.users.$loaded()
        .then($scope.lookForUser());
    $scope.$watch('myUser.id',$scope.lookForUser);
});