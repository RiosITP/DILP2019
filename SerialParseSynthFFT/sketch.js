let data;
let r = 0;
let g = 0;
let b = 0;
let onOff = 0;
let note1 = "A3";
let note2 = "F4";
let playing1 = false;
let playing2 = false;
let fft;
let mic;
let synth;
let zoom = 1; // since synth and vocal frequencies are all within a small range, lets make a variable to control zooming in on our spectrum 

function setup() {
  createCanvas(windowWidth, windowHeight);
  serial = new p5.SerialPort();
  synth = new p5.PolySynth();
  // Let's list the ports available
  var portlist = serial.list();
  
  mic = new p5.AudioIn(); // use the microphone to pick up audio from the real world
  mic.start();            // enable microphone
  fft = new p5.FFT();     // set your new fft object
  fft.setInput(synth);    // use set input so the fft knows what source to analyze
//  fft.setInput(mic);    // you can set the input for the fft to the synth or the mic, or both!

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("/dev/cu.usbmodem1421");
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
}

function gotData() {
  var currentString = serial.readStringUntil("\r\n");
	
  if (currentString) { // make sure information is actually transmitting from arduino to p5
    var incoming = trim(currentString); // use trim() to remove extra characters
    data = split(incoming, ",");  // use split() to separate the info by commas "," and save it in the data array
    data = int(data); // since data comes in as a STRING use int() to convert the data to integers
    console.log(data);  //log the data to make sure its been formatted and stored correctly
   // map the analog values to a 0-255 range. use them in variables to change the background color
    r = map(data[2], 0, 1023, 0, 255); 
    g = map(data[3], 0, 1023, 0, 255);
    b = map(data[4], 0, 1023, 0, 255);

    if (data[0] == 1) {
      if (!playing1) {
        synth.noteAttack(note1, 0.1, 0.1);
        playing1 = true;
      }
    } else {
      synth.noteRelease(note1);
      playing1 = false;
    }
    
   if (data[1] == 1) {
      if (!playing2) {
        synth.noteAttack(note2, 0.1,0.1);
        playing2 = true;
      }
    } else {
      synth.noteRelease(note2);
      playing2 = false;
    }

  }
}

function draw() {
  background(r, g, b);
  //sendLED();
  let spectrum = fft.analyze(); // analyze the fft each draw loop and save it in an array called spectrum
  
  zoom = map(mouseX,0,width,1,100); // map our mouseX to control how much we want to zoom on our spectrum
	
  stroke(255);
  noFill();
//draw the active spectrum as a polyline
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {   // loop through the spectrum (1024 values by default)
//for each frequency band, map an x value, map a y value, and draw a vertex at that point.
    let x = map(i, 0, spectrum.length, 0, width * zoom); // map the x value of the line.  Multiply by zoom to zoom in on the line
    let y = map(spectrum[i],0,255, height/2, 0); // map the value of the amplitude at a given frequency, to height of the line.
	  //the output of the y mapping is from half the height to 0 so that it draws from the center of the screen with louder frequencies toward the top
    vertex(x, y); // plot that vertex
  }
  endShape(); 
}
