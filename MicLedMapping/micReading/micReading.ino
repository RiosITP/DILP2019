int samples = 200;
float audioIn = 0.0;
float audioPrevious = 0.0 ;

void setup() {
  Serial.begin(9600);
}

void loop() {

  float vol = 0;

  for (int i = 0 ; i < samples; i++) {
    int mic = analogRead(A0);
    audioIn = mic;
    vol = vol + abs(audioIn - audioPrevious);
    audioPrevious = audioIn;
  }

  vol = vol / samples;

  Serial.println(vol);
}
