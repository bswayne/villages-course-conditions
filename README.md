# Villages Course Conditions Web Application

![Villages Course Conditions Landing Page](frontend/src/assets/vcc_medium.jpg)

A web application for viewing and submitting user-reported golf course conditions for Executive, Championship, and Pitch & Putt courses within The Villages®, Florida.

## ✨ Features

*   **User Authentication:** Secure login/signup via Email/Password, Google, and Apple using Firebase Authentication.
*   **Course Browsing:** View lists of courses filtered by type (Executive, Championship, Pitch & Putt).
*   **Condition Aggregation:** See the average condition rating based on reports from the last 7 days directly on the course list.
*   **Detailed View:** Access a dedicated page for each course showing individual condition reports (rating, comment, date played, user display name) from the last 7 days.
*   **Condition Reporting:** Logged-in users with a configured display name can submit new condition reports.
*   **User Profiles:** Users can manage their profile information (name, village) and choose how their name is displayed on reports.
*   **Responsive Design:** Adapts layout for different screen sizes (Table view on desktop, Card view on mobile for course lists).
*   **Public Landing Page:** A welcoming entry point for non-authenticated users.
*   **Mobile App Promotion:** Includes links to the related "Unofficial Guide - The Villages" mobile app.

## 💻 Technology Stack

*   **Frontend:**
    *   React (v19) with Vite
    *   React Router DOM (v7) for routing
    *   Material UI (MUI) for component library and styling
    *   Axios for HTTP requests
    *   Firebase Client SDK (Authentication)
*   **Backend:**
    *   Node.js (v18)
    *   Express.js framework
    *   Firebase Admin SDK (Firestore access, Auth verification)
    *   `cors` for handling Cross-Origin Resource Sharing
    *   `dotenv` for environment variable management
*   **Database:** Google Firestore (NoSQL)
*   **Authentication:** Firebase Authentication
*   **Secrets Management:** HashiCorp Vault (during deployment)
*   **Deployment & Infrastructure:**
    *   Docker & Docker Compose
    *   Nginx (serving frontend static files and proxying API requests)
    *   GitHub Actions for CI/CD
    *   Cloudflare Tunnel (for secure SSH access to deployment server)
    *   Ubuntu Server (deployment target)

## 📋 Prerequisites

