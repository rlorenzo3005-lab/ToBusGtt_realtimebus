const express = require('express');
const cors = require('cors');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const app = express();

// Permette alla tua mappa HTML di fare richieste a questo server senza essere bloccata 🛡️
app.use(cors());

// L'URL magico che hai appena trovato! 🎯
const GTT_URL = "https://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx";

app.get('/api/veicoli', async (req, res) => {
    try {
        console.log("📡 Richiesta dati a GTT in corso...");
        
        // Scarichiamo i dati binari
        const response = await fetch(GTT_URL);
        if (!response.ok) {
            throw new Error(`Errore HTTP GTT: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        
        // La magia: decodifichiamo il Protobuf in un oggetto JavaScript leggibile 🪄✨
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
        
        // Inviamo il JSON pulito alla tua mappa! 📦
        res.json(feed);
        
    } catch (error) {
        console.error("❌ Errore:", error);
        res.status(500).json({ errore: "Impossibile decodificare i dati GTT" });
    }
});

// Avviamo il server sulla porta 3000 🚀
app.listen(3000, () => {
    console.log("🥷 Proxy Ninja in ascolto su http://localhost:3000");
    console.log("👉 I bus sono visibili su: http://localhost:3000/api/veicoli");
});