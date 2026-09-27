// Express server entry point
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./config/db');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow cross-origin requests from the React frontend
app.use(cors());

// Parse JSON and form data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the hotel images from the uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is up and running' });
});

// Hotel routes
app.use('/api/hotels', hotelRoutes);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Seed some sample hotels when the database is empty on first run
async function seedInitialHotelsIfEmpty() {
  try {
    const check = await db.query('SELECT COUNT(*) FROM hotels');
    const count = parseInt(check.rows[0].count, 10);

    if (count === 0) {
      console.log('Seeding sample hotels...');

      // Create placeholder SVG image files if they don't exist yet
      const sampleImages = [
        {
          name: 'hotel-grand-palace.svg',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#1e293b"/><text x="50%" y="45%" fill="#38bdf8" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">Grand Palace Hotel</text><text x="50%" y="60%" fill="#94a3b8" font-size="16" font-family="sans-serif" text-anchor="middle">Luxury Suites &amp; Oceanside Views</text></svg>`,
        },
        {
          name: 'hotel-mountain-resort.svg',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="45%" fill="#34d399" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">Mountain Whisper Resort</text><text x="50%" y="60%" fill="#94a3b8" font-size="16" font-family="sans-serif" text-anchor="middle">Serene Pine Valleys &amp; Alpine Spa</text></svg>`,
        },
        {
          name: 'hotel-city-boutique.svg',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#262626"/><text x="50%" y="45%" fill="#fbbf24" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">Metropolis Boutique Hotel</text><text x="50%" y="60%" fill="#a3a3a3" font-size="16" font-family="sans-serif" text-anchor="middle">Downtown Hub with Rooftop Lounge</text></svg>`,
        },
        {
          name: 'hotel-sunset-villa.svg',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#31102b"/><text x="50%" y="45%" fill="#f43f5e" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">Sunset Bay Haven</text><text x="50%" y="60%" fill="#fda4af" font-size="16" font-family="sans-serif" text-anchor="middle">Private Beachfront &amp; Infinity Pool</text></svg>`,
        },
      ];

      for (const img of sampleImages) {
        const filePath = path.join(uploadsPath, img.name);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, img.svg, 'utf8');
        }
      }

      const seedData = [
        [
          'The Grand Palace Hotel',
          'Experience five-star luxury with panoramic seaside views, fine dining restaurants, infinity swimming pool, and round-the-clock concierge services.',
          '/uploads/hotel-grand-palace.svg',
          13.0827,
          80.2707,
          250.0,
        ],
        [
          'Mountain Whisper Resort',
          'Nestled among tranquil pine hills, this cozy resort offers scenic mountain hiking trails, fireplace suites, warm breakfast, and spa treatments.',
          '/uploads/hotel-mountain-resort.svg',
          11.4102,
          76.695,
          140.0,
        ],
        [
          'Metropolis Boutique Hotel',
          'A sleek and stylish urban sanctuary located right in the city center. Walk to shopping centers, art galleries, and enjoy our signature rooftop café.',
          '/uploads/hotel-city-boutique.svg',
          12.9716,
          77.5946,
          180.0,
        ],
        [
          'Sunset Bay Beachfront Villa',
          'Unwind in private beachfront villas with direct ocean access, sunset sailing tours, complimentary cocktails, and tropical garden terraces.',
          '/uploads/hotel-sunset-villa.svg',
          15.2993,
          74.124,
          320.0,
        ],
      ];

      for (const item of seedData) {
        await db.query(
          `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          item
        );
      }
      console.log('Sample hotels added.');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await db.getPool();
  await seedInitialHotelsIfEmpty();
});
