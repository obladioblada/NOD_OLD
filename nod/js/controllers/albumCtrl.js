myApp.controller('albumCtrl', function($scope,$state,$rootScope,NODURL){
    $("#album").height($( window ).height()-350);
    $( window ).resize(function() {
        $("#album").height($( window ).height()-350);
    });

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
    $scope.albums=[];
    $scope.currentAlbum=[];
    $scope.takeOnlyAlbums=function(){
        var albumRef = new Firebase(NODURL+"/songs");
        albumRef.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var song = childSnapshot.val();
                var index=-1;
                for(var i=0;i<$scope.albums.length;i++){
                    //console.log($scope.albums[i][0].name);
                    if($scope.albums[i][0].name==song.album){
                        index=i;
                        i=$scope.albums.length;
                    }
                }
                if (index > -1) {
                    $scope.albums[index].push(song);
                } else {
                    var album = [
                        {
                            name: song.album,
                            image: song.image,
                            artist: song.artist
                        }
                    ];
                    album.push(song);
                    $scope.albums.push(album);
                }
            });
            $scope.chooseAlbum($scope.albums[0]);
        });
    };
    $scope.chooseAlbum=function(a){
        console.log(a[0]);
        $scope.currentAlbum=a;
    };

    $scope.takeOnlyAlbums();
});

