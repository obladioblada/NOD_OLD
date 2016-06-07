myApp.controller('rankCtrl', function($scope){
    $scope.ranknavbaritem=[];
    $scope.mensile={
        text:"Mensile",
        icon: "fa-calendar",
        sref:"home.user.ranking.monthly"
    };
    $scope.mystats={
        text:"io",
        icon: "fa-user",
        sref:"home.user.ranking.me"
    };
    $scope.buddy={
        text: "nodBuddy",
        icon: "fa-heartbeat",
        sref:"home.user.ranking.me"
    };
    $scope.ranknavbaritem.push($scope.mystats,$scope.mensile,$scope.buddy);

    $scope.limitRank=5;
    $( window ).resize(function() {
        $scope.resizeThem();
    });
    $scope.resizeThem=function(){
        $(".item-ranking-navbar").css({
            width: ($(".tabContainer").width()/$scope.ranknavbaritem.length)-10
        });
    };
    setTimeout(function(){$scope.resizeThem()});
});

