#include <CapacitiveSensor.h>

/*
   CapitiveSense Library Demo Sketch
   Paul Badger 2008
   Uses a high value resistor e.g. 10M between send pin and receive pin
   Resistor effects sensitivity, experiment with values, 50K - 50M. Larger resistor values yield larger sensor values.
   Receive pin is the sensor pin - try different amounts of foil/metal on this pin
*/

int pitch;
int pause;
CapacitiveSensor   cs_4_2 = CapacitiveSensor(4, 2);       // 10M resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired

void setup()
{
  // turn off autocalibrate on channel 1 - just as an example
  Serial.begin(9600);
  pinMode(9, OUTPUT);
}

void loop()
{

  long total1 =  cs_4_2.capacitiveSensor(30);
  int reading = analogRead(A0);

  if (total1 > 650) {
    pitch = map(total1, 650, 15500, 60, 3000);
    tone(9, pitch);
    //  pause = map(reading,0,700,0,200);
    //    delay(pause);
    //    noTone(9);
    //    delay(pause);
  } else {
    noTone(9);
  }

  Serial.print(reading );
  Serial.print("\t");
  Serial.println(total1);


  delay(10);
}
