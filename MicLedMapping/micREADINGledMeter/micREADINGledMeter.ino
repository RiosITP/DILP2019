#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN 6

int pix = 120;
int sense;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(pix, PIN, NEO_GRB + NEO_KHZ800);

int samples = 200;
float audioIn = 0.0;
float audioPrevious = 0.0 ;


void setup() {
  Serial.begin(9600);
  strip.begin();
  strip.setBrightness(50);
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {
  float volume = 0;
  sense = analogRead(A1);

  for (int i = 0 ; i < samples; i++) {
    int mic = analogRead(A0);
    audioIn = mic;
    volume = volume + abs(audioIn - audioPrevious);
    audioPrevious = audioIn;
  }
  volume = volume / samples;
  Serial.println(sense);

  int ledshow = map(volume, 0, sense, 0, 120);


  for (int i = 0 ; i < pix ; i++) {

    if (i < ledshow) {
      strip.setPixelColor(i, strip.Color(255, 0, 125));
    } else {
      strip.setPixelColor(i, strip.Color(0, 0, 0));
    }

  }

  strip.show();

}