Before you begin development, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager
*   [Git](https://git-scm.com/)
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)
*   A [Firebase Project](https://console.firebase.google.com/) with:
    *   Firestore Database enabled
    *   Firebase Authentication enabled (Email/Password, Google, Apple sign-in methods configured)
*   (For Deployment) Access to a HashiCorp Vault instance.
*   (For Deployment) A deployment server accessible via SSH (configured with Cloudflare Tunnel in this setup).

## 🚀 Getting Started (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    # or: yarn install
    cd ..
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    # or: yarn install
    cd ..
    ```

4.  **Configure Backend Environment Variables:**
    *   Navigate to the `backend/` directory.
    *   Create a file named `.env`.
    *   **Firebase Admin SDK:** Download your Firebase Admin SDK service account key JSON file from your Firebase project settings. **DO NOT COMMIT THIS FILE.**
        *   Option A (Recommended for local): Save the JSON file in the `backend/` directory (e.g., `firebase-adminsdk.json`). Update `backend/firebase.js` to load it directly in development mode (as it currently does).
        *   Option B: Copy the *entire content* of the JSON file and paste it into the `.env` file as the value for `FIREBASE_ADMIN_SDK_JSON_CONTENT`. Ensure it's formatted correctly as a single-line string or handle multi-line variables appropriately if your environment supports it.
    *   Add the following variables to `backend/.env`:
        ```dotenv
        # backend/.env

        # Port for the backend server
        PORT=3001

        # URL of the frontend (for CORS) - Adjust port if needed for local dev
        FRONTEND_URL=http://localhost:5173

        # Firebase Admin SDK JSON content (Use Option B above OR load from file via firebase.js)
        # FIREBASE_ADMIN_SDK_JSON_CONTENT='{"type": "service_account", ...}'

        # Set Node environment (optional for local, will be 'production' in deployment)
        NODE_ENV=development
        ```

5.  **Configure Frontend Environment Variables:**
    *   Navigate to the `frontend/` directory.
    *   Create a file named `.env`.
    *   Add your Firebase web app configuration keys (obtain these from your Firebase project settings -> Project Overview -> Add app -> Web):
        ```dotenv
        # frontend/.env

        # Firebase Web App Configuration (Replace with your actual values)
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id # Optional, for Analytics

        # Base URL for the backend API (adjust if backend runs on a different port/host)
        VITE_API_BASE_URL=http://localhost:3001/api
        ```
    *   **Important:** Ensure variable names start with `VITE_` so Vite exposes them to your frontend code.

6.  **Run the Application:**
    *   You need to run both the frontend and backend servers concurrently. Open two separate terminals.
    *   **Terminal 1 (Backend):**
        ```bash
        cd backend
        npm run dev
        ```
    *   **Terminal 2 (Frontend):**
        ```bash
        cd frontend
        npm run dev
        ```
    *   The frontend should now be accessible at `http://localhost:5173` (or the port Vite chooses).
    *   The backend API will be running at `http://localhost:3001`.

## ☁️ Deployment

This project uses GitHub Actions for automated deployment upon pushing to the `main` branch. The workflow (`.github/workflows/deploy.yml`) performs the following steps:

1.  Checks out the code.
2.  Installs Cloudflared on the runner.
3.  Sets up the SSH key (from GitHub Secrets) for accessing the deployment server via the Cloudflare Tunnel.
4.  Connects to the deployment server via SSH using Cloudflared as a proxy.
5.  Executes a script on the remote server:
    *   Navigates to the deployment directory (`/home/bswayne/villages-course-conditions`).
    *   Pulls the latest changes from the `main` branch.
    *   Authenticates to HashiCorp Vault using AppRole credentials stored on the server (`/etc/vault/approle_role_id`, `/etc/vault/approle_secret_id`).
    *   Fetches necessary secrets (Firebase credentials, API keys) from Vault.
    *   Creates/Updates a `.env` file in the deployment directory with fetched secrets and runtime configuration.
    *   Runs `docker compose --env-file .env up -d --remove-orphans --force-recreate --build` to:
        *   Build fresh Docker images for frontend and backend, injecting build-time arguments (like Firebase keys for the frontend build).
        *   Start the containers using the environment variables from the generated `.env` file.
    *   Prunes dangling Docker images.

**Required GitHub Secrets for Deployment:**

*   `DEPLOY_HOST`: The hostname or identifier used by Cloudflare Tunnel for your server.
*   `DEPLOY_USERNAME`: The SSH username on the deployment server.
*   `DEPLOY_SSH_PRIVATE_KEY`: The private SSH key corresponding to the public key authorized on the deployment server for the `DEPLOY_USERNAME`.
*   `PROD_VITE_API_BASE_URL`: The public base URL for the API (e.g., `/api` if behind the Nginx proxy, or the full domain if needed).
*   `VAULT_ADDR`: The URL of your HashiCorp Vault instance (used *only* by the runner to contact Vault *if* the runner needs direct Vault access - current script fetches secrets *on the server*).

**Required Server Configuration:**

*   Docker and Docker Compose installed.
*   Git installed.
*   Cloudflare Tunnel configured for SSH access.
*   Vault AppRole Role ID and Secret ID files present at `/etc/vault/approle_role_id` and `/etc/vault/approle_secret_id` with appropriate permissions.
*   The `vault` CLI installed and available in the `PATH` for the `DEPLOY_USERNAME`.
*   Appropriate firewall rules (if any).

## 📂 Project Structure
.
├── .github/workflows/ # GitHub Actions CI/CD workflows
│ └── deploy.yml
├── backend/ # Node.js/Express backend
│ ├── controllers/ # Route handlers (business logic)
│ ├── middleware/ # Custom middleware (e.g., auth)
│ ├── models/ # (Optional) Data models/schemas
│ ├── routes/ # Express route definitions
│ ├── .env.example # Example environment variables
│ ├── app.js # Express app setup
│ ├── Dockerfile # Backend Docker build instructions
│ ├── firebase.js # Firebase Admin SDK initialization
│ └── package.json
├── frontend/ # React/Vite frontend
│ ├── public/ # Static assets served directly
│ ├── src/ # Frontend source code
│ │ ├── assets/ # Images, fonts, etc.
│ │ ├── components/ # Reusable UI components
│ │ ├── contexts/ # React contexts (e.g., AuthContext)
│ │ ├── pages/ # Page-level components
│ │ ├── services/ # API interaction (e.g., axios instance)
│ │ ├── App.jsx # Main application component with routing
│ │ ├── firebase.js # Firebase Client SDK initialization
│ │ └── main.jsx # Application entry point
│ ├── .env.example # Example environment variables
│ ├── Dockerfile # Frontend Docker build instructions (multi-stage)
│ ├── index.html # HTML entry point for Vite
│ ├── nginx.conf # Nginx configuration for serving frontend/proxying backend
│ ├── package.json
│ └── vite.config.js # Vite configuration
├── .gitignore # Files/directories to ignore in Git
├── docker-compose.yml # Docker Compose definition for services
└── README.md # This file