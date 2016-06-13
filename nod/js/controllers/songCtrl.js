myApp.controller('songCtrl', function($scope,$state,$rootScope,NODURL,$firebaseObject){

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
        sref:"home.user.ranking.me"
    };
    $scope.playlist={
        name: 'Playlist',
        icon: 'fa-list',
        styleIcon: "{'margin-left': '2px'}",
        sref:'home.user.playlist'
    };
    $scope.prefereditems.push($scope.preferedsong,$scope.preferedalbums,$scope.preferedartists, $scope.playlist);
    
    
});

