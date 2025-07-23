#include <Wire.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("Démarrage du scanner I2C...");
  Serial.println("Scanning...");
  
  // Initialisation I2C sur ESP32 (SDA=21, SCL=22)
  Wire.begin(21, 22);
  Wire.setClock(100000);
  
  byte error, address;
  int nDevices;
  
  nDevices = 0;
  for(address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("Device I2C trouvé à l'adresse 0x");
      if (address < 16) 
        Serial.print("0");
      Serial.print(address, HEX);
      Serial.println("  !");
      
      nDevices++;
    }
    else if (error == 4) {
      Serial.print("Erreur inconnue à l'adresse 0x");
      if (address < 16) 
        Serial.print("0");
      Serial.println(address, HEX);
    }    
  }
  
  if (nDevices == 0)
    Serial.println("Aucun device I2C trouvé\n");
  else
    Serial.println("Scan terminé\n");
    
  Serial.println("Adresses LCD I2C communes:");
  Serial.println("- 0x27 (PCF8574)");
  Serial.println("- 0x3F (PCF8574A)");
  Serial.println("- 0x20 (MCP23008)");
  Serial.println("- 0x38-0x3F (range PCF8574A)");
}

void loop() {
  delay(5000);
}
