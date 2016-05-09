myApp.controller('registrationcCtrl', function ($scope,$firebaseArray,NODURL){
    var ref = new Firebase(NODURL+"/users" );
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
        var refAuth = new Firebase(NODURL);
        refAuth.createUser({
            email:$scope.newUser.email,
          password:$scope.newUser.pwd,
            username:$scope.newUser.username
        }, function (error,userData) {
            if (error) {
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                    default:
                        console.log("Error creating user:", error);
                }
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
        })
        
    };
});