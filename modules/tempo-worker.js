/**
 * Service worker for loop timing
 */

let bpm;

onmessage = (e) => {
  const message = e.data;
  bpm = parseFloat(message);

  return new MyWorker().start();
};

class MyWorker {
  constructor() {
    // Keeps the loop running
    this.run = true;
    // Beats per minute
    this.bpm = bpm * 4;
    // Time last beat was called
    this.lastLoopTime = this.milliseconds;
  }

  get milliseconds() {
    return new Date().getTime();
  }

  start() {
    while (this.run) {
      // Get the current time
      let now = this.milliseconds;
      // Get the elapsed time between now and the last beat
      let updateLength = now - this.lastLoopTime;
      // If not enough time has passed restart from the beginning of the loop
      if (updateLength < (1000 * 60) / this.bpm) continue;
      // Enough time has passed update the last time
      this.lastLoopTime = now;
      // Send a message back to the main thread
      postMessage("beat");
    }
  }
}
