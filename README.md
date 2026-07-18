# VitaLink 🩸

### India's GPS-Powered Blood Donation Network

**VitaLink** is an advanced, real-time geolocation blood matching platform designed to connect blood donors, receivers, and hospitals instantly. It utilizes active GPS coordinates and NoSQL geospatial indexing to find the closest match during critical medical emergencies.

Developed and conceptualized independently as a self-project by **Shaik Asif**.

---

## 🚀 Features

- **Anonymous "Request Blood" Search**: Seekers in emergencies can search for donors and nearby hospitals directly from the home page without registering an account.
- **GPS-Based Matching**: Matches compatible blood groups within a 50KM radius and calculates live distances dynamically (e.g. `2.5 km away`).
- **Interactive Role Dashboards**:
  - **Donor Dashboard**: Toggle active availability status, update coordinates, and track donation counts.
  - **Hospital Dashboard**: Update active blood inventory, subscribe for active membership access, and recharge wallet balances (Free Prototype Mode).
  - **Receiver Dashboard**: Post blood requests, match automatically with local donors, and track donor distance in real-time.
  - **Admin Dashboard**: Manage accounts, view system stats, and monitor active donor location coordinates on maps.
- **Hero Rewards System**: Tracks donation metrics to award profile badges, level templates, and certificate templates.

---

## 🛠️ Technology Stack

### Frontend
- **React.js & TypeScript**: Type-safe component architecture.
- **Vite**: Rapid compilation and hot module reloading.
- **Tailwind CSS**: Custom utility designs with glassmorphism, responsive grids, and clean layout patterns.
- **React Router v6**: Single-page navigation with query-param routing hooks.

### Backend
- **Spring Boot 3.x**: Core Java business services and REST endpoints.
- **Spring Security (JWT)**: JSON Web Token encryption for profile dashboards.
- **Spring Data MongoDB**: Object-Document Mapper for MongoDB CRUD.

### Database
- **MongoDB**: NoSQL database storage with **2D-Sphere Geolocation Indexing** to process spatial requests.

---

## 📂 System Directory Structure

```text
├── frontend/                      # React Frontend Application
│   ├── src/                       # React source files (components, contexts, hooks, pages)
│   ├── public/                    # Static assets
│   ├── package.json               # NPM package configuration
│   └── vite.config.ts             # Vite configuration
├── backend/                       # Spring Boot Java Application
│   ├── src/main/java/com/vitallink/
│   │   ├── config/                # Security Config (CORS/JWT Filter)
│   │   ├── controller/            # REST API endpoints (Auth, Donors, Hospitals)
│   │   ├── model/                 # MongoDB Document Entities (User, Donor, Hospital)
│   │   └── repository/            # Spring Data Mongo Database Interfaces
│   ├── maven-portable/            # Maven binaries
│   └── run-backend.ps1            # Portable Maven startup script
├── database/                      # Local Database Configuration
│   ├── docker-compose.yml         # Starts MongoDB in Docker container
│   └── README.md                  # Database documentation
├── run-all.bat                    # Root orchestrator (starts database, backend, & frontend)
├── run-database.bat               # Starts/verifies local MongoDB
├── run-backend.bat                # Starts the Spring Boot backend
├── run-frontend.bat               # Starts the React frontend
├── vitallink_report.pdf           # Detailed system implementation PDF study report
└── README.md                      # Project documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Java JDK** (v17 or higher)
- **MongoDB** (Running locally on default port `27017` or through Docker Compose)

---

### Step 1: Clone and Prepare Workspace
```bash
git clone <git-url>
cd vitallink
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 🚀 How to Run the App (One-Click Run)

To launch the database, backend, and frontend concurrently in separate terminal windows, simply open your terminal in the root directory and run:

```bash
.\run-all.bat
```

This will automatically:
1. Verify if MongoDB is running locally on port `27017` (and start it via Docker Compose if it isn't running and Docker is available).
2. Start the Spring Boot backend on `http://localhost:8081`.
3. Start the React frontend on `http://localhost:8080`.

---

## 🛠️ Manual Run Commands

If you prefer to start the services in separate tabs manually, execute the following from the root directory:

#### Run Database
```bash
.\run-database.bat
```

#### Run Backend
```bash
.\run-backend.bat
```

#### Run Frontend
```bash
.\run-frontend.bat
```

---

## 📞 Developer Profile & Contact

Developed with passion by:

- **Shaik Asif** (BTech CSE Student)
- **Email:** asif118shaik@gmail.com
- **Idea & Concept:** Conceptualized independently to create a real-time GPS-powered helper directory in India during critical medical delays.
