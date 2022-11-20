import { el } from '../modules/lib.js';
import { patternChange, kitCountToZero, soundCSSArr, stepCSSArr, previewSound } from './buttons.js';
import { activePtnChange, changeVoiceArr, drumHit, hiHatHit, ptnArr } from './sounds.js';


// ########### VARIABLES ###############
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
// ########### INIT STATE ###########

/**
 * Assigns init values to all parameters upon pageload
*/
export function initValue (){

  // Set first sound to be the active sound
  soundCSSArr[0].classList.add('activeSound');

  // Select kit and show its name in display
  kitCountToZero();
  el('#kit-display').innerText = 'TR-606';

  // Define active pattern number
  activePtnChange(0);
  changeVoiceArr(ptnArr[0]);
  stepCSSArr[0].setAttribute('pattern-active', 'true');

  // Set init volume
  el('#volume').setAttribute('value', 0.3);

  // Set init BPM
  bpm = 130;
  el('#bpm').setAttribute('value', bpm);
}


/**
 * Assigns init values for the sequencer's time loop
 */
export function initTime (){

    stopTime = true;
    previewSound();

    // Removes loopLight-class from currently lit button
    stepCSSArr.forEach((button) => {
      button.classList.remove('loopLight');
    })
}



// ###############################################
// ################# BAR LOOP ###################
// ###############################################


// ############## SET BPM ################

// Reads bpm from input value
bpmInput = el('#bpm');
bpmInput.onchange = function() {  
  bpm = bpmInput.value;
}


// ##################### ONE-BAR LOOP #######################

/** 
 * Generates one-bar loop via external service worker --> loopToggle 
 */
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

    // function executed upon message to service worker
    myWorker.onmessage = function(e) {

      let msg = e.data

      switch (msg) {
        
        case 'beat': beatCount ++;
        // Restart beatCount upon reaching a value of 16
        if (beatCount === 16) {

          beatCount = 0;          
          // Pattern change only occurs on beatCount = 0, if "INST PTN" is off
          if(!el('#instant-checkbox').checked) {
              patternChange();
          }
        }

        // trigger loop light and drum sounds
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


/**
 * Starts and stops sequencer loop 
 * @exports  app.js --> spaceBarPlay()
 */
export function loopToggle() {

  if (stopTime === true) {      
      loopCycle();
      previewSound();
      
  } else {
      loopCycle();
      initTime();
      previewSound();
  }
}

/**
 * Links above loopToggle function to space bar
 */
export function spaceBarPlay() {

    document.body.onkeyup = function(e) {
      if (e.key == " " || e.code == "Space"){

            loopToggle();
            // Prevents space bar from triggering focused elements
            e.preventDefault();
      }
    }
}


// ##########################################
// ############ SEQUENCER LIGHT #############

/**
 * Lights up a sequencer button --> loopLight
 * @param {object} button            One of 16 sequencer buttons
 * @returns {function} classList.add   Adds class 'loopLight' to button
 */
function loopLightOn (button) {
  // check type of button-object
  
  return button.classList.add('loopLight');
}
/**
 * Lets sequencer button light go out --> loopLight
 * @param {object} button              One of 16 sequencer buttons
 * @returns {function} classList.remove  Removes class 'loopLight' from button
 */
function loopLightOff (button) {
  return button.classList.remove('loopLight');
}

/**
 * Lets sequencer buttons light up and go out according to position in active loop --> loopCycle
 */
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