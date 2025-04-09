## Task Queue System – NestJS + MongoDB

## Features

- Asynchronous Task Processing  
- Rate Limiting (e.g., 5 tasks per 15 seconds)  
- Task Status Tracking (Pending, Processing, Completed, Failed)  
- Retry Mechanism for Failed Tasks  
- Optional: Scheduling via `scheduleAt`  
- Optional: Priority Queue support  
- Optional: Real-time updates using WebSockets

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <https://github.com/razinp061/rate_limited_task_queue_system.git>
cd your-project-folder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Ensure MongoDB is running. Update connection settings in `app.module.ts` or use `.env`.

### 4. Run the Server
```bash
npm run start:dev
```
Server will run on 4000 or your port in .env
---

## How It Works

1. **Task Submission**
   - Tasks are submitted via POST API. ('/task)
   - Saved with status `PENDING`.

2. **Background Worker (Cronjob)**
   - Triggered every 1 minute at 45th second using `@nestjs/schedule`.
   - Picks max 5 tasks (`PENDING`), marks as `PROCESSING`, simulates work, and updates status to `COMPLETED`.

3. **Failure Handling**
   - Max 3 attempts.
   - On error, retry later. After 3 failures → marked `FAILED`.

4. **Scheduled Tasks**
   - Tasks with `scheduleAt` are only picked up after the scheduled time.

5. **Priority Queue**
   - Tasks with higher priority are processed first.
---

## Design Decisions

### `@nestjs/schedule`
Chosen for lightweight background processing using cron.

### MongoDB (Mongoose)
All tasks persist in MongoDB for durability and querying.

### Rate Limiting Logic
Custom JS rate limit for simplicity. Could replace with `rate-limiter-flexible` if needed.

### Jest Testing
Unit tests written using `@nestjs/testing` and `jest`.

---

## Testing

```bash
# Run all unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

---
## Docker Setup

### 1. Build and Run with Docker
```bash
# Build the Docker image
docker build -t rate-limited-task-queue .

# Run the container (default port is 4000)
docker run -p 4000:4000 --env-file .env rate-limited-task-queue

```
---
