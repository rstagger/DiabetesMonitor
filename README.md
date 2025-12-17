# DiabetesMonitor
# 🏥 Real-Time Health Monitoring System (Lambda Architecture)

![Status](https://img.shields.io/badge/Status-Prototype-green)
![Architecture](https://img.shields.io/badge/Architecture-Lambda_Architecture-blue)
![Tech](https://img.shields.io/badge/Spark-Kafka-orange)
![Redis](https://img.shields.io/badge/Cache-Redis-red)

A scalable **IoT Big Data Healthcare System** designed to monitor Diabetes (Glucose) and Heart Rate in real-time. This project implements the **Lambda Architecture** to handle massive data streams with low latency while simultaneously archiving data for historical analysis.

---

## 🧠 System Architecture

The system is divided into three main layers: **Speed Layer** (Real-time), **Batch Layer** (Historical), and **Serving Layer** (Dashboard).

```mermaid
graph LR
    subgraph "1. Edge Layer"
    A[Sensor Simulator] -->|JSON Stream| B(Kafka Broker)
    end

    subgraph "2. Speed Layer (Real-time)"
    B -->|Stream| C{Spark Structured Streaming}
    C -->|Validate & Process| D[(Redis Cache)]
    end

    subgraph "3. Batch Layer (Historical)"
    B -->|Stream| E[Archiver Script]
    E -->|Write CSV| F[Data Lake / Storage]
    F -->|Read CSV| G{Spark Batch Job}
    G -->|Aggregated Stats| D
    end

    subgraph "4. Serving Layer"
    D -->|Fetch Data| H[Node.js Server]
    H -->|WebSocket| I[Web Dashboard]
    end
