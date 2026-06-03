const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Global metrics tracker for our simulation
let systemMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    droppedRequests: 0,
};

// Middleware parsing
app.use(express.json());

// Enable CORS so browser requests pass securely
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 1. Unified Route: Serve the frontend UI home page automatically
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. API Route: Fetch live system metrics
app.get('/api/metrics', (req, res) => {
    res.json(systemMetrics);
});

// 3. API Route: Reset simulation logs
app.post('/api/reset', (req, res) => {
    systemMetrics = { totalRequests: 0, successfulRequests: 0, droppedRequests: 0 };
    res.json({ message: "Metrics reset successfully" });
});

// 4. API Route: Main Recharge Endpoint with Fault Injection
app.post('/api/recharge', (req, res) => {
    systemMetrics.totalRequests++;
    
    // INTENTIONAL FAILURE INJECTION: 60% chance to drop requests under heavy load simulation
    if (Math.random() < 0.6) {
        systemMetrics.droppedRequests++;
        console.log(`[BACKEND] ❌ 504 Gateway Timeout Simulated.`);
        res.status(504).json({ error: "Gateway Timeout" });
    } else {
        systemMetrics.successfulRequests++;
        console.log(`[BACKEND] ✅ Transaction cleared for target: ${req.body.mobile || 'Simulated Client'}`);
        res.status(200).json({ message: "Recharge Successful", status: "COMPLETED" });
    }
});

// Fire up unified server pipeline
app.listen(PORT, () => {
    console.log(`🚀 Unified Express Core Architecture live on port ${PORT}`);
});