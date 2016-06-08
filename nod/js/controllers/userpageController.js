myApp.controller('userPageCtrl', function($scope,$state,$rootScope){

    $scope.home={
        name: 'Home',
        icon: 'fa-home',
        styleIcon: "{'margin-left': '0px'}",
        sref:'home.user.music'

    };
    $scope.relazioni={
        name: 'Relazioni',
        icon: 'fa-users',
        styleIcon: "{'margin-left': '0px'}",
        sref:'home.user.relation'
    };
    $scope.playlist={
        name: 'Playlist',
        icon: 'fa-list',
        styleIcon: "{'margin-left': '2px'}",
        sref:'home.user.playlist'
    };
    $scope.canzoni={
        name: 'Canzoni',
        icon: 'fa-music',
        styleIcon: "{'margin-left': '0px'}",
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
        name: 'ranking',
        icon: 'fa-bar-chart',
        styleIcon: "{'margin-left': '4px'}",
        sref:'home.user.ranking.me'
    };
    $scope.chat={
        name:"Chat",
        icon:'fa-comments',
        styleIcon:'',
        sref:'home.user.chat'
    }
    $scope.settings={
        name: 'Settings',
        icon: 'fa-sliders',
        styleIcon: "{'margin-left': '0px'}",
        sref:'home.user.settings'
    };
   
    $scope.navbaritem=[$scope.home,$scope.relazioni,$scope.playlist,$scope.canzoni,$scope.album,$scope.classifiche,$scope.chat,$scope.settings];

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