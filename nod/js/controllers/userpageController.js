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

    $scope.preferiti={
        name: 'Preferiti',
        icon: 'fa-hand-peace-o',
        styleIcon: "{'margin-left': '0px'}",
        sref:'home.user.songs'
    };

    $scope.classifiche={
        name: 'ranking',
        icon: 'fa-bar-chart',
        styleIcon: "{'margin-left': '4px'}",
        sref:'home.user.ranking.monthly'
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
   
    $scope.navbaritem=[$scope.home,$scope.relazioni,$scope.preferiti,$scope.classifiche,$scope.chat,$scope.settings];

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

    $scope.updateState();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $scope.state=toState.name;
    })
});