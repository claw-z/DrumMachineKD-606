import { kitCount } from './buttons.js';
import { el, loadJSON } from './lib.js';
import { beatCount } from './main.js';


// ######################################
// ############### SOUNDS ###############
// ######################################


// ####### LADEN DER DRUMKITS AUS JSON-DATEIEN ########

// Dateipfade der Drumkits in ein Array speichern
const paths = [
  'data/tr606.json',
  'data/tr707.json',
  'data/tr808.json',
  'data/cr78.json',
  'data/linndrum.json'
];

// Array mit unaufgelösten Versprechen
const proms = [];
paths.forEach((path) => {
    proms.push(loadJSON(path));
});

// Alle Drumkits in eigene Arrays laden
const [tr606,tr707,tr808,cr78,linndrum] = await Promise.all(proms);
// Daten geladen!



// ############## SOUNDS ABSPIELEN ####################



export const soundObj = {    
  
    // Wiedergabe von Sounds --> drumHit
    playSound: function(i){
      
      let drumSound = new Audio();
  
      drumSound.volume = inputVolume;
      
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

    // Hihat-Audio wird außerhalb der Funktion definiert, damit eine gerade erklingende Hihat bei Auslösen einer neuen Hihat abgeschnitten wird
    hiHat: new Audio(),


    playHiHat: function(i){
      let hiHat = this.hiHat;
      hiHat.volume = inputVolume;
      
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
      console.log(hiHat.getAttribute('src'));
    },
}
  


// ############## LAUTSTÄRKE DEFINIEREN #####################
// Volume-Slider selektieren
let volumeSlider = el('#volume');

// Volume-Slider-Wert auslesen
let inputVolume = volumeSlider.value;

// Lautstärke ändern bei Betätigen des Volume Slider
volumeSlider.onchange = function() {
inputVolume = volumeSlider.value;
};




// ########## SPEICHER FÜR STEPS UND PATTERNS DEFINIEREN ##########


// Grundform Step-Speicher: je 16 Steps für jede der 8 Stimmen
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

// Pattern-Speicher
// Leeres Pattern-Array
export let ptnArr = [];

// 16 voiceArr-Kopien in das ptnArr speichern
for (let i = 0; i < 16; i++) {
    // pusht 16x eine real copy in pattArr // voiceArr ist nicht im pattArr!
    let arrayCopy = JSON.parse(JSON.stringify(voiceArr)); 
    ptnArr.push(arrayCopy);
}

// Variable für das momentan aktive Pattern
export let activePtn;



// ######### PATTERNS WECHSELN #########

// Bei Laden einer neuen Projektdatei wird das ganze Pattern-Array ausgetauscht --> db_joad.js / loadItem()
export function ptnArrChange (i) {
    ptnArr = i;
  }

// Beim Wechsel des Patterns ein anderes voiceArr auswählen --> buttons.js/ patternChange()
export function changeVoiceArr (i) {
    voiceArr = i;
}

// Aktives Pattern umdefinieren
export function activePtnChange (i) {
  activePtn = i;
}


// ######### SOUNDS AUSLÖSEN #########

// Auslösen der DrumHits für alle gesetzten Steps --> loopCycle
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

// Sonderfunktion für Hihats, die sich gegenseitig auslöschen sollen
export function hiHatHit() {

  for (let i = 0; i < voiceArr[6].length; i ++) {
    // wird die OHH gesetzt, entfernt sie den Step der CHH an der gleichen Stelle...
    if(beatCount === i && voiceArr[6][i] === 1){

      voiceArr[7][i] = 0;
      soundObj.playHiHat(6);
    }
    // ...und umgekehrt
    if(beatCount === i && voiceArr[7][i] === 1){

      voiceArr[6][i] = 0;
      soundObj.playHiHat(7);
    }
  }
}