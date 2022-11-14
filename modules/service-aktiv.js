/**
 * Registers service worker for app installer. EXISTING SCRIPT USED.
 */
export function serviceWorkerAktiv(){
    if('serviceWorker' in navigator){
        
        navigator.serviceWorker.register('../service-worker.js',{scope:'./'})
        .then(() => {
            console.log('Service Worker erfolgreich registriert');
        })
        .catch((error) => {console.log(error,'uuups')})
    }
}