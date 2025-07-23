#ifndef CONFIG_WIFI_CREDENTIALS_H
#define CONFIG_WIFI_CREDENTIALS_H

// WiFi Configuration
const char* CONFIG_WIFI_SSID     = "YOUR_SSID";
const char* CONFIG_WIFI_PASSWORD = "YOUR_PASSWORD";

// API Configuration
const char* CONFIG_API_BASE_URL = "https://iot.linv.dev/api";  // Remplacez par votre IP
const char* CONFIG_API_TOKEN = "your_jwt_token_here";                // Token d'authentification
const char* CONFIG_DEVICE_ID = "pool-controller-001";               // ID unique de votre appareil

// Interval de transmission (en millisecondes)
const unsigned long CONFIG_API_SEND_INTERVAL = 30000;  // 30 secondes

#endif
