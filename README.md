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
├── backend/                       # Spring Boot Java Application
│   ├── src/main/java/com/vitallink/
│   │   ├── config/                # Security Config (CORS/JWT Filter)
│   │   ├── controller/            # REST API endpoints (Auth, Donors, Hospitals)
│   │   ├── model/                 # MongoDB Document Entities (User, Donor, Hospital)
│   │   └── repository/            # Spring Data Mongo Database Interfaces
│   └── run-backend.ps1            # Portable Maven startup script
├── src/                           # Frontend React Source Code
│   ├── components/                # Reusable UI Blocks (Navigation, LocationService)
│   ├── context/                   # Auth & Session state provider
│   ├── pages/                     # Public routing views (Home, Donors, About, Receivers)
│   ├── services/                  # Axios service definitions connecting to port 8081
│   └── data/                      # Blood Group constants & baseline mock data
├── run-backend.bat                # Root script to run backend
├── vitallink_report.pdf           # Detailed system implementation PDF study report
└── README.md                      # Project documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Java JDK** (v17 or higher)
- **MongoDB** (Running locally on default port `27017`)

---

### Step 1: Clone and Prepare Workspace
```bash
git clone <git-url>
cd vitallink
```

### Step 2: Set Up MongoDB
Ensure your MongoDB service is running locally on port `27017`.
The app will automatically initialize and connect to the `vitalink` database on startup:
```bash
# Connect URL configured in backend:
mongodb://localhost:27017/vitalink
```

### Step 3: Run Spring Boot Backend
To run the backend, simply run the batch script in the root directory (which handles portable Maven initialization and starts the server on port `8081`):
```bash
# From root directory:
.\run-backend.bat
```

### Step 4: Run Vite Frontend
In a new terminal window, install npm packages and start the hot-reloading development server:
```bash
# From root directory:
npm install
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) (or the displayed Vite address) to view the portal.

---

## 📞 Developer Profile & Contact

Developed with passion by:

- **Shaik Asif** (BTech CSE Student)
- **Email:** asif118shaik@gmail.com
- **Idea & Concept:** Conceptualized independently to create a real-time GPS-powered helper directory in India during critical medical delays.
