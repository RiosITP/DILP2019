let data; // data to hold array of incoming values
let r = 0; // variable for background red color
let g = 0; // variable for background green color
let b = 0; // variable for background blue color
let note1 = "A#3"; // String representation of a note. Letters A-G are the notes, "#" represents a sharp, "b" represents a flat, number represents octive
let note2 = "Fb3";// String representation of a note. Letters A-G are the notes, "#" represents a sharp, "b" represents a flat, number represents octive
let playing1 = false; // boolean to hold whether our first note is playing or not
let playing2 = false; // boolean to hold whether our second note is playing or not
let synth;  // variable for our synth object

function setup() {
  createCanvas(windowWidth, windowHeight);
  serial = new p5.SerialPort();
  synth = new p5.PolySynth();  // instantiate synth as a polysynth
  // Let's list the ports available
  // osc = new p5.Oscillator();
  var portlist = serial.list();

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

// if the first button is pressed
    if (data[0] == 1) {
// check if the note is already playing.
// exclamation "!" means NOT, means the same as: playing1 == false 
    if (!playing1) {
	// if the note is not already playing, then play the note
        synth.noteAttack(note1, 0.1, 0.1);
	// set the playing variable to true so it doesn't trigger the note again and make an echo
        playing1 = true;
      }
    } // else (if the button is not pressed)
      else {
	// release the note, and set the playing variable back to false, so you can trigger it next time.
	// then release the specific note1. 
	// calling noteRelease() with no arguments will turn off all notes
      synth.noteRelease(note1);  // play the note softly, with slight delay
      playing1 = false;
    }
   
// same logic for a second button and second note	  
   if (data[1] == 1) {
      if (!playing2) {
        synth.noteAttack(note2, 0.1, 0.1); 
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
}
