int interval = 100;
long prev;
boolean motorOn = false;

void setup() {
  pinMode(7, OUTPUT);
  prev = millis();
}

void loop() {
  int reading = analogRead(A0);

  interval = map(reading, 0,1023, 50,1000);

  if (millis() - prev > interval) {
    motorOn = !motorOn;
    prev = millis();
  }

  if (motorOn) {
    digitalWrite(7, HIGH);
  } else {
    digitalWrite(7, LOW);
  }

}
