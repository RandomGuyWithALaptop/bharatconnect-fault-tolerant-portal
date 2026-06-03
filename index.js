const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const SIMULATED_FAILURE_RATE = 0.50; // 50% chance of backend dropping the packet

const telecomPlans = [
    { id: "199", price: "199", validity: "30 Days", desc: "2GB/Day + Unlimited Calls" },
    { id: "797", price: "797", validity: "300 Days", desc: "Keep SIM active long-term" }
];

const server = http.createServer((req, res) => {
    // 1. Set global CORS headers to allow smooth data flow
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 2. SERVE THE UI: Catch root path requests and return the index.html file
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Error: index.html file not found in directory.");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    // 3. API ENDPOINT: Fetch active data plans
    if (req.url === '/api/plans' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(telecomPlans));
        return;
    }

    // 4. API ENDPOINT: Process transaction with simulated flakiness
    if (req.url === '/api/recharge' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { mobile, planId } = JSON.parse(body);

            if (Math.random() < SIMULATED_FAILURE_RATE) {
                console.log(`[BACKEND] ❌ Request dropped for ${mobile}. Simulating 504 Gateway Timeout.`);
                res.writeHead(504, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "HLR Core Database failed to respond." }));
            } else {
                console.log(`[BACKEND] ✅ Recharge successful for ${mobile} with plan ₹${planId}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: `Recharge of ₹${planId} credited successfully.` }));
            }
        });
        return;
    }

    // Fallback for non-existent requests
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(PORT, () => {
    console.log(`\n🚀 SDE Full-Stack Simulation live at port ${PORT}`);
    console.log(`📡 Serving UI and Core Gateway endpoints flawlessly.\n`);
});