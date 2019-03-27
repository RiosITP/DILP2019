int led = 9;
int sw1 = 7;
int sw2 = 6;
int sw3 = 5;
int rding;
int bright = 0;

void setup() {
  Serial.begin(115200);
  pinMode(led, OUTPUT);
  pinMode(sw1, INPUT);
  pinMode(sw2, INPUT);
  pinMode(sw3, INPUT);
}

void loop() {
  if (Serial.available() > 0) {
    rding = Serial.read();
    bright = int(rding);
  }  
  analogWrite(led, bright);
 
  int dr = digitalRead(sw1);
  int dr2 = digitalRead(sw2);
  int dr3 = digitalRead(sw3);
  int an1 = analogRead(A0);
  int an2 = analogRead(A1);
  int an3 = analogRead(A2);

  Serial.print(dr);
  Serial.print(",");
  Serial.print(dr2);
  Serial.print(",");
  Serial.print(dr3);
  Serial.print(",");
  Serial.print(an1);
  Serial.print(",");
  Serial.print(an2);
  Serial.print(",");
  Serial.println(an3);
}
