# BharatConnect: Fault-Tolerant Distributed Telecom Portal & Load Lab

A decoupled microservice architecture engineered to analyze and solve high-congestion network drops during high-volume transactions. Built using a Node.js/Express API Gateway and an independent internal Processing Microservice running inside isolated Docker containers to showcase resilient system architecture.

## 🛠️ Distributed System Architecture
Instead of a monolithic backend, this architecture splits system responsibilities across dedicated microservices communicating over an internal network. This prevents database pile-ups and isolates cascading failures.

### System Topography
```text
                           ┌───────────────── Distributed System ─────────────────┐
                           │                                                      │
[Frontend UI] ──► [Gateway Service (Port 5000)] ──► [Processing Service (Port 5001)]
                           │                                                      │
                           └──────────────────────────────────────────────────────┘
### The Math Under the Hood
The smart retry interval expands exponentially based on consecutive failures, heavily padded by a randomized decorrelation factor (jitter) to distribute network demand across time:

$$Delay = (\text{Base Delay} \times 2^{\text{attempt}}) + \text{Random Jitter}$$

- **Attempt 1:** ~1000ms + random variance
- **Attempt 2:** ~2000ms + random variance
- **Attempt 3:** ~4000ms + random variance