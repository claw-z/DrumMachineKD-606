import { addMouseOver, clearPattern, clearVoice, copyFlag, instantPatternToggle, kitSelector, modeSwitch, removeMouseOver, toggleSound, toggleStep } from "../modules/buttons.js";
import { showLoadArea } from "../modules/db_load.js";
import { showSaveArea } from "../modules/db_save.js";
import { addInstallButton } from "../modules/install.js";
import { click, el, group } from "../modules/lib.js";
import { initValue, initTime, loopToggle, spaceBarPlay } from "../modules/main.js";
import { serviceWorkerAktiv } from "../modules/service-aktiv.js";


// Init values
initValue();
initTime();


// META BUTTONS
// Assigns showSaveArea to button '#save'
click('#save',showSaveArea);
// Assigns showLoadArea to button '#load'
click('#load',showLoadArea);
// Adds install functionality
// serviceWorkerAktiv();
// addInstallButton();


// CONTROL AREA
// Note: volume is read by sound.js, BPM is read by main.js
// Assign loopToggle to 'Play' button and space bar
click('#play-stop',loopToggle);
spaceBarPlay();


// MODE SWITCH & INST PTN
// Toggle between step and pattern modes
click('#mode-switch', modeSwitch);
click('#instant-checkbox', instantPatternToggle);


// PATTERN-KIT AREA
// Assign clearPattern to button '#ptn-clear'
click('#ptn-clear',clearPattern);
// Assign copyFlag to button '#copy'
click('#copy',copyFlag);
// Assign kitSelector to button '#kit-selector'
click('#kit-selector',kitSelector);
// Assign clearVoice to button '#voice-clear'
click('#voice-clear',clearVoice);


// SOUND BUTTONS
// Assign toggleSound to sound buttons
group('#sounds button').forEach((button)=>{
  button.addEventListener('click',toggleSound)
});


// STEP BUTTONS
// Assign toggleStep to step buttons
group('#sequencer button').forEach((button)=>{
  button.addEventListener('click',toggleStep)
});
// Mousedown functionality for step buttons inside of '#sequencer' div
el('#sequencer').addEventListener('mousedown', (e) => {
  addMouseOver();
  e.preventDefault();}
);
el('#sequencer').addEventListener('mouseup', removeMouseOver);