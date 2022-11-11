import { deleteCSSArr, kitCountToZero, soundCSSArr, voiceArrToStepCSSArr } from './buttons.js';
import {db} from './db.js';
import {el, create} from './lib.js';
import { initValue, loopToggle, stopTime } from './main.js';
import { ptnArrChange } from './sounds.js';

/**
 * Generates 'Load' area HTML
 */
export async function showLoadArea(){

   // Stops sequencer when clicking 'Load' button
   if(!stopTime) {loopToggle();}

   const dbArea = el('#db-area');
   dbArea.innerHTML = '';
   dbArea.className = 'area-aktiv';
   const data = await (await fetch('./data/db-loader.html')).text();
   dbArea.innerHTML = data;
   
   // Makes 'Load' area disappear when clicking 'Cancel'
   el('#cancel').addEventListener('click',function(){
    dbArea.innerHTML = '';
    dbArea.className = 'area-passiv';
   });
   
   dbAusgabe();
}

/**
 * Checks whether project files are available before 'Load' area is generated
 */
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

/**
 * Creates overview of available project files in 'Load' area
 * @param {String} data  Project files saved in db
 */
function dbGenerator(data){
    const wrapper = create('div');
    wrapper.setAttribute('id','item-wrapper');
    data.forEach((item) => {
        const div = create('div');
        div.className = 'item';

        //###############################
        // Span element for file name
        const span = create('span');
        span.className = 'titel';
        span.innerText = `Project Name: ${item.title}`;
        div.append(span);

        //#################################
        // 'Load' button
        const loadBtn = create('button');
        loadBtn.setAttribute('data-id',item.id);
        loadBtn.className = 'loader';
        loadBtn.innerText = 'Load Project';
        loadBtn.addEventListener('click',loadItem);
        div.append(loadBtn);

        //###################################
        // 'Delete' button
        const delBtn = create('button');
        delBtn.setAttribute('data-id',item.id);
        delBtn.className = 'delete';
        delBtn.innerText = 'X';
         delBtn.addEventListener('click',deleteItem);
        div.append(delBtn) ;

        //###################################
        wrapper.append(div);

    });// END of 'forEach'

    el('#show-projects').innerHTML = '';
    el('#show-projects').append(wrapper);

}

//########################################
/**
 * Deletes project file from db 
 */
function deleteItem(){
    // 1. Warning message
    if(!confirm('Attention! You are deleting a project!')){
        return;
    };

    // 2. Delete from db
    const key = parseInt(this.getAttribute('data-id'));
    db.deleteItem(key);

    // 3. Remove DOM entry
    el('#item-wrapper').removeChild(this.parentNode);
}

/**
 * Loads project file from db
 */
async function loadItem(){
    // 1. Read project file from db
    const key = parseInt(this.getAttribute('data-id'));

    const project = await db.readItem(key);
   
    if(!project){
        // Error message
        return alert('Not a valid file');
    }

    // Pass all values to app
    // 1. Show file name
    el('#file-info').innerText = `Project: ${project.title}`;

    // 2. Load project patterns
    ptnArrChange(project.patterns);

    // 3. Turn off active sound button
    soundCSSArr.forEach((button) =>{  
        button.classList.remove('activeSound');
      }); 

    // 4. Show pattern on step buttons
    initValue();
    deleteCSSArr();
    voiceArrToStepCSSArr();

    // Set mode switch to 'Step' mode
    el('#mode-switch').checked = false;
    // Set kit count to zero
    kitCountToZero();   

    // Remove 'Load' area HTML
    const dbArea = el('#db-area');
    dbArea.innerHTML = '';
    dbArea.className = 'area-passiv';
}