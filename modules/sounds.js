import { kitCount } from './buttons.js';
import { el, loadJSON } from './lib.js';
import { beatCount } from './main.js';


// ######################################
// ############### SOUNDS ###############
// ######################################


// ####### LOADING DRUM KITS FROM JSON-FILES ########

// Saves file location to array
const paths = [
  'data/tr606.json',
  'data/tr707.json',
  'data/tr808.json',
  'data/cr78.json',
  'data/linndrum.json'
];

// Array with unresolved promises
const proms = [];
paths.forEach((path) => {
    proms.push(loadJSON(path));
});

// Loads all drum kits into individual arrays
const [tr606,tr707,tr808,cr78,linndrum] = await Promise.all(proms);
// Files now loaded!



// ############## PLAY SOUNDS ####################


export const soundObj = {    
  
    // Plays back a sound --> drumHit
    playSound: function(i){
      
      let drumSound = new Audio();
  
      drumSound.volume = outputVolume;
      
      if (kitCount === 0) {
        drumSound.src = tr606[i];
      }
      if (kitCount === 1) {
        drumSound.src = tr707[i];
      }
      if (kitCount === 2) {
        drumSound.src = tr808[i];
      }
      if (kitCount === 3) {
        drumSound.src = cr78[i];
      }
      if (kitCount === 4) {
        drumSound.src = linndrum[i];
      }
  
      drumSound.play();
      console.log(drumSound.getAttribute('src'));
    },
 

    hiHat: new Audio(),
    /**
     * Audio for hihats defined separately: any hihat playing back shall be choked by overlapping subsequential hihat triggers
     * @param {Int} i   Integer for drum kit array index 
     */
    playHiHat: function(i){
      let hiHat = this.hiHat;
      hiHat.volume = masterVolume;
      
      if (kitCount === 0) {
        hiHat.src = tr606[i];
      }
      if (kitCount === 1) {
        hiHat.src = tr707[i];
      }
      if (kitCount === 2) {
        hiHat.src = tr808[i];
      }
      if (kitCount === 3) {
        hiHat.src = cr78[i];
      }
      if (kitCount === 4) {
        hiHat.src = linndrum[i];
      }
  
      hiHat.play();
      // console.log(hiHat.getAttribute('src'));
    },
}
  


// ############## SET MASTER VOLUME #####################
// Select volume slider
let volumeSlider = el('#volume');

// Read value of volume slider
let masterVolume = volumeSlider.value;

// Change volume upon volume slider value change
volumeSlider.onchange = function() {
  masterVolume = volumeSlider.value;
  outputVolume = masterVolume * voiceVolume;
  console.log('masterVolume:', masterVolume)
};

// ############## SET VOICE VOLUME #####################

// Select slider for bass drum
let bdVolume = el('#vol-bd');

// Read value of BD volume
let voiceVolume = bdVolume.value;

bdVolume.onchange = function() {
  voiceVolume = bdVolume.value
  outputVolume = masterVolume * voiceVolume;
  console.log('voiceVolume:', voiceVolume)
  console.log('masterVolume:', masterVolume)
}

// ############## CALCULATE OUTPUT VOLUME #####################

let outputVolume = masterVolume * voiceVolume;

// ########## STEP AND PATTERN MEMORY ##########


// Basic step memory: 16 Steps each for all 8 voices
export let voiceArr = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Empty pattern memory
export let ptnArr = [];

// Save 16 copies of voiceArr into ptnArr
for (let i = 0; i < 16; i++) {
    // pushes 16 *real copies* into ptnArr
    let arrayCopy = JSON.parse(JSON.stringify(voiceArr)); 
    ptnArr.push(arrayCopy);
}

// Variable for any currently active pattern
export let activePtn;



// ######### CHANGING PATTERNS #########

/**
 * Load ptnArray upon loading project file --> db_joad.js / loadItem()
 * @param {Int} i   Number of ptnArray to be loaded
 */
export function ptnArrChange (i) {
    ptnArr = i;
  }

/**
 * Switch voiceArr upon changing patterns --> buttons.js/ patternChange()
 * @param {Int} i   Number of active voiceArr
 */
export function changeVoiceArr (i) {
    voiceArr = i;
}

/**
 * Set active pattern
 * @param {Int} i   Number of active pattern
 */
export function activePtnChange (i) {
  activePtn = i;
}


// ######### TRIGGER DRUM SOUNDS ##########

/**
 * Trigger drum sound for all active steps --> loopCycle (main.js)
 */
export function drumHit() {

        for (let j = 0; j < voiceArr.length-2; j ++) {

        for (let i = 0; i < voiceArr[j].length; i ++) {

            if(beatCount === i && voiceArr[j][i] === 1){
              
              soundObj.playSound(j);
              console.log('drumHit');
            }
        }
    }
}


/**
 * Trigger hihats for all active steps; hihat playback is choked by overlapping hihat triggers --> loopCycle (main.js)
 */
export function hiHatHit() {

  for (let i = 0; i < voiceArr[6].length; i ++) {
    // OHH replaces CHH if entered on the same step...
    if(beatCount === i && voiceArr[6][i] === 1){

      voiceArr[7][i] = 0;
      soundObj.playHiHat(6);
    }
    // ...and vice versa
    if(beatCount === i && voiceArr[7][i] === 1){

      voiceArr[6][i] = 0;
      soundObj.playHiHat(7);
    }
  }
}