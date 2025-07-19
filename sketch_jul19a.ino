// Blink.ino — fait clignoter la LED intégrée sur GPIO 2

void setup() {
  // initialisation de la LED intégrée (GPIO 2) comme sortie
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);   // LED allumée
  delay(500);              // attend 500 ms
  digitalWrite(2, LOW);    // LED éteinte
  delay(500);              // attend 500 ms
}
