# BharatConnect: Fault-Tolerant Distributed Telecom Portal & Load Lab

A full-stack simulation engineered to analyze and solve high-congestion network drops during high-volume transactions (simulating core gateway traffic). Built using a Node.js/Express backend and a responsive vanilla JavaScript/Tailwind CSS frontend to showcase resilient system architecture.

## 🛠️ System Architecture & Challenges
In high-traffic systems, fixed-interval network retries cause a **"Thundering Herd"** problem, where multiple clients repeatedly crash a recovering server or core database in synchronized waves. 

To mitigate this, this project implements a client-side **Exponential Backoff with Jitter** algorithm to dynamically decorrelate retry patterns and smooth out traffic spikes.

### Architectural Overview
```text
[Distributed Clients] 
       │
       ▼  (POST /api/recharge - Concurrent Load)
 [Express API Gateway] ──(Fault Injection: 60% Drops)──► [Core Engine]
                                                             │
                                 ┌───────────────────────────┴───────────────────────────┐
                                 ▼                                                       ▼
                       Success (200 OK)                                         Drop (504 Timeout)
                                                                                         │
                                                                       ┌─────────────────┴─────────────────┐
                                                                       ▼                                   ▼
                                                            [Synchronized Retries]              [Staggered Jitter Retries]
                                                               (No Backoff Loop)                (Exponential Backoff Formula)
                                                                       │                                   │
                                                                       ▼                                   ▼
                                                            Result: Socket Choking              Result: Traffic Smoothing