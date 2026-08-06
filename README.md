# Collaborative Task Management System

A cloud-native, microservices-based distributed platform designed for real-time collaborative task management. The system is built with Go, JavaScript, WebSockets, NATS JetStream, and PostgreSQL, designed to be deployed on Kubernetes.

---

## Core Features

- **Collaborative Kanban Board**: Real-time task board using optimistic locking to prevent concurrent write conflicts.
- **Automated Task Assignment**: Heuristic engine that automatically assigns tasks based on team workload metrics.
- **Real-Time Notifications**: Push system using WebSockets synchronized across replicas via NATS.
- **Security Hardening**: Built-in XSS protection, parameterized database queries, and OAuth2 authentication.
- **Monitoring & Data Export**: High-volume JSON/CSV export engine integrated with Grafana, Prometheus, and Loki.

---

## Quick Start Guide

This application is a Single-Page Application (SPA) using modular ES6 JavaScript and must be run via a local web server to avoid CORS security issues.

### Run via Python HTTP Server
Run this command inside the project directory:
```bash
python3 -m http.server 8081
```
Then open your browser and navigate to: `http://localhost:8081`

### Run via Node.js (npx)
If you have Node.js installed, run:
```bash
npx http-server -p 8081
```
Then open your browser and navigate to: `http://localhost:8081`

---

## Repository Structure

```text
├── README.md                # Project Documentation & Setup Guide
├── index.html               # Frontend SPA (Kanban Dashboard & Simulator)
├── styles.css               # Vanilla CSS Design System (Dark Glassmorphism)
├── js/
│   ├── app.js               # UI Controller (Sanitizzazione XSS & Listener)
│   ├── data.js              # State Manager & Optimistic Locking Engine
│   ├── workloadEngine.js    # Workload Calculation & Auto-Assign Logic
│   ├── realtimeSimulator.js # WebSocket Hub, NATS Bus & Load Test Runner
│   └── exportEngine.js      # Structured JSON / CSV Export Generator
└── docs/
    ├── architecture_design.md # Detailed Architecture & Go Security Specs
    ├── architecture_diagram.png # High-Res C4 System Architecture Diagram (PNG)
    └── load_test_report.md   # Official 100-User Stress Test Report
```

---

## License

Released under the MIT License. Maintained by [Manum-dev](https://github.com/Manum-dev).
