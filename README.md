📸 NextGallery Image Processing Backend

The backend service powering NextGallery, a Next.js-based image processing and gallery application. This backend handles image uploads, placeholder generation, and face detection — powered by a modular worker-based architecture using BullMQ, MongoDB, and Redis. Authentication is managed via JWT, and face detection is implemented using @vladmandic/face-api. Workers are hosted on AWS.

✨ Key Features

📁 Image metadata + file storage

🎨 Blur placeholder generation for faster previews

🧠 Face detection and tagging (powered by @vladmandic/face-api)

🕹️ Modular worker system using BullMQ queues

⚙️ Play/pause queue control to support Upstash Redis

🔄 Fault-isolated services: upload, blur, face-id

🧍 Person-based image filtering support

🔐 JWT-based authentication for API security

🌐 Workers hosted on AWS EC2

📦 MongoDB + Local/Cloud storage support

🏗️ Architecture Overview

🔹 V1: Singleton Worker Model

Originally, the backend used a monolithic worker to:

Save images

Generate blur placeholders

Run face detection

Problems:

⛔ One failure crashed the entire pipeline

📉 No horizontal scalability

🧩 Hard to maintain or test individual stages

🔸 V2: Modular Worker Services + Pub/Sub

Migrated to a multi-worker architecture where each processing task is handled by a dedicated queue and worker. Jobs are passed between them using BullMQ and Redis:

Worker

Responsibility

upload-worker

Handles uploads, metadata saving, and task dispatch

blur-worker

Generates blur placeholders

face-id-worker

Detects and tags faces using ML (@vladmandic/face-api)

📂 All worker files are organized under the Workers/ directory and are hosted on AWS.

⚙️ Redis / Upstash Issue & Play/Pause Workaround

🚨 Problem:

When using Upstash Redis, BullMQ queues stall due to:

Limited support for EVALSHA and other advanced commands

No support for stream-based polling

Redis serverless timeouts

✅ Workaround:

We introduced a manual play/pause mechanism to stabilize queues:

Queues are paused during critical DB/storage setup

Only resumed after readiness checks

Prevents BullMQ from executing jobs prematurely

Improves reliability in Upstash or similar serverless Redis setups

🔐 Authentication

Authentication is handled using JWT tokens. A token is issued on login and must be sent with all protected API routes. Tokens include expiration (JWT_EXPIRES) and are securely signed using a secret (JWT_SECRET).

⚙️ Required Environment Variables

All services and workers rely on a shared .env file. Here are the required keys:

NODE_ENV=
PORT=
DATA_BASE_PASSWORD=
DATA_BASE_USER=
DATA_BASE=
SUPABASE_KEY=
JWT_SECRET=
JWT_EXPIRES=
JWT_COOKIE_EXPIRES=
REDIS_URL=

Make sure these values are populated before starting any worker or server.

🚀 Getting Started

1. Clone the repo

git clone https://github.com/your-username/nextgallery-backend.git
cd nextgallery-backend

2. Install dependencies

npm install

3. Set up .env

Create a .env file in the root directory with all required environment variables as listed above.

4. Start the server and workers

node server.js            # Starts the main backend server
node Workers/upload-worker.js  # Starts the upload worker
node Workers/blur-worker.js    # Starts the blur worker
node Workers/face-id-worker.js # Starts the face ID worker

🧠 Tech Stack

Node.js + Express

MongoDB + Mongoose

Redis / Upstash Redis

BullMQ for queues

@vladmandic/face-api for face detection

JWT for authentication

AWS EC2 for worker hosting

🤝 Contributing

Feel free to open issues or submit pull requests! Ensure proper linting and commit conventions.
