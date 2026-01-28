# MERN Todo App

This is a simple Todo application built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to be easily deployed and run locally.

## Features

- Create, Read, Update, Delete (CRUD) Todos
- Mark todos as completed
- Responsive design
- Mobile-friendly

## Prerequisites

- Node.js installed
- MongoDB installed and running locally (for local development)

## Getting Started

### 1. Installation

Install dependencies for both client and server:

```bash
npm install
npm run install-all
```

### 2. Running Locally (Development Mode)

Run both client and server in development mode with hot-reloading:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5001

### 3. Building for Production

Build the client and prepare the server:

```bash
npm run build
```

This will:
1. Build the React client.
2. Compile the TypeScript server code.
3. Move the client build files to the server's public directory.

### 4. Running the Production Build Locally

Simulate a production environment locally:

```bash
npm start
```

- App: http://localhost:5001

## Deployment

To deploy this application:

1. **Set Environment Variables**:
   - `MONGO_URI`: Connection string to your MongoDB database (e.g., MongoDB Atlas).
   - `PORT`: (Optional) The port to run the server on (default: 5001).

2. **Build and Start**:
   Most deployment platforms (like Heroku, Render, Railway) will automatically run `npm install`, `npm run build`, and `npm start`.

   Ensure your deployment platform is configured to run `npm start` from the root directory.

## Project Structure

- `client/`: React frontend
- `server/`: Express backend
- `package.json`: Root configuration to manage both
