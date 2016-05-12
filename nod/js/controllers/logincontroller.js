myApp.controller('loginCtrl',function($scope,$firebaseArray,$location,NODURL,$rootScope,$route){
    $scope.defaultImg='http://penerbitsalemba.com/v3/images/user_default.png';
    var ref = new Firebase(NODURL+"/users");
    $scope.users = $firebaseArray(ref);
    $scope.myUser={
        image:$scope.defaultImg,
        email:'',
        pwd:''
    };
    $scope.userFound=false;
    $scope.lookForUser=function(){
        angular.forEach( $scope.users, function(user) {
            if(user.$id==$scope.myUser.email &&  $scope.userFound==false){
                $scope.myUser.image=user.image;
                $scope.userFound=true;
            }
        });
        if($scope.userFound==false)
            $scope.myUser.image=$scope.defaultImg;
        $scope.userFound=false;
    };
    $scope.goToRegisterPage=function () {
        $location.path('/register');
    };

    $scope.users.$loaded()
        .then($scope.lookForUser());
    $scope.$watch('myUser.id',$scope.lookForUser);
    
    
    $scope.loginUser=function( ) {
        var refLogin=new Firebase(NODURL);
        $scope.charge();
        refLogin.authWithPassword({
            
            email:$scope.myUser.email,
            password:$scope.myUser.pwd
        },
            function (error,userData) {
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
                $scope.proceedToHome();
            }
        });
        $rootScope.loggedUser=true;
    }
    
    
    $scope.loginwithFacebook=function () {
        var ref = new Firebase(NODURL);
        $scope.charge();
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                $scope.stopCharge();
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $scope.proceedToHome();
            }
        });
        $rootScope.loggedUser=true;
    };

    $scope.loginwithGoogle=function () {

        var ref = new Firebase(NODURL);
        $scope.charge();
        ref.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                $scope.stopCharge();
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $scope.proceedToHome();
            }
        });
        $rootScope.loggedUser=true;
    };


   $scope.loginwithtwetter=function () {

       var ref = new Firebase(NODURL);
       $scope.charge();
       ref.authWithOAuthPopup("twitter", function(error, authData) {
           if (error) {
               console.log("Login Failed!", error);
               $scope.stopCharge();
           } else {
               console.log("Authenticated successfully with payload:", authData);
               $scope.proceedToHome();
           }
       });

   }


    $scope.charge = function(){
        $(".loadingContainer").addClass("on");
        $(".container-fluid").addClass("blur");
    }
    $scope.stopCharge = function(){
        $(".loadingContainer").removeClass("on");
        $(".container-fluid").removeClass("blur");
    }

        $scope.proceedToHome=function(){
            $rootScope.loggedUser=true;
            console.log("io vado alla home, ciaaaao!");
            $route.reload();
            $location.path( "home" );
        };


});