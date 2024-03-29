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
        });
        if ($scope.found == false)
            $scope.userNameAlreadyUsed = false;
        $scope.found = false;
        console.log("emailalreadyused state" +  $scope.userNameAlreadyUsed);
    };

    $scope.sendValidationEmail=function () {

        var request = $http({
            method: "post",
            url: "validationMail.php",
            data: {
                username: $scope.newUser.username,
                email: $scope.newUser.email,
                pwd: $scope.newUser.pwd
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        /* Check whether the HTTP Request is successful or not. */
        request.success(function (data) {
            if(data.errors){
                $scope.errorName = data.errors.pwd;
                $scope.errorUserName = data.errors.username;
                $scope.errorEmail = data.errors.email;
                console.log("errore: "+data.errors.pwd+" "+data.errors.username+" "+data.errors.email);
            }else {
                $scope.message = data.message;
                console.log("messaggggggggio "+$scope.message);
                $state.go('login');
            }
        });
        
    }


    $scope.charge = function () {
        $(".loadingContainer").addClass("on");
        $(".container-fluid").addClass("blur");
    };
    $scope.stopCharge = function () {
        $(".loadingContainer").removeClass("on");
        $(".container-fluid").removeClass("blur");
    };

    $scope.goToLogin=function(){
        $state.go('login');
    };
    
    $scope.hidemailerror=function () {
        $scope.userNameAlreadyUsed=false;
    };


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
                            $scope.userNameAlreadyUsed = true;
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
                $scope.$apply();
                console.log("emailalreadyused state" +  $scope.userNameAlreadyUsed);
            });
        }
        
    }
});