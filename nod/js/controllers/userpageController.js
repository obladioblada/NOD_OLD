myApp.controller('userPageCtrl', function($scope){
    $scope.relazioni={
        name: 'Relazioni',
        icon: 'fa-users',
        styleText: "{'margin-left': '-6px'}",
        styleIcon: "{'margin-left': '3px'}",
        sref:'home.user.relation'
    };
    $scope.playlist={
        name: 'Playlist',
        icon: 'fa-list',
        styleText: "",
        styleIcon: "{'margin-left': '2px'}",
        sref:'home.user.playlist'
    };
    $scope.canzoni={
        name: 'Canzoni',
        icon: 'fa-music',
        styleText: "{'margin-left': '-6px'}",
        styleIcon: "{'margin-left': '2px'}",
        sref:'home.user.songs'
    };
    $scope.album={
        name: 'Album',
        icon: 'fa-headphones',
        styleText: "",
        styleIcon: "{'margin-left': '4px'}",
        sref:'home.user.albums'
    };
    $scope.classifiche={
        name: 'Classifiche',
        icon: 'fa-bar-chart',
        styleText: "{'margin-left': '-13px'}",
        styleIcon: "{'margin-left': '2px'}",
        sref:'home.user.classifiche'
    };
    $scope.logoutmenu={
        name: 'Logout',
        icon: 'fa-sign-out',
        styleText: "",
        styleIcon: "{'margin-left': '7px'}"
    };
    $scope.navbaritem=[$scope.relazioni,$scope.playlist,$scope.canzoni,$scope.album,$scope.classifiche,$scope.logoutmenu];
});