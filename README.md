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

✨ Key Features
⚡ Real-Time Visualization: Live updating graph (Last 60 seconds) for Glucose trends.

🛡️ Business Logic Validation: Automatically filters/drops invalid sensor data (e.g., negative heart rates, impossible glucose levels) before processing to ensure data integrity.

🚨 Smart Alerts: Categorizes health status into NORMAL, WARNING, CRITICAL_HIGH, or CRITICAL_LOW.

💾 Data Lake Archiving: Stores raw sensor data into CSV files for audit trails and deep learning.

📊 Batch Analytics: On-demand calculation of daily statistics (Average, Min, Max, Total Records).

🧹 System Reset: Includes an initialization script to clean DB and prepare storage environments.

🛠️ Tech Stack

Component,Technology,Description
Ingestion,Apache Kafka,Message Broker for high-throughput data streaming.
Processing,PySpark (Spark 3.x),Engine for both Streaming and Batch processing.
Storage,Redis Stack,In-memory database for sub-millisecond dashboard updates.
Storage,Local Filesystem,Acts as a Data Lake (CSV format).
Backend,Node.js + Socket.io,Serves data to the frontend via WebSockets.
Frontend,HTML5 + Chart.js,Responsive dashboard for visualization.
