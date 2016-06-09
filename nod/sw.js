console.log('Started', self);
self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});
self.addEventListener('push', function(event) {
    console.log('Received a push message', event);
// broswerKey AIzaSyA2osVlaB52G_k5Rp1D4VP8QG0NrhnRAm8
//project number 538074622362
});