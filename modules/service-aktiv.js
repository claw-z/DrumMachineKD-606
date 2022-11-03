export function serviceWorkerAktiv(){
    if('serviceWorker' in navigator){
        
        // ServiceWorker registrieren
        navigator.serviceWorker.register('../service-worker.js',{scope:'./'})
        .then(() => {
            console.log('Service Worker erfolgreich registriert');
        })
        .catch((error) => {console.log(error,'uuups')})
    }
}