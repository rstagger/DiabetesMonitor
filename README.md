Markdown# 🏥 Real-Time Health Monitoring System (Lambda Architecture)

![Status](https://img.shields.io/badge/Status-Prototype-green?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-Lambda_Architecture-blue?style=flat-square)
![Tech](https://img.shields.io/badge/Spark-Kafka-orange?style=flat-square)
![Cache](https://img.shields.io/badge/Redis-Stack-red?style=flat-square)

A scalable **IoT Big Data Healthcare System** designed to monitor Diabetes (Glucose) and Heart Rate in real-time. This project implements the **Lambda Architecture** to handle massive data streams with low latency while simultaneously archiving data for historical analysis.

---

## 🧠 System Architecture

The system follows the Lambda Architecture pattern, divided into three main layers: **Speed Layer** (Real-time), **Batch Layer** (Historical), and **Serving Layer** (Dashboard).



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
✨ Key Features⚡ Real-Time Visualization: Live streaming graph (Last 60 seconds) for Glucose trends via WebSockets.🛡️ Business Logic Validation: Automatically filters & drops invalid sensor data (e.g., negative heart rates, impossible glucose levels) to ensure data integrity before processing.🚨 Smart Alerts: Real-time status classification (NORMAL, WARNING, CRITICAL_HIGH, CRITICAL_LOW).💾 Data Lake Archiving: Stores raw sensor data into CSV files for audit trails and deep learning.📊 Batch Analytics: On-demand calculation of daily statistics (Average, Min, Max, Total Records) from the Data Lake.🧹 Auto-Initialization: Includes a script to clean the database and prepare the environment instantly.🛠️ Tech StackComponentTechnologyDescriptionIngestionApache KafkaMessage Broker for high-throughput data streaming.ProcessingPySpark (Spark 3.x)Engine for both Streaming (Speed) and Batch processing.StorageRedis StackIn-memory database for sub-millisecond dashboard updates.Data LakeLocal FilesystemRaw storage in CSV format.BackendNode.js + Socket.ioServes data to the frontend via WebSockets.FrontendHTML5 + Chart.jsResponsive dashboard for visualization.⚙️ PrerequisitesEnsure you have the following installed on your machine:Docker Desktop (Required for Kafka & Redis containers)Python 3.8+Node.js & npmJava JDK 8 or 11 (Required for Apache Spark)Install Python LibrariesBashpip install kafka-python pyspark redis pandas numpy
🚀 How to Run (Step-by-Step)To run the full system, you will need to open 6 separate terminals. Follow this order strictly to avoid connection errors.Step 0: Infrastructure & Initialization (Start Here)Make sure your Docker containers (Kafka, Zookeeper, Redis) are RUNNING.Run the initialization script to clear old Redis cache and create storage folders:Bashcd 4-Batch-layer
python init_db.py
Output: "✅ Redis Bersih! ... 🚀 SISTEM SIAP DIJALANKAN!"Step 1: Ingestion Layer (The Bridge)Connects the Python producer to the Kafka topic.Bashcd 2-ingestion-layer
python kafka_bridge.py
Step 2: Batch Layer (The Archiver)Starts saving raw data to CSV files (Data Lake).Bashcd 4-Batch-layer
python archiver.py
Step 3: Speed Layer (The Processor)Starts the Spark Streaming job.> Note: If you encounter errors, stop this script and delete the checkpoint folder inside 3-processing-layer.Bashcd 3-processing-layer
python spark_speed_layer.py
Step 4: Serving Layer (The Dashboard)Starts the Node.js web server.Bashcd 5-serving-dashboard
npm install # Run only once to install dependencies
node server.js
Step 5: Edge Layer (The Sensor)Starts generating dummy sensor data.Bashcd 1-edge-layer
python sensor_dummy.py
Step 6: Access the DashboardOpen your browser (Chrome/Edge) and navigate to:👉 http://localhost:3000📊 Running Historical Analysis (Batch Job)The "Daily Analysis" section (Avg/Max/Total) in the dashboard will not update automatically. It requires the Batch Job to run on the collected CSV data.Let the system run for 1-2 minutes so the archiver.py can collect enough data.Open a new terminal and run:Bashcd 4-Batch-layer
python spark_batch_job.py
Refresh the dashboard to see the updated statistics.📂 Project StructurePlaintextdiabetes-iot-project/
├── 1-edge-layer/
│   └── sensor_dummy.py        # Generates JSON data with random noise
├── 2-ingestion-layer/
│   └── kafka_bridge.py        # Pushes data to Kafka topic 'health_stream'
├── 3-processing-layer/
│   ├── spark_speed_layer.py   # Stream processing & Business Validation
│   └── checkpoint/            # Spark state (Delete this if code changes)
├── 4-Batch-layer/
│   ├── archiver.py            # Saves Kafka stream to CSV
│   ├── spark_batch_job.py     # Calculates stats from CSV
│   ├── init_db.py             # Clears Redis & prepares folders
│   └── data/storage/          # CSV files stored here (Data Lake)
└── 5-serving-dashboard/
    ├── server.js              # Node.js Backend
    └── public/
        └── index.html         # Frontend with Chart.js
🐛 TroubleshootingGraph is empty/not moving?Check if sensor_dummy.py is running.Ensure spark_speed_layer.py is running without errors.Fix: Stop Spark, delete the checkpoint folder in layer 3, and restart Spark.Redis Connection Error?Check your Docker container name (docker ps). If it's not redis-stack or localhost, update the host in spark_speed_layer.py and server.js.Batch Job says "Path not found"?The archiver.py hasn't saved any data yet. Wait 1 minute and try again.📜 LicenseThis project is created for educational purposes in Big Data & IoT Architecture.
