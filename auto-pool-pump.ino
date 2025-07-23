#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Passe l'adresse à 0x3F (et non 0x27)
LiquidCrystal_I2C lcd(0x3F, 16, 2);

// Configuration sonde de température DS18B20
const int temperaturePin = 4;  // GPIO 4 pour DAT
OneWire oneWire(temperaturePin);
DallasTemperature sensors(&oneWire);

unsigned long dernierTemps = 0;
float temperature = 0.0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialisation I2C sur ESP32 (SDA=21, SCL=22)
  Wire.begin(21, 22);
  Wire.setClock(100000);       // fixe à 100 kHz pour plus de stabilité

  // Initialisation LCD
  lcd.init();
  lcd.backlight();

  // Initialisation capteur de température DS18B20
  sensors.begin();
  
  // Vérification du capteur
  Serial.println("Recherche de capteurs DS18B20...");
  int deviceCount = sensors.getDeviceCount();
  Serial.printf("Nombre de capteurs trouvés: %d\n", deviceCount);
  
  if (deviceCount == 0) {
    Serial.println("ERREUR: Aucun capteur DS18B20 trouvé!");
    Serial.println("Vérifiez le branchement sur GPIO 4");
  } else {
    Serial.println("Capteur DS18B20 détecté");
    sensors.setResolution(12); // Résolution 12 bits
  }

  Serial.println("LCD init OK à 0x3F");
  Serial.println("Système initialisé");
  dernierTemps = millis();
}

void loop() {
  unsigned long now = millis();
  if (now - dernierTemps < 2000) return;  // toutes les 2 secondes
  unsigned long dt_ms = now - dernierTemps;
  dernierTemps = now;

  // Lecture capteur de température
  sensors.requestTemperatures();
  delay(100); // Attendre la conversion
  temperature = sensors.getTempCByIndex(0);

  // Vérification de la validité de la température
  if (temperature == DEVICE_DISCONNECTED_C || temperature == -127.0) {
    Serial.println("ERREUR: Capteur déconnecté ou défaillant");
    temperature = -999.0; // Valeur d'erreur
  }

  // Affichage série
  Serial.printf("Temp: %5.2fC\n", temperature);

  // Affichage LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  if (temperature == -999.0) {
    lcd.printf("Capteur ERROR!");
    lcd.setCursor(0, 1);
    lcd.printf("Check GPIO 4");
  } else {
    lcd.printf("Temp: %5.2fC", temperature);
    lcd.setCursor(0, 1);
    lcd.printf("Status: OK");
  }
}
