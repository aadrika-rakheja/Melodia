<<<<<<< HEAD
# Melodia – Cloud Music & Smart Playlist Companion

Melodia is a cloud-based premium music streaming platform inspired by Spotify and SoundCloud. This repository contains the complete full-stack implementation, styled precisely according to the Stitch design specifications.

---

## Technology Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios
* **Backend:** Node.js, Express.js (MVC Architecture)
* **Database:** MongoDB Atlas / Local MongoDB
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing
* **Audio Engine:** HTML5 Audio API / Howler.js

---

## Folder Structure

```
melodia/
├── server/                 # Express REST API (Backend)
│   ├── config/             # DB & Admin configuration
│   ├── controllers/        # Route logic (Controllers)
│   ├── middleware/         # JWT Auth, Role checking & Error boundary
│   ├── models/             # Mongoose schemas (Models)
│   ├── routes/             # Route mappings (Routes)
│   ├── services/           # AI Recommendation preference service
│   ├── utils/              # Token generation helper
│   ├── .env                # Backend environmental configs
│   ├── server.js           # Express main entry point
│   └── seed.js             # DB Seeder script
├── src/                    # Vite React application (Frontend)
│   ├── api/                # Axios instance
│   ├── app/                # Redux store config
│   ├── components/         # Reusable layouts, player, and card components
│   ├── features/           # Redux state slices (RTK)
│   ├── pages/              # Landing, Explore, Library, Search & Admin views
│   ├── routes/             # Route Guards (ProtectedRoute)
│   ├── App.jsx             # Main Router binding
│   ├── index.css           # Global stylesheet & Tailwind base
│   └── main.jsx            # React root injection wrapper
├── tailwind.config.js      # Custom theme, colors & font sizes configurations
└── index.html              # Custom page head, Inter & Material icons linkage
```

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed globally (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection URI

### 1. Database Configuration
By default, the backend connects to `mongodb://localhost:27017/melodia`. 
If you want to use MongoDB Atlas, open `server/.env` and update the `MONGO_URI` variable:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/melodia
```

### 2. Install Dependencies
Open a terminal in the root workspace folder:

* **Install Frontend packages:**
  ```bash
  npm install
  ```

* **Install Backend packages:**
  ```bash
  cd server
  npm install
  ```

### 3. Seed initial songs
To load royalty-free test tracks into the database:
```bash
cd server
node seed.js
```

---

## Running the Application

To run the application locally, you will need two terminal tabs open (or run the servers in the background):

### Tab A: Start the Backend Server (Port 5000)
```bash
cd server
npm start
```
*(Alternatively, run `npm run dev` if you have nodemon installed globally).*

### Tab B: Start the Frontend Vite Server (Port 5173)
From the root project directory:
```bash
npm run dev
```

Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

---

## Creating an Admin Account
To access the **Admin Dashboard** (`/admin`) for uploading new songs:
1. Register a new account via the **Sign Up** page. 
2. The *very first* account registered in the database is automatically granted the `admin` role.
3. Once logged in as an admin, a link to the **Admin Panel** will appear at the bottom left of your sidebar.
4. You can use the form to enter track details (e.g. titles, artists, genres) along with audio URLs (from Firebase or royal-free static files).
=======
# Melodia
>>>>>>> 5c546d529ae100708f06543218fd4dd0ef7acb58
