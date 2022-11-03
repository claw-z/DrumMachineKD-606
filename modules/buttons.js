import { el, group } from "./lib.js";
import { stopTime } from "./main.js";
import { activePtn, activePtnChange, changeVoiceArr, ptnArr, soundObj, voiceArr } from "./sounds.js";


// ########## VARIABLEN ###############
export let kitCount;


// ####### BUTTON-ARRAYS ##############

// Step-Buttons
export const stepCSSArr = group('#sequencer button');
// Jedem Step-Button ein Data-Index geben
stepCSSArr.forEach((button, index) => {
  button.setAttribute('data-step', index);
  button.setAttribute('pattern-active', 'false');
})
// Sound-Buttons
export const soundCSSArr = group('#sounds button');
// Jedem Sound-Button ein Data-Index geben
soundCSSArr.forEach((button, index) => {
  button.setAttribute('data-index', index);
})


// #####################################
// ########## SOUND-BUTTONS ############
// #####################################

// Mithilfe der Sound-Buttons zwischen den einzelnen Stimmen hin- und herwechseln und die jeweilig gesetzten Steps auf den Step-Buttons abbilden
export function toggleSound() {
  
  soundCSSArr.forEach((button) =>{  
    button.classList.remove('activeSound');
  }); 
  this.classList.add('activeSound');

  deleteCSSArr();
  voiceArrToStepCSSArr();  
}

// Lichter der Sound-Buttons bei Mode-Wechsel regulieren --> modeSwitch() 
function soundBtnLight() {

  // Alle Sound-Button-Lichter löschen und das aktive anmachen
  soundCSSArr.forEach((button) =>{  
    button.classList.remove('activeSound');
  }); 
  this.classList.add('activeSound');
}

// Bei Wechsel des Sound-Buttons zunächst alle Step-Lichter des vorher ausgewählten Sounds löschen --> toggleSound
export function deleteCSSArr() {

  stepCSSArr.forEach((button) => {
    button.classList.remove('step-active');
  })
}
  
// Gespeichertes voiceArr[j] je nach ausgewählter Stimme j auf den Step Buttons abbilden!! --> toggleSound
export function voiceArrToStepCSSArr() {
  
  for(let j = 0; j < voiceArr.length; j++){

    if(soundCSSArr[j].classList.contains('activeSound')){

      for(let i = 0; i < voiceArr[j].length; i++) {
        if(voiceArr[j][i] === 1) {
          stepCSSArr[i].classList.add('step-active');
        } 
      }
    }  
  }
}


// Sound auslösen --> previewSound()
function triggerSound () {
  let dataIndex = this.getAttribute('data-index');
  soundObj.playSound(dataIndex);
}


// Sounds beim Betätigen der Sound-Buttons erklingen lassen --> loopToggle()
export function previewSound() {

  if(el('#mode-switch').checked){
    soundCSSArr.forEach((button) => {
      button.addEventListener('click', triggerSound);
    })
  }
  else{

  soundCSSArr.forEach((button) => {

    if(stopTime) {
      button.addEventListener('click', triggerSound);
    }else{
      button.removeEventListener('click', triggerSound);
      }
    });
  }
}


// #########################################
// ############ STEP-BUTTONS ###############
// ####### für Steps und Patterns ##########
// #########################################

// Wenn ein Step-Button auf 'step-active' gesetzt wird, während ein Sound-Button aktiviert ist, wird der aktive Step in die entsprechende Position der entsprechenden Stimme im voiceArr gespeichert --> toggleStep

function saveToVoiceArr() {
    for (let j = 0; j < voiceArr.length; j ++) { 

      if(soundCSSArr[j].classList.contains('activeSound')) {
  
          for (let i = 0; i < stepCSSArr.length; i++){
            if (stepCSSArr[i].classList.contains('step-active')) {voiceArr[j][i] = 1;}
            else if (!stepCSSArr[i].classList.contains('step-active')) {voiceArr[j][i] = 0;}
          }return;
        }  
    }
}
  
// Lässt die Step-Buttons beim Klicken aufleuchten und ausgehen 
// --> app.js, addMouseOver(), removeMouseOver()
// Führt die Funktion saveToVoiceArr aus
export function toggleStep () {
  
    if(!this.classList.contains('step-active')){
      this.classList.add('step-active');
      saveToVoiceArr();
      return;}
    if(this.classList.contains('step-active')){
      this.classList.remove('step-active');
      saveToVoiceArr();
    }
}

// Weist die Mouseover-Mechanik den Step-Buttons zu
export function addMouseOver(){

  group('#sequencer button').forEach((button)=>{
    button.addEventListener('mouseover',toggleStep);
  })
}

// Entfernt die Mouseover-Mechanik wieder
export function removeMouseOver(){

  group('#sequencer button').forEach((button)=>{
    button.removeEventListener('mouseover',toggleStep);
  })
}


// #### STEP-BUTTONS IM PATTERN-MODE #####
// Pattern-Wechsel per Step-Buttons
export function togglePattern() {

  // alle aktive Lichter löschen (aus Step Mode) & alle Patterns auf false setzen
  stepCSSArr.forEach((button) => {
    button.classList.remove('step-active');    
  });

  // für geklickten Button pattern-active auf true setzen & leuchten lassen
  this.classList.add('step-active');
  this.setAttribute('pattern-active', 'true');

  // aktives Pattern dem voiceArr zuordnen UMBENENNEN
  activePtnChange(this.getAttribute('data-step'));
  
  // das aktive Pattern sofort ändern, wenn der INST-Button aktiv ist oder wenn Loop nicht läuft
  if(el('#instant-checkbox').checked || stopTime) {
    patternChange();
  }
  return;
}

// Ändert das aktuell aktive Pattern
export function patternChange() {

  changeVoiceArr(ptnArr[activePtn]);

  if (!el('#mode-switch').checked){
  
    deleteCSSArr();
    voiceArrToStepCSSArr();
  }
}

// Den Instant-Pattern-Button ein-/ausschalten
export function instantPatternToggle() {

  // Wenn checkbox gesetzt ist
  if(el('#instant-checkbox').checked) {
    // Licht geht an
    el('#instant-switch').className = 'instant-active';
    return;
  }  
  // Licht geht aus
  el('#instant-switch').className = 'instant-passive';
}



// #################################################
// ########### FUNKTIONS-BUTTONS ###################
// #################################################

// Zwischen Step-Mode und Pattern-Mode wechseln
export function modeSwitch() {

  // previewSound kontrolliert den Switch-Status
  previewSound();

  // wenn Switch auf pattern steht
  if (el('#mode-switch').checked) {

    // Steps der einzelnen Sounds sollen nicht mehr auf den Step-Buttons angezeigt werden
    soundCSSArr.forEach((button)=>{button.removeEventListener('click',toggleSound)
    // die Lichter der Sound-Buttons sollen aber trotzdem funtkionieren
    button.addEventListener('click',soundBtnLight);});

    // für alle Step-Buttons toggleStep-Funktion entfernen & togglePattern-Funktion hinzufügen
    stepCSSArr.forEach((button)=>{
    button.removeEventListener('click',toggleStep);
    button.addEventListener('click',togglePattern);
    });

    // aktive Step-Lichter ausschalten --> deleteCSSArr benutzen?
    stepCSSArr.forEach((button) => {
      button.classList.remove('step-active');
    });

    //aktiviertes Pattern soll aufleuchten (activePtn-Variable liest Button-Attribut "pattern-active" aus)
    stepCSSArr[activePtn].classList.add('step-active'); 
  }

  else {
    // Step-Modus wieder aktiv, 
    
    deleteCSSArr();
    voiceArrToStepCSSArr();

    // Steps des angewählten Sounds anzeigen
    soundCSSArr.forEach((button)=>{button.addEventListener('click',toggleSound)});

    // togglePattern aus- und toggleStep anschalten
    stepCSSArr.forEach((button)=>{
      button.removeEventListener('click',togglePattern);
      button.addEventListener('click',toggleStep);
    });
  }    
}

// Das aktuelle Pattern löschen
export function clearPattern() {

  deleteCSSArr();

  ptnArr[activePtn] = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    
  patternChange();
}


// Alle Steps für den ausgewählten Drumsound löschen
export function clearVoice() {

  // Alle gesetzten Steps der ausgewählten Stimme (activeSound) löschen
  for (let j = 0; j < voiceArr.length; j ++) { 

    if(soundCSSArr[j].classList.contains('activeSound')) {

      for (let i = 0; i < stepCSSArr.length; i++){
        voiceArr[j][i] = 0;
      }
    }  
  }
  // Step-Lichter löschen, wenn im Step-Mode, aber nicht, wenn im Pattern-Mode
  if (!el('#mode-switch').checked){
    deleteCSSArr();
  }
}


// ############# COPY-PATTERN-FUNKTION #############

// Boolean für den Copy-Ptn-Mode
let flag = false;
// leere Variable für zu kopierendes Pattern
let patternToCopy;

// Pattern-Copy-Modus an- & ausschalten
export function copyFlag() {

  if(!el('#mode-switch').checked) {return;}

  if(flag === true){
    flag = false;
    el('#copy').className = '';

    stepCSSArr.forEach((button) => {
      button.removeEventListener('click', copyPattern);})

    return;
  } 
    
    flag = true;
    el('#copy').className = 'active';

    copyInit();
}

//zu kopierendes Pattern definieren & copyPattern Fkt den Buttons zuordnen
export function copyInit() {

  // Das aktive Pattern wird in "patternToCopy" kopiert
  patternToCopy = JSON.parse(JSON.stringify(ptnArr[activePtn]));

  stepCSSArr.forEach((button) => {
    button.addEventListener('click', copyPattern);
  })
}

// zu kopierendes Pattern in den ausgewählten Pattern-Slot schreiben
function copyPattern() {
  
    ptnArr[this.getAttribute('data-step')] = patternToCopy;
  
    copyFlag();

    patternChange();
}


// ############### Wechsel der Drumkits ######################

export function kitCountToZero() {
  kitCount = 0;
}

export function kitSelector() {

  kitCount ++;

  if (kitCount===5) {kitCount=0;}
    
  if (kitCount===0) {
    el('#kit-display').innerText = 'TR-606';
  }
  if (kitCount===1) {
    el('#kit-display').innerText = 'TR-707';
  }
  if (kitCount===2) {
    el('#kit-display').innerText = 'TR-808';
  }
  if (kitCount === 3) {
    el('#kit-display').innerText = 'CR-78';
  }
  else if (kitCount===4) {
    el('#kit-display').innerText = 'Linndrum';
  }
}