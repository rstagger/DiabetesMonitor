const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- SETUP REDIS CLIENT ---
const client = createClient({
    url: 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log("✅ Terhubung ke Redis Database!");
    } catch (err) {
        console.error("❌ Gagal connect ke Redis:", err);
    }
})();

// Sajikan folder public (HTML/CSS)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('Client Web terhubung...');
});

// --- FUNGSI POLLING DATA (Loop Utama) ---
setInterval(async () => {
    try {
        // 1. AMBIL DATA REAL-TIME (Angka Speedometer)
        const rawRealTime = await client.get('sensor_data');
        if (rawRealTime) {
            io.emit('update_realtime', JSON.parse(rawRealTime));
        }

        // 2. AMBIL DATA GRAFIK (Trend Line)
        // Ambil semua item di list 'glucose_trend'
        const rawTrendList = await client.lRange('glucose_trend', 0, -1);
        if (rawTrendList && rawTrendList.length > 0) {
            // Redis mengembalikan array of strings, kita parse jadi array of objects
            const parsedTrend = rawTrendList.map(item => JSON.parse(item));
            io.emit('update_graph', parsedTrend);
        }

        // 3. AMBIL DATA HISTORIS (Batch Layer Analytics)
        const rawBatch = await client.get('batch_stats');
        if (rawBatch) {
            io.emit('update_history', JSON.parse(rawBatch));
        }
        
        // Log status di terminal server (supaya terlihat hidup)
        if (rawRealTime) {
            // Overwrite baris terminal biar rapi
            process.stdout.write(`\r[SERVER] Data Sent. Realtime: OK | Graph Points: ${rawTrendList ? rawTrendList.length : 0} | Batch: ${rawBatch ? "OK" : "Waiting"}   `);
        }

    } catch (error) {
        console.error("\n[ERROR READING REDIS]:", error.message);
    }
}, 2000); // Update setiap 2 detik

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Server Dashboard berjalan di http://localhost:${PORT}`);
    console.log("   Buka browser di: http://localhost:3000");
});