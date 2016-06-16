
myApp.controller('artistCtrl', function($scope,$state,$rootScope,NODURL,$firebaseObject){


    $scope.prefereditems=[];
    $scope.preferedsong={
        text:"Caonzoni",
        icon: "fa fa-music",
        sref:"home.user.songs"
    };
    $scope.preferedalbums={
        text:"Albums",
        icon: "fa fa-headphones",
        sref:"home.user.albums"
    };
    $scope.preferedartists={
        text: "Artisti",
        icon: "fa fa-user-md",
        sref:"home.user.artist"
    };
    $scope.playlist={
        text: 'Playlist',
        icon: 'fa-list',
        styleIcon: "{'margin-left': '2px'}",
        sref:'home.user.playlist'
    };
    $scope.prefereditems.push($scope.preferedsong,$scope.preferedalbums,$scope.preferedartists, $scope.playlist);
    $scope.mypreferredartists="";
    $scope.preferredsongOBJ=$firebaseObject(new Firebase(NODURL+"/users/"+$rootScope.ref.getAuth().uid+"/preferredartists"));
    $scope.preferredsongOBJ.$bindTo($scope, 'mypreferredartists').then(
       function () {
           console.log("le mie canzoni preferite sono: ");
           console.log($scope.mypreferedartists);
       }
    );

});


