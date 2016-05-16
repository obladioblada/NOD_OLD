myApp.controller('registrationCtrl', function ($scope, $firebaseArray, $location, NODURL,$http,$state) {
    var ref = new Firebase(NODURL + "/users");
    $scope.users = $firebaseArray(ref);
    $scope.newUser = {
        email: '',
        pwd: '',
        username: ''
    };
    $scope.userNameAlreadyUsed = false;
    $scope.found = false;


    $scope.checkUserName = function () {
        angular.forEach($scope.users, function (user) {
            if (user.$id == $scope.newUser.username && $scope.found == false) {
                $scope.userNameAlreadyUsed = true;
                $scope.found = true;
            }
            // if(user.$id!=$scope.newUser.username)  $scope.userNameAlreadyUsed=false;
        })
        if ($scope.found == false)
            $scope.userNameAlreadyUsed = false;
        $scope.found = false;
    };

    $scope.sendValidationEmail=function () {
        $http({
            method:'GET',
            url: 'validationMail.php',
            data:$scope.newUser
        })
            .success(function (data) {
                if(data.errors){
                    $scope.errorName = data.errors.name;
                    $scope.errorUserName = data.errors.username;
                    $scope.errorEmail = data.errors.email;
                }else {
                    $scope.message = data.message;
                }
            });
        
    }


    $scope.charge = function () {
        $(".loadingContainer").addClass("on");
        $(".container-fluid").addClass("blur");
    }
    $scope.stopCharge = function () {
        $(".loadingContainer").removeClass("on");
        $(".container-fluid").removeClass("blur");
    }


    $scope.users.$loaded()
        .then($scope.checkUserName());
    $scope.$watch('newUser.username', $scope.checkUserName);
    $scope.registerNewUser = function (isvalid) {
        console.log(" form valido :" + isvalid);
        if (isvalid) {
            $scope.charge();
            ref.createUser({
                email: $scope.newUser.email,
                password: $scope.newUser.pwd,
                username: $scope.newUser.username,
                active:false
            }, function (error, userData) {
                if (error) {
                    $scope.stopCharge();
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
                    $scope.sendValidationEmail();
                    $state.go('login');
                }
            });
        }
        
    }
});