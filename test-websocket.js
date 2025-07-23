import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:4000/api/ws');

ws.on('open', function open() {
	console.log('✅ WebSocket connecté au serveur');

	// Test message Hello
	const helloMessage = {
		type: 'hello',
		message: 'Hello from test client!',
		deviceId: 'test-client-001',
		timestamp: Date.now(),
		wifiSignal: -45,
	};

	console.log('📤 Envoi message Hello:', helloMessage);
	ws.send(JSON.stringify(helloMessage));

	// Test message sensor data après 2 secondes
	setTimeout(() => {
		const sensorMessage = {
			type: 'sensor_data',
			tempPool: 23.5,
			tempOutdoor: 25.2,
			relayState: false,
			deviceId: 'test-client-001',
			timestamp: Date.now(),
			wifiSignal: -45,
			freeHeap: 180000,
			uptime: 1234,
		};

		console.log('📤 Envoi données capteurs:', sensorMessage);
		ws.send(JSON.stringify(sensorMessage));
	}, 2000);

	// Fermer après 5 secondes
	setTimeout(() => {
		console.log('🔌 Fermeture connexion WebSocket');
		ws.close();
	}, 5000);
});

ws.on('message', function message(data) {
	console.log('📥 Reçu du serveur:', JSON.parse(data.toString()));
});

ws.on('error', function error(err) {
	console.error('❌ Erreur WebSocket:', err);
});

ws.on('close', function close() {
	console.log('🔌 Connexion WebSocket fermée');
});
