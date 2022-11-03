import { db } from './db.js';
import {el } from './lib.js';
import { loopToggle, stopTime } from './main.js';
import { ptnArr } from './sounds.js';


export async function showSaveArea(){

    // Loop anhalten bei Klick auf Save
    if(!stopTime) {loopToggle();}

    const dbArea = el('#db-area');
    dbArea.innerHTML = '';
    dbArea.className = 'area-aktiv';
    
    const data = await (await fetch('data/db-saver.html')).text();
    dbArea.innerHTML = data;

    // abbrechen
    el('#cancel').addEventListener('click',function(){
    dbArea.innerHTML = '';
    dbArea.className = 'area-passiv';
   });

   // speichern
   el('#saveproject').addEventListener('click',saveProject);
}


async function saveProject(){
    
    const title = el('#project-title').value;
    
    // Prüfung ob Titel Eingabe erfolgt ist
    if(title === '') {return alert('Please enter a project name');}

    // Prüfung, ob der Titel schon vergeben ist
    const data = await db.readAll();

    data.forEach((project) => {
       if (title === project.title) {
           if(!confirm('Overwrite File?')){
            return;
           }
           else {
            const key = project.id;
            db.deleteItem(key);
           }
       }
    })
    
    const project = {
        title : title,
        patterns : ptnArr,
        id : Date.now()
    }
    
    db.update(project);
    
     // Maske wieder weg
    el('#db-area').className = 'area-passiv';
    el('#db-area').innerHTML = '';

    el('#file-info').innerText = `Project: ${project.title}`;   
}