console.log('Started', self);
self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});
var data;

self.addEventListener('push', function(e) {
    console.log('push received');
    if(data!=undefined){
        console.log(data.title);
        e.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: 'img/logo_nod.png',
                tag:  ""
            }));
    }
    /*
    var   subRef = new Firebase('https://nod-music.firebaseio.com/users/8a7db5a2-8e9a-4e01-8f8b-7c7456d08187/data');
   subRef.on("value", function(snapshot) {
        console.log(snapshot.val());
        e.waitUntil(
            self.registration.showNotification(snapshot.val().title, {
                body: snapshot.val().body,
                icon: 'img/logo_nod.png',
                tag:  snapshot.val().tag
            }));
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });    // Get the notification data, then display notification
    */
});
self.addEventListener('message', function (evt) {
    console.log('postMessage received', evt.data.title);
    data=evt.data;
});
/*
self.addEventListener('push', function(event) {
    console.log('Push message received', event);
    console.log('Started', self);
    self.addEventListener('install', function(event) {
        self.skipWaiting();
        console.log('Installed', event);
    });
    self.addEventListener('activate', function(event) {
        console.log('Activated', event);
    });
    self.addEventListener('push', function(event) {
        console.log('Push message', event);
        var title = 'Nodder collegato';
        event.waitUntil(
            self.registration.showNotification(title, {
                body: 'user',
                icon: 'img/logo_nod.png',
                tag:  'user'
            }));
    });
// TODO
});
    */




// broswerKey AIzaSyA2osVlaB52G_k5Rp1D4VP8QG0NrhnRAm8
//project number 538074622362