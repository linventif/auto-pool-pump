#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Passe l'adresse à 0x3F (et non 0x27)
LiquidCrystal_I2C lcd(0x3F, 16, 2);

// Configuration sondes de température DS18B20
const int tempPoolPin = 4;     // GPIO 4 pour capteur piscine
const int tempOutdoorPin = 18; // GPIO 18 pour capteur extérieur
OneWire oneWirePool(tempPoolPin);
OneWire oneWireOutdoor(tempOutdoorPin);
DallasTemperature sensorPool(&oneWirePool);
DallasTemperature sensorOutdoor(&oneWireOutdoor);

// Configuration relais
const int relayPin = 5;  // GPIO 5 pour le relais
const float tempDifferenceThreshold = 5.0;  // Seuil de différence en °C

unsigned long dernierTemps = 0;
float tempPool = 0.0;
float tempOutdoor = 0.0;
bool relayState = false;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialisation I2C sur ESP32 (SDA=21, SCL=22)
  Wire.begin(21, 22);
  Wire.setClock(100000);       // fixe à 100 kHz pour plus de stabilité

  // Initialisation LCD
  lcd.init();
  lcd.backlight();

  // Initialisation relais
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);  // Relais désactivé au démarrage (logique normale)
  
  // Test du relais au démarrage
  Serial.println("Test du relais sur GPIO 5 (logique normale)...");
  digitalWrite(relayPin, HIGH);   // Activation = HIGH
  delay(1000);
  digitalWrite(relayPin, LOW);    // Désactivation = LOW
  delay(500);
  Serial.println("Relais initialisé sur GPIO 5 (active HIGH - sécurisé)");

  // Initialisation capteurs de température DS18B20
  sensorPool.begin();
  sensorOutdoor.begin();
  
  // Vérification des capteurs
  Serial.println("Recherche de capteurs DS18B20...");
  int deviceCountPool = sensorPool.getDeviceCount();
  int deviceCountOutdoor = sensorOutdoor.getDeviceCount();
  Serial.printf("Capteur piscine (GPIO 4): %d\n", deviceCountPool);
  Serial.printf("Capteur extérieur (GPIO 18): %d\n", deviceCountOutdoor);
  
  if (deviceCountPool == 0) {
    Serial.println("ERREUR: Aucun capteur DS18B20 trouvé pour la piscine (GPIO 4)!");
  } else {
    Serial.println("Capteur piscine détecté sur GPIO 4");
    sensorPool.setResolution(12); // Résolution 12 bits
  }
  
  if (deviceCountOutdoor == 0) {
    Serial.println("ERREUR: Aucun capteur DS18B20 trouvé pour l'extérieur (GPIO 18)!");
  } else {
    Serial.println("Capteur extérieur détecté sur GPIO 18");
    sensorOutdoor.setResolution(12); // Résolution 12 bits
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

  // Lecture capteurs de température
  sensorPool.requestTemperatures();
  sensorOutdoor.requestTemperatures();
  delay(100); // Attendre la conversion
  tempPool = sensorPool.getTempCByIndex(0);
  tempOutdoor = sensorOutdoor.getTempCByIndex(0);

  // Vérification de la validité des températures
  if (tempPool == DEVICE_DISCONNECTED_C || tempPool == -127.0) {
    Serial.println("ERREUR: Capteur piscine déconnecté ou défaillant");
    tempPool = -999.0; // Valeur d'erreur
  }
  
  if (tempOutdoor == DEVICE_DISCONNECTED_C || tempOutdoor == -127.0) {
    Serial.println("ERREUR: Capteur extérieur déconnecté ou défaillant");
    tempOutdoor = -999.0; // Valeur d'erreur
  }

  // Affichage série
  Serial.printf("Piscine: %5.2fC | Extérieur: %5.2fC\n", tempPool, tempOutdoor);

  // Calcul de la différence et contrôle du relais
  float tempDifference = tempPool - tempOutdoor; // Différence signée (peut être négative)
  float absDifference = abs(tempDifference);
  
  // Le relais ne se déclenche que si la piscine est plus FROIDE que l'extérieur
  // (pour activer un chauffage ou une circulation)
  bool shouldActivateRelay = (tempDifference <= -tempDifferenceThreshold) && 
                             (tempPool != -999.0) && (tempOutdoor != -999.0);
  
  if (shouldActivateRelay != relayState) {
    relayState = shouldActivateRelay;
    
    // Activation/désactivation avec logique normale (active HIGH)
    if (relayState) {
      digitalWrite(relayPin, HIGH);  // ACTIVATION = HIGH
      Serial.printf("Pompe ACTIVÉE - Piscine plus froide: %5.2fC < Extérieur: %5.2fC (Diff: %5.2fC)\n", 
                    tempPool, tempOutdoor, tempDifference);
    } else {
      digitalWrite(relayPin, LOW);   // DÉSACTIVATION = LOW (sécurisé)
      Serial.printf("Pompe DÉSACTIVÉE - Conditions normales (Diff: %5.2fC)\n", tempDifference);
    }
    
    // Vérification de l'état
    int pinState = digitalRead(relayPin);
    Serial.printf("État GPIO 5: %s -> Pompe %s\n", 
                  pinState ? "HIGH (3.3V)" : "LOW (0V)", 
                  pinState ? "ACTIVÉE" : "DÉSACTIVÉE");
  }

  // Affichage LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  
  // Première ligne: Température piscine et état relais
  if (tempPool == -999.0) {
    lcd.printf("Pool: ERROR!");
  } else {
    lcd.printf("Pool:%3.1fC %s", tempPool, relayState ? "ON" : "OFF");
  }
  
  // Deuxième ligne: Température extérieur et différence
  lcd.setCursor(0, 1);
  if (tempOutdoor == -999.0) {
    lcd.printf("Out: ERROR!");
  } else {
    float diff = tempPool - tempOutdoor; // Différence signée
    lcd.printf("Out:%4.1fC D:%+2.1f", tempOutdoor, diff);
  }
}
