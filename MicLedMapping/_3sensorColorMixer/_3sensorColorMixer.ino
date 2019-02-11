#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN 6

int pix = 120;
int sense;
int r = 0;
int g = 0;
int b = 0;

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
  for (int i = 0 ; i < samples; i++) {
    int mic = analogRead(A0);
    audioIn = mic;
    volume = volume + abs(audioIn - audioPrevious);
    audioPrevious = audioIn;
  }
  volume = volume / samples;

  int pot = analogRead(A1);
  int light = analogRead(A2);

  r = map(volume, 0, 100, 0, 255);
  g = map(pot, 0, 1023, 0, 255);
  b = map(light, 225, 875, 0, 255);

  Serial.println(light);
// LED MAPPING

  for (int i = 0 ; i < pix ; i++) {
      strip.setPixelColor(i, strip.Color(r,g,b));
      strip.show();

  }

  
}
