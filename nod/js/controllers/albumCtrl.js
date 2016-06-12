myApp.controller('albumCtrl', function($scope,$state,$rootScope,NODURL,$firebaseObject){
    $("#album").height($( window ).height()-350);
    $( window ).resize(function() {
        $("#album").height($( window ).height()-350);
    });

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

