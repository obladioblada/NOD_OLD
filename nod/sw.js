console.log('Started', self);
self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});
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