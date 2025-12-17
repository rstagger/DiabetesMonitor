import time
import json
import random
import paho.mqtt.client as mqtt

# --- KONFIGURASI PENTING ---
BROKER = "localhost"
PORT = 1883
TOPIC = "health/data"  # <--- INI KUNCINYA
# ---------------------------

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Connected to MQTT Broker! Topic: {TOPIC}")
    else:
        print(f"Failed to connect, return code {rc}")

client = mqtt.Client()
client.on_connect = on_connect
client.connect(BROKER, PORT, 60)

client.loop_start()

try:
    while True:
        data = {
            "sensor_id": "sensor_001",
            "timestamp": time.time(),
            "heart_rate": random.randint(50, 150),
            "glucose_level": random.randint(70, 140),
            "temperature": round(random.uniform(36.0, 37.5), 1)
        }
        payload = json.dumps(data)
        
        # Kirim data ke Topik yang sudah ditentukan
        client.publish(TOPIC, payload)
        print(f"[SENSOR] Sent to '{TOPIC}': {data['heart_rate']} bpm, {data['glucose_level']} mg/dL")
        
        time.sleep(2) # Kirim setiap 2 detik

except KeyboardInterrupt:
    print("Sensor stopped.")
    client.loop_stop()