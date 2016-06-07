if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log(':^) sw registrato', reg);
        // TODO
    }).catch(function(err) {
        console.log(':^( erroee registrazione sw ', err);
    });
}