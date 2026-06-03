# BharatConnect: Fault-Tolerant Distributed Telecom Portal

A full-stack simulation engineered to solve high-congested network drops during high-volume transactions (simulating core gateway traffic). Built using a Node.js backend and a responsive vanilla JavaScript/Tailwind CSS frontend to showcase resilient system architecture.

## 🛠️ System Architecture & Challenges

In high-traffic systems, fixed-interval network retries cause a **"Thundering Herd"** problem, where multiple clients repeatedly crash a recovering server or core database in synchronized waves.

To mitigate this, this project implements a client-side **Exponential Backoff with Jitter** algorithm to dynamically decorrelate retry patterns and smooth out traffic spikes.

### Architectural Overview

```text
[Frontend Client]
       │
       ▼  (POST /api/recharge)
 [API Gateway] ──(5000)──► [Node.js Core Server]
                                │
                                ├──► Success (200 OK) -> Done!
                                └──► Drop (504 Timeout)
                                           │
  ┌────────────────────────────────────────┘
  ▼
[Exponential Backoff Loop]
  │
  ├──► Attempt 1: Wait 1000ms + Jitter
  ├──► Attempt 2: Wait 2000ms + Jitter
  └──► Attempt 3: Wait 4000ms + Jitter
```
