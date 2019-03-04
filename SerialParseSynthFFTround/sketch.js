let data;
let r = 0;
let g = 0;
let b = 0;
let onOff = 0;
let note1 = "G#3";
let note2 = "Cb3";
let playing1 = false;
let playing2 = false;
let fft;
let mic;

let synth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  serial = new p5.SerialPort();
  synth = new p5.PolySynth();
  // Let's list the ports available
  var portlist = serial.list();
  
  mic = new p5.AudioIn();
  mic.start();
  
  fft = new p5.FFT();
  fft.setInput(synth);
  fft.setInput(mic);

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
  let spectrum = fft.analyze();
  
  zoom = map(mouseX,0,width,1,100)
  stroke(255);
  noFill();
  translate(width / 2, height / 2);
 //translate(mouseX,mouseY);



  //fill(255);
  beginShape();
 angle = TWO_PI/spectrum.length;

  for (let x = 0; x < spectrum.length; x++) {
    let amp = map(spectrum[x], 0, 255, 0, height/2);
    let gval = map(x, 0, spectrum.length, 0, 255);
    let ang = map(x,0,spectrum.length,0,TWO_PI);
   // fill(255, gval, 0);
    stroke(255, gval, 0);
   let a = amp * sin(ang*11);
    let  b = amp *cos(ang*17);
   //  let a = amp * sin(ang*102);
   //let  b = amp *cos(ang*102);
   // rotate(angle);
   // rotate(angle*x);
   // point(0, amp + 50);
   vertex(a, b);

  }
   endShape(CLOSE);
}