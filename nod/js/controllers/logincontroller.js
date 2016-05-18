myApp.controller('loginCtrl',function($scope,$firebaseArray,$location,NODURL,$rootScope){
    $scope.defaultImg='http://penerbitsalemba.com/v3/images/user_default.png';
    var ref = new Firebase(NODURL+"/users");
    ref.unauth();
    $rootScope.ref=ref;
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

   // $scope.$watch('myUser.id',$scope.lookForUser);


    $scope.loginUser=function( ) {
        $scope.charge();
        ref.authWithPassword({

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
    }


    $scope.loginwithFacebook=function () {
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
    };

    $scope.loginwithGoogle=function () {

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
    };


   $scope.loginwithtwetter=function () {
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
            $location.path( "home" );
        };


    ref.onAuth(function(authData) {
        if (authData) {
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            ref.once("value", function(snapshot) {
                if(authData!=null) {
                    if (snapshot.child(authData.uid).child("image").exists() == false) {
                        ref.child(authData.uid).set({
                            provider: authData.provider,
                            name: getName(authData),
                            image: 'http://penerbitsalemba.com/v3/images/user_default.png'
                        });
                    } else {
                        ref.child(authData.uid).set({
                            provider: authData.provider,
                            name: getName(authData)
                        });
                    }
                    console.log("e authdata vale "+authData.uid);
                }
            });
            $rootScope.ref=ref;
        }
    });
// find a suitable name based on the meta info given by each provider
    function getName(authData) {
        switch(authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
        }
    }
});