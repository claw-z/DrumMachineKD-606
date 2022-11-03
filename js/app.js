import { addMouseOver, clearPattern, clearVoice, copyFlag, instantPatternToggle, kitSelector, modeSwitch, removeMouseOver, toggleSound, toggleStep } from "../modules/buttons.js";
import { showLoadArea } from "../modules/db_load.js";
import { showSaveArea } from "../modules/db_save.js";
import { addInstallButton } from "../modules/install.js";
import { click, el, group } from "../modules/lib.js";
import { initValue, initTime, loopToggle, spaceBarPlay } from "../modules/main.js";
import { serviceWorkerAktiv } from "../modules/service-aktiv.js";


// Init-Werte
initValue();
initTime();


// ########## BUTTONS ###########

// META-FUNKTIONEN
// showSaveArea an Button "#save" binden
click('#save',showSaveArea);
// showLoadArea an Button "#load" binden
click('#load',showLoadArea);
// Installation
serviceWorkerAktiv();
addInstallButton();


// CONTROL-BEREICH
// Inputs werden dort ausgelesen, wo die Werte verarbeitet werden, Volume bei sound.js und BPM bei main.js

// loopToggle an Play-Button binden
click('#play-stop',loopToggle);
spaceBarPlay();


// MODE-SWITCH & INST-PATTERN-CHANGE
// Zwischen Step- und Pattern-Modus wechseln
click('#mode-switch', modeSwitch);
click('#instant-checkbox', instantPatternToggle);


// PATTERN-KIT-BEREICH
// clearPattern an Button "#ptn-clear" binden
click('#ptn-clear',clearPattern);
// copyFlag an '#copy' binden
click('#copy',copyFlag);
// kitSelector an Button "#kit-selector" binden
click('#kit-selector',kitSelector);
// clearVoice an Button "#voice-clear" binden
click('#voice-clear',clearVoice);


// SOUND-BUTTONS
// toggleSound an Sound-Buttons binden
group('#sounds button').forEach((button)=>{
  button.addEventListener('click',toggleSound)
});


// STEP-BUTTONS
// toggleStep an Step-Buttons binden
group('#sequencer button').forEach((button)=>{
  button.addEventListener('click',toggleStep)
});

// Mousedown-Gesten für Step-Buttons innerhalb des Hauptbereichs (#main) ermöglichen
el('#main').addEventListener('mousedown', (e) => {
  addMouseOver();
  e.preventDefault();}
);
el('#main').addEventListener('mouseup', removeMouseOver);