# 🏨 Hotel List Page — Full-Stack CRUD Web Application

> **Final-Year Student Project**  
> A clean, beginner-friendly full-stack web application designed for exploring, searching, filtering, and managing hotel listings with native PostgreSQL queries, file upload storage, and map location embeds.

---

## 🌟 Tech Stack

- **Frontend:**
  - **ReactJS (Vite)** + **Redux Toolkit** (`@reduxjs/toolkit`, `react-redux`)
  - **React Router DOM** (Single Page Application architecture)
  - **React Helmet Async** (Dynamic per-page SEO titles & meta descriptions)
  - **Plain CSS** (Custom responsive CSS Grid & Flexbox, no Tailwind or Material UI)
- **Backend:**
  - **Node.js** + **Express.js**
  - **PostgreSQL** using native SQL queries via the **`pg`** package (Pool) — *Zero ORM (no Sequelize/Prisma)*
  - **Multer** for handling local image file uploads (`/uploads` directory)
  - **CORS** & **Dotenv** for configuration
- **Maps & Geolocation:**
  - **OpenStreetMap** interactive embedded iframe map based on stored latitude and longitude (zero API keys needed)
  - **Browser Geolocation API** (`navigator.geolocation`) for autofilling coordinates and calculating real-time distance from user location.

---

## 📁 Project Folder Structure

```text
Namlatic Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL Pool connection & fallback runner
│   ├── controllers/
│   │   └── hotelController.js    # CRUD logic with native SQL queries
│   ├── db/
│   │   ├── schema.sql            # Table schema creation script
│   │   └── initDb.js             # Node runner for DB initialization
│   ├── middleware/
│   │   └── upload.js             # Multer image upload configuration
│   ├── routes/
│   │   └── hotelRoutes.js        # Express routes (/api/hotels)
│   ├── uploads/                  # Local storage for uploaded hotel images
│   ├── .env                      # Database credentials & port
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Server entry point
│
├── frontend/
│   ├── public/
│   │   └── placeholder-hotel.svg # Default image fallback
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelCard.jsx     # Responsive card with image, price, snippet
│   │   │   ├── HotelForm.jsx     # Reusable Add & Edit Form with live preview
│   │   │   ├── HotelList.jsx     # Grid layout container for hotel cards
│   │   │   ├── Navbar.jsx        # Top navigation header
│   │   │   ├── Pagination.jsx    # Backend offset/limit driven page buttons
│   │   │   ├── SearchFilterBar.jsx # Title search and price range inputs
│   │   │   └── Toast.jsx         # Success popup ("Hotel deleted successfully")
│   │   ├── pages/
│   │   │   ├── AddHotelPage.jsx  # Add hotel page
│   │   │   ├── EditHotelPage.jsx # Edit hotel page
│   │   │   ├── HotelDetail.jsx   # Detailed view + OpenStreetMap + SEO Helmet
│   │   │   └── HotelListPage.jsx # Main list view
│   │   ├── redux/
│   │   │   ├── hotelSlice.js     # Redux Toolkit state, thunks, and reducers
│   │   │   └── store.js          # Redux Store
│   │   ├── services/
│   │   │   └── api.js            # API fetch service
│   │   ├── App.css               # Clean custom responsive CSS
│   │   ├── App.jsx               # React Router configuration
│   │   ├── index.css             # Base reset & typography
│   │   └── main.jsx              # App entry point
│   ├── index.html                # Semantic HTML5 template
│   ├── package.json              # Frontend dependencies & scripts
│   └── vite.config.js            # Vite config with backend proxy
│
└── README.md                     # Project documentation & setup guide
```

---

## 🗄️ Database Schema (`hotels` table)

Created in PostgreSQL using native SQL:

```sql
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_path VARCHAR(500),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Setup & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer installed)
- [PostgreSQL](https://www.postgresql.org/download/) (Optional: if not installed, an automated in-memory PostgreSQL fallback activates seamlessly so the project runs out of the box for immediate demonstration).

---

### Step 1: Backend Setup

1. Open your terminal and navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database in `.env`:
   ```env
   PORT=5000
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=hotel_db
   PGPORT=5432
   ```
4. *(If PostgreSQL is installed)* Create the database and table:
   ```bash
   npm run init-db
   ```
5. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The server starts on `http://localhost:5000` and automatically seeds 4 sample hotels on first run.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The React application opens on `http://localhost:3000` (or `http://localhost:5173`).*

---

## 🔌 API Endpoints Reference

All endpoints are built using **native SQL queries**:

| Method | Endpoint | Description | SQL Used |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/hotels` | Get filtered & paginated hotels | `SELECT ... WHERE title ILIKE $1 AND price >= $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4` |
| **GET** | `/api/hotels/:id` | Get single hotel details | `SELECT * FROM hotels WHERE id = $1` |
| **POST** | `/api/hotels` | Add new hotel with image | `INSERT INTO hotels (...) VALUES (...) RETURNING *` |
| **PUT** | `/api/hotels/:id` | Update hotel by ID (updates file) | `UPDATE hotels SET ... WHERE id = $7 RETURNING *` |
| **DELETE** | `/api/hotels/:id` | Delete hotel & unlinks image file | `DELETE FROM hotels WHERE id = $1` |

---

## ✨ Features Implemented

1. **Hotel List Page:**
   - Displayed as **Cards in a responsive Grid** (flexbox/grid, not a table).
   - Card displays: photo, title, price badge, location coordinates, and truncated description snippet.
   - **Search Bar:** searches hotels dynamically by title (`ILIKE`).
   - **Filter Bar:** min price & max price range filter.
   - **Backend Pagination:** offset and limit buttons (`Page 1, 2, ... Prev/Next`).
   - **Delete Popup Toast:** deletes hotel and displays `"Hotel deleted successfully"`.

2. **Add & Edit Hotel Form:**
   - **Single Reusable Component (`HotelForm.jsx`)** for both creation and editing.
   - **Live Image Preview** before form submission (`URL.createObjectURL`).
   - Clear validation error messages displayed directly beneath each input field.
   - **Autofill Coordinates Button** using browser Geolocation API (`navigator.geolocation`).
   - Replaces old image file on the server when a new image is uploaded in edit mode.
   - Redirects to hotel list page on success.

3. **Hotel Detail Page:**
   - Displays full-resolution image, title, price, description, and coordinates.
   - **Embedded Interactive Map:** OpenStreetMap iframe with exact pin marker.
   - **Distance Calculator:** Uses browser Geolocation to calculate distance in kilometers between your current location and the hotel.
   - **SEO:** Dynamic `<title>` and `<meta name="description">` using `react-helmet-async`.
   - Every `<img>` tag includes meaningful `alt` attributes.

---

## 🎓 College Viva & Presentation Tips

- **Why native SQL instead of an ORM?**  
  *Demonstrates foundational understanding of relational database design, SQL syntax (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `LIKE`, `OFFSET/LIMIT`), SQL parameters to prevent SQL injection, and connection pooling.*
- **How is image storage managed?**  
  *Images are uploaded using `multer` to the server's local `/uploads` folder. The database only stores the lightweight relative path string (e.g. `/uploads/hotel-123.jpg`), which prevents database bloat and ensures fast queries.*
- **How is pagination implemented?**  
  *Pagination is backend-driven using SQL `LIMIT` and `OFFSET`. The total count is calculated via `COUNT(*)` so page numbers reflect real database records.*
- **State Management:**  
  *Redux Toolkit centralizes the asynchronous API calls (thunks), filter state, pagination page, and global toast notifications.*
