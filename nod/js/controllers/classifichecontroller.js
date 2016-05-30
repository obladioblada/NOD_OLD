myApp.controller('userPageCtrl', function($scope,$state,$rootScope){

    $scope.home={
        name: '',
        icon: 'fa-home',
        styleText: "",
        styleIcon: "{'margin-left': '3px'}",
        sref:''

    };
    $scope.relazioni={
        name: '',
        icon: 'fa-users',
        styleText: "{'margin-left': '-6px'}",
        styleIcon: "{'margin-left': '3px'}",
        sref:''
    };

    $scope.navbaritem=[$scope.home,$scope.relazioni,$scope.playlist,$scope.canzoni,$scope.album,$scope.classifiche,$scope.chat,$scope.settings,$scope.logoutmenu];

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
