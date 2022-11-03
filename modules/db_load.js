import { deleteCSSArr, kitCountToZero, soundCSSArr, voiceArrToStepCSSArr } from './buttons.js';
import {db} from './db.js';
import {el, create} from './lib.js';
import { initValue, loopToggle, stopTime } from './main.js';
import { ptnArrChange } from './sounds.js';

export async function showLoadArea(){

   // Loop anhalten bei Klick auf Load
   if(!stopTime) {loopToggle();}

   const dbArea = el('#db-area');
   dbArea.innerHTML = '';
   dbArea.className = 'area-aktiv';
   const data = await (await fetch('./data/db-loader.html')).text();
   dbArea.innerHTML = data;
   
   // abbrechen
   el('#cancel').addEventListener('click',function(){
    dbArea.innerHTML = '';
    dbArea.className = 'area-passiv';
   });
   
   dbAusgabe();
}

 async function dbAusgabe(){
    
    const data = await db.readAll();
    
    // Prüfung auf vorhandene Projekt-Dateien
    if (data.length === 0){
        // HTML Maske weg
        const dbArea = el('#db-area');
        dbArea.innerHTML = '';
        dbArea.className = 'area-passiv';
        // Hinweis an den User
        return alert('No project files available');

    } 
    
    dbGenerator(data);

}

function dbGenerator(data){
    const wrapper = create('div');
    wrapper.setAttribute('id','item-wrapper');
    data.forEach((item) => {
        const div = create('div');
        div.className = 'item';

        //###############################
        // span Element für den Titel
        const span = create('span');
        span.className = 'titel';
        span.innerText = `Project Name: ${item.title}`;
        div.append(span);

        //#################################
        // load Button
        const loadBtn = create('button');
        loadBtn.setAttribute('data-id',item.id);
        loadBtn.className = 'loader';
        loadBtn.innerText = 'Load Project';
        loadBtn.addEventListener('click',loadItem);
        div.append(loadBtn);

        //###################################
        // delete Button
        const delBtn = create('button');
        delBtn.setAttribute('data-id',item.id);
        delBtn.className = 'delete';
        delBtn.innerText = 'X';
         delBtn.addEventListener('click',deleteItem);
        div.append(delBtn) ;

        //###################################
        wrapper.append(div);

    });// ENDE forEach

    el('#show-projects').innerHTML = '';
    el('#show-projects').append(wrapper);

}

//####################################################
// delete Button Script
function deleteItem(){
    // 1. Warnung an User
    if(!confirm('Attention! You are deleting a project!')){
        return;
    };

    // 2. Löschen aus der db
    const key = parseInt(this.getAttribute('data-id'));
    db.deleteItem(key);

    // 3. Eintrag as DOM löschen
    el('#item-wrapper').removeChild(this.parentNode);
}


async function loadItem(){
    // 1. gesuchtes Projekt aus db auslesen
    const key = parseInt(this.getAttribute('data-id'));

    const project = await db.readItem(key);
   
    if(!project){
        // Botschaft an user
        return alert('Not a valid file');
    }

    // Alle Werte an die App übergeben
    // 1. Titel übergeben
    el('#file-info').innerText = `Project: ${project.title}`;

    // 2. alle Patterns wiederherstellen
    ptnArrChange(project.patterns);

    // 3. Sound-Button ausschalten
    soundCSSArr.forEach((button) =>{  
        button.classList.remove('activeSound');
      }); 

    // 4. Pattern auf den Steps abbilden
    initValue();
    deleteCSSArr();
    voiceArrToStepCSSArr();

    // mode Switch auf Step-Modus stellen
    el('#mode-switch').checked = false;
    // kitCount auf Null setzen
    kitCountToZero();   

    // HTML Maske weg
    const dbArea = el('#db-area');
    dbArea.innerHTML = '';
    dbArea.className = 'area-passiv';
}