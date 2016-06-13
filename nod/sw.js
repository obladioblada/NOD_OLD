"use strict";

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});

var data="";

self.addEventListener('push', function(e) {
    console.log("sono dentro all'evento push");
    console.log(e);
    console.log("data è" + data.title);
    if(data!=undefined){
        console.log('push received' + data.title);
        console.log(data.title);
        var title=data.title;
        e.waitUntil(
            self.registration.showNotification(title, {
                body: data.body,
                icon: 'img/logo_nod.png',
                tag:  data.tag
            }));
    }
});

self.addEventListener('message', function (evt) {
    console.log(evt);
    console.log('postMessage received', evt.data.title);
    data=evt.data;
});


self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag ', event.notification.tag);
    event.notification.close();
    var url = 'http://localhost:63342/nod/nod/index.html#/home/user/nodder'+event.notification.tag;
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function(windowClients) {
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});




// broswerKey AIzaSyA2osVlaB52G_k5Rp1D4VP8QG0NrhnRAm8
//project number 538074622362