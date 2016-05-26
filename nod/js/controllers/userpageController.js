myApp.controller('userPageCtrl', function($scope,$state,$rootScope){
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

    $scope.updateState=function(){
        $scope.state=$state.$current.url.source;
        $scope.state=$scope.state.replace("/", "");
        $scope.state=$scope.state.replaceAll("/", ".");
        console.log($scope.state);
    };

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    $scope.updateState()

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $scope.state=toState.name;
    })
});