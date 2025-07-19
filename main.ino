#include <WiFi.h>
#include "config.h"

#define LED_PIN    2     // GPIO de la LED intégrée
#define PERIOD_MS  500   // période totale en millisecondes

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // Lance la connexion Wi‑Fi
  WiFi.begin(CONFIG_WIFI_SSID, CONFIG_WIFI_PASSWORD);
}

void loop() {
  bool connected = (WiFi.status() == WL_CONNECTED);

  if (connected) {
    // 2 clignotements sur 500 ms
    for (int i = 0; i < 2; i++) {
      digitalWrite(LED_PIN, HIGH);
      delay(PERIOD_MS / 4);    // 125 ms ON
      digitalWrite(LED_PIN, LOW);
      delay(PERIOD_MS / 4);    // 125 ms OFF
    }
  } else {
    // 1 clignotement sur 500 ms
    digitalWrite(LED_PIN, HIGH);
    delay(PERIOD_MS / 2);      // 250 ms ON
    digitalWrite(LED_PIN, LOW);
    delay(PERIOD_MS / 2);      // 250 ms OFF
  }

  // (La boucle recommence immédiatement, la période reste à 500 ms)
}
