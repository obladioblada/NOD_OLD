myApp.controller('playlistCtrl', function($scope,$state,$rootScope,USERSURL,CHATSURL,$stateParams,$firebaseObject){
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

});

