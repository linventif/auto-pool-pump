# Arduino WebSocket Setup

## Librairie WebSocket requise

Ce projet utilise la librairie **ArduinoWebsockets** par Gilmaimon au lieu de la librairie WebSocketsClient.

### Installation

#### Via Arduino IDE Library Manager:

1. Ouvrez Arduino IDE
2. Allez dans **Sketch** → **Include Library** → **Manage Libraries**
3. Recherchez `ArduinoWebsockets`
4. Installez la librairie par **Gil Maimon**

#### Via PlatformIO:

Ajoutez cette ligne dans votre `platformio.ini`:

```ini
lib_deps = gilmaimon/ArduinoWebsockets@^0.5.4
```

#### Via GitHub:

```bash
git clone https://github.com/gilmaimon/ArduinoWebsockets.git
```

### Librairies requises

- **ArduinoWebsockets** (par Gil Maimon)
- **ArduinoJson**
- **OneWire**
- **DallasTemperature**
- **LiquidCrystal_I2C**

### Configuration

1. Copiez `config.example.h` vers `config.h`
2. Modifiez les paramètres dans `config.h`:
    - WiFi SSID et mot de passe
    - Adresse du serveur WebSocket
    - ID du device

### Structure des pins (configurables dans config.h)

```cpp
#define PIN_POOL_SENSOR 4        // GPIO4 pour capteur piscine
#define PIN_OUTDOOR_SENSOR 18    // GPIO18 pour capteur extérieur
#define PIN_RELAY 5              // GPIO5 pour relais
#define LCD_SDA 21               // GPIO21 - SDA
#define LCD_SCL 22               // GPIO22 - SCL
```

Toutes les configurations sont maintenant centralisées dans `config.h` !
