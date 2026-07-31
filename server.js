const express = require('express');
const cors = require('cors');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const app = express();

// Permette alla tua mappa/app HTML di fare richieste a questo server senza essere bloccata 🛡️
app.use(cors());

// 🎯 URL per la posizione in tempo reale dei veicoli
const GTT_VEHICLE_POSITIONS_URL = "https://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx";

// ⏱️ URL per gli aggiornamenti sui viaggi (orari di arrivo e ritardi)
const GTT_TRIP_UPDATES_URL = "https://percorsieorari.gtt.to.it/das_gtfsrt/trip_update.aspx";

// 📍 Endpoint 1: Posizione dei Veicoli
app.get('/api/veicoli', async (req, res) => {
    try {
        console.log("📡 Richiesta posizioni veicoli a GTT...");
        
        const response = await fetch(GTT_VEHICLE_POSITIONS_URL);
        if (!response.ok) {
            throw new Error(`Errore HTTP GTT: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
        
        res.json(feed);
        
    } catch (error) {
        console.error("❌ Errore veicoli:", error);
        res.status(500).json({ errore: "Impossibile decodificare le posizioni dei veicoli" });
    }
});

// ⏱️ Endpoint 2: Orari e Previsioni Arrivi
app.get('/api/orari', async (req, res) => {
    try {
        console.log("📡 Richiesta orari e trip updates a GTT...");
        
        const response = await fetch(GTT_TRIP_UPDATES_URL);
        if (!response.ok) {
            throw new Error(`Errore HTTP GTT: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
        
        res.json(feed);
        
    } catch (error) {
        console.error("❌ Errore orari:", error);
        res.status(500).json({ errore: "Impossibile decodificare le stime degli orari" });
    }
});

// Port dinamica per Render o 3000 in locale 🚀
const PORT = process.env.PORT;
app.listen(PORT, () => {
console.log("\n--- IN LOCALE ---");
    console.log(`👉 Posizione Veicoli: http://localhost:${PORT}/api/veicoli`);
    console.log(`👉 Orari e Previsioni: http://localhost:${PORT}/api/orari`);
    console.log("\n--- SU RENDER ---");
    console.log(`👉 Posizione Veicoli: https://tobusgtt-realtimebus.onrender.com/api/veicoli`);
    console.log(`👉 Orari e Previsioni: https://tobusgtt-realtimebus.onrender.com/api/orari`);
});