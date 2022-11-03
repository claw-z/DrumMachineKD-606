import { el } from '../modules/lib.js';
import { patternChange, kitCountToZero, soundCSSArr, stepCSSArr, previewSound } from './buttons.js';
import { activePtnChange, changeVoiceArr, drumHit, hiHatHit, ptnArr } from './sounds.js';


// ########### VARIABLEN ###############
export let  beatCount,
            bpm,
            bpmInput, 
            counter,
            inputVolume,
            loop, 
            myWorker,
            stopTime,
            testWorker;


// ####################################
// ########### INIT-ZUSTAND ###########


// init Values bei pageload vergeben
export function initValue (){

  // Vorauswahl Sound Button 1 bei Laden der Seite
  soundCSSArr[0].classList.add('activeSound');

  // Auswahl des init-Sound-Kits
  kitCountToZero();
  el('#kit-display').innerText = 'TR-606';

  // Das Pattern mit Index [0] wird zum aktiven Pattern erklärt 
  activePtnChange(0);
  // Vorauswahl aktives Pattern
  changeVoiceArr(ptnArr[0]);
  stepCSSArr[0].setAttribute('pattern-active', 'true');

  // Volume bekommt einen init-Wert
  el('#volume').setAttribute('value', 0.3);

  // bpm bekommt einen init-Wert
  bpm = 130;
  el('#bpm').setAttribute('value', bpm);
}

// loopCycle bei pageload und Stop auf Null setzen
export function initTime (){

    stopTime = true;
    previewSound();

    // Lauflicht ausschalten
    stepCSSArr.forEach((button) => {
      button.classList.remove('loopLight');
    })
}



// ###############################################
// ################# TAKT-LOOP ###################
// ###############################################


// ####### BPM UND TAKTLÄNGE BESTIMMEN ##########

// bpm wird aus dem Input-Feld ausgelesen
bpmInput = el('#bpm');

bpmInput.onchange = function() {  
  bpm = bpmInput.value;
};


// ############ LOOP-FUNKTION #######################

// Generieren des Takt-Loops mit externem Worker--> loopToggle
export function loopCycle() {

  if (stopTime == true) {
    
    stopTime = false;    
    beatCount = 0;
    loopLight();
    drumHit();
    hiHatHit();

    myWorker = new Worker('./modules/tempo-worker.js', { type: "module" });    

    bpm = bpmInput.value
    myWorker.postMessage([bpm]);

    myWorker.onmessage = function(e) {

      let msg = e.data

      switch (msg) {
        
        case 'beat': beatCount ++;
        // Wenn beatCount 16 erreicht, beginne wieder bei 1
        if (beatCount === 16) {

          beatCount = 0;          
          // Pattern wird erst bei beatCount = 0 geändert, wenn "INST PTN" aus ist
          if(!el('#instant-checkbox').checked) {
              patternChange();
          }
        }

        // Lauflicht und Drumsounds auslösen
        loopLight();
        drumHit();
        hiHatHit();

        break;
      }      
    }
  }
  else{

    stopTime = true; 
    myWorker.terminate();    
  }
}


// Starten und Stoppen des Loops --> spaceBarPlay(), app.js
export function loopToggle() {

  if (stopTime === true) {      
      loopCycle();
      previewSound();
      
  }else{
      loopCycle();
      initTime();
      previewSound();
  }
}

// loopToggle an Space-Taste binden
export function spaceBarPlay() {

  // if (el('#db-area').className == 'area-passiv'){
    document.body.onkeyup = function(e) {
      if (e.key == " " || e.code == "Space"){

            loopToggle();
            // verhindern, dass die Space-Taste bei Fokus auf einen Button diesen auslöst
            e.preventDefault();
      }
    }
  // }
}



// #####################################
// ############ LAUFLICHT ##############

// Lauflicht leuchtet auf --> loopLight
function loopLightOn (button) {
  return button.classList.add('loopLight');
}
// Lauflicht erlischt --> loopLight
function loopLightOff (button) {
  return button.classList.remove('loopLight');
}

// Step-Buttons leuchten entprechend der Counter-Position im Loop auf --> loopCycle
function loopLight () {

  for (let i = 0; i < stepCSSArr.length; i ++) {
    if (beatCount == i) {
      loopLightOn(stepCSSArr[i]);
      if (i > 0) {
        loopLightOff(stepCSSArr[i-1]);
      } 
      else {
        loopLightOff(stepCSSArr[15])
      }
    } 
  }
}