import { db } from './db.js';
import {el } from './lib.js';
import { loopToggle, stopTime } from './main.js';
import { ptnArr } from './sounds.js';

/**
 * Generates save area
 */
export async function showSaveArea(){

    // Stops running sequencer loop when clicking 'Save' button
    if(!stopTime) {loopToggle();}

    const dbArea = el('#db-area');
    dbArea.innerHTML = '';
    dbArea.className = 'area-aktiv';
    
    const data = await (await fetch('data/db-saver.html')).text();
    dbArea.innerHTML = data;

    // Closes save area upon clicking 'Cancel' button
    el('#cancel').addEventListener('click',function(){
    dbArea.innerHTML = '';
    dbArea.className = 'area-passiv';
   });

   // Exectues save function upon clicking 'Save' button
   el('#saveproject').addEventListener('click',saveProject);
}

/**
 * Saves project file
 */
async function saveProject(){
    
    const title = el('#project-title').value;
    
    // Check if project name has been entered
    if(title === '') {return alert('Please enter a project name');}

    // Check if project name is already in use
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
    
     // Close save area
    el('#db-area').className = 'area-passiv';
    el('#db-area').innerHTML = '';

    el('#file-info').innerText = `Project: ${project.title}`;   
}