import { el, group } from "./lib.js";
import { stopTime } from "./main.js";
import { activePtn, activePtnChange, changeVoiceArr, ptnArr, soundObj, voiceArr } from "./sounds.js";


// ########## VARIABLES ###############
export let kitCount;


// ####### BUTTON AND FADER ARRAYS ##############

// Step buttons
export const stepCSSArr = group('#sequencer button');
// Assign index to each step button
stepCSSArr.forEach((button, index) => {
  button.setAttribute('data-step', index);
  button.setAttribute('pattern-active', 'false');
})
// Sound buttons
export const soundCSSArr = group('#sounds button');
// Assign index to each sound button
soundCSSArr.forEach((button, index) => {
  button.setAttribute('data-index', index);
})


// #####################################
// ########## SOUND BUTTONS ############
// #####################################

/**
 * Switches between voices via the sound buttons; steps programmed for each sound are displayed by the step buttons after the respective sound is selected
 */
export function toggleSound() {
  
  soundCSSArr.forEach((button) =>{  
    button.classList.remove('activeSound');
  }); 
  this.classList.add('activeSound');

  deleteCSSArr();
  voiceArrToStepCSSArr();  
}

/**
 * Turns off all sound button lights, then switches on the active sound's button light --> modeSwitch()
 */ 
function soundBtnLight() {

  soundCSSArr.forEach((button) =>{  
    button.classList.remove('activeSound');
  }); 
  this.classList.add('activeSound');
}

/**
 * Turns off all step lights --> toggleSound
 */
export function deleteCSSArr() {

  stepCSSArr.forEach((button) => {
    button.classList.remove('step-active');
  })
}
  
/**
 * Displays all programmed steps (voiceArr) per voice (j) via step button lights (soundCSSArr) --> toggleSound
 */
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

/**
 * Plays sound --> previewSound()
 */
function triggerSound () {
  let dataIndex = this.getAttribute('data-index');
  soundObj.playSound(dataIndex);
}

/**
 * Plays sounds when pressing sound buttons --> loopToggle()
 */
export function previewSound() {

  // When in pattern mode, play sound
  if(el('#mode-switch').checked){
    soundCSSArr.forEach((button) => {
      button.addEventListener('click', triggerSound);
    })
  }
  else{
  // When in step mode, only play sound if sequencer not running
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
// ############ STEP BUTTONS ###############
// ####### for steps and patterns ##########
// #########################################

/**
 * Saves activated steps into voiceArr of currently active voice --> toggleStep
 */
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

/**
 * Toggles step lights to on and off --> addMouseOver(), removeMouseOver() (app.js) 
 */
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

/**
 * Adds mouseover feature to step-buttons
 */
export function addMouseOver(){

  group('#sequencer button').forEach((button)=>{
    button.addEventListener('mouseover',toggleStep);
  })
}

/**
 * Removes mouseover feature from step buttons
 */
export function removeMouseOver(){

  group('#sequencer button').forEach((button)=>{
    button.removeEventListener('mouseover',toggleStep);
  })
}


// #### STEP BUTTONS FOR PATTERN MODE #####

/**
 * Changes patterns via step buttons
 */
export function togglePattern() {

  // Turns off all active step lights and thus sets all patterns to 'false'
  stepCSSArr.forEach((button) => {
    button.classList.remove('step-active');    
  });

  // Adds 'step-active' and 'pattern-active' to button
  this.classList.add('step-active');
  this.setAttribute('pattern-active', 'true');

  // Assigns index of active step to be index of active pattern
  activePtnChange(this.getAttribute('data-step'));
  
  // Toggles pattern instantaneously if INST button active or sequencer not running
  if(el('#instant-checkbox').checked || stopTime) {
    patternChange();
  }
  return;
}

/**
 * Changes currently active pattern
 */
export function patternChange() {

  changeVoiceArr(ptnArr[activePtn]);

  if (!el('#mode-switch').checked){
  
    deleteCSSArr();
    voiceArrToStepCSSArr();
  }
}

/**
 * Toggles INST (instant pattern change) button
 */
export function instantPatternToggle() {

  // If checked
  if(el('#instant-checkbox').checked) {
    // Light turns on
    el('#instant-switch').className = 'instant-active';
    return;
  }  
  // Light turns off
  el('#instant-switch').className = 'instant-passive';
}



// #################################################
// ############### FUNCTION BUTTONS ################
// #################################################

/**
 * Switches between step mode and pattern mode
 */
export function modeSwitch() {

  // Checks the switch status
  previewSound();

  // If in pattern mode
  if (el('#mode-switch').checked) {

    // Programmed steps shall not be displayed via step button lights
    soundCSSArr.forEach((button)=>{button.removeEventListener('click',toggleSound)
    // Sound button lights, however, shall function as usual
    button.addEventListener('click',soundBtnLight);});

    // Removes toggleStep, adds togglePattern for all step buttons
    stepCSSArr.forEach((button)=>{
    button.removeEventListener('click',toggleStep);
    button.addEventListener('click',togglePattern);
    });

    // Turns off active step lights --> use deleteCSSArr?
    stepCSSArr.forEach((button) => {
      button.classList.remove('step-active');
    });

    // Turns on step button light of active pattern ('step-active' converts to 'pattern-active' via variable activePtn
    stepCSSArr[activePtn].classList.add('step-active'); 
  }

  else {
    // If in step mode 
    
    deleteCSSArr();
    voiceArrToStepCSSArr();

    // Displays active steps for active sound
    soundCSSArr.forEach((button)=>{button.addEventListener('click',toggleSound)});

    // Remove togglePattern and add toggleStep to step buttons
    stepCSSArr.forEach((button)=>{
      button.removeEventListener('click',togglePattern);
      button.addEventListener('click',toggleStep);
    });
  }    
}

/**
 * Clears active pattern
 */
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

/**
 * Clears all steps for currently active voice
 */
export function clearVoice() {

  for (let j = 0; j < voiceArr.length; j ++) { 

    if(soundCSSArr[j].classList.contains('activeSound')) {

      for (let i = 0; i < stepCSSArr.length; i++){
        voiceArr[j][i] = 0;
      }
    }  
  }
  // Turns off step lights only when in 'Step Mode'
  if (!el('#mode-switch').checked){
    deleteCSSArr();
  }
}


// ############# PATTERN COPY FUNCTION #############

// Boolean indicating 'Ptn Copy' mode
let flag = false;
// Empty variable for pattern to be copied
let patternToCopy;
 
/**
 * Toggles 'Ptn Copy' mode
 */
export function copyFlag() {
  // return if not in pattern mode
  if(!el('#mode-switch').checked) {return;}
  // Leaves 'Ptn Copy' mode if already in this mode
  if(flag === true){
    flag = false;
    el('#copy').className = '';

    stepCSSArr.forEach((button) => {
      button.removeEventListener('click', copyPattern);})

    return;
  } 
    // Enter 'Ptn Copy' mode
    flag = true;
    el('#copy').className = 'active';

    copyInit();
}


/**
 * Defines pattern to be copied and assigns copyPattern function to relevant buttons
 */
export function copyInit() {

  // Copies active pattern to 'patternToCopy'
  patternToCopy = JSON.parse(JSON.stringify(ptnArr[activePtn]));
  // Assigns copyPattern function to step buttons
  stepCSSArr.forEach((button) => {
    button.addEventListener('click', copyPattern);
  })
}

/**
 * Writes patternToCopy to selected pattern memory
 */
function copyPattern() {
  
    ptnArr[this.getAttribute('data-step')] = patternToCopy;
  
    copyFlag();

    patternChange();
}


// ############### Drum kit toggle display ######################

// Counter variable acting as index for drum kits
export function kitCountToZero() {
  kitCount = 0;
}

// Displays drum kit name according to kitCount
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