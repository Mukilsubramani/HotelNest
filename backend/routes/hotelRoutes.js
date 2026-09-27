// Routes for Hotel CRUD endpoints
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const upload = require('../middleware/upload');

// GET /api/hotels - Get paginated & filtered hotels
router.get('/', hotelController.getAllHotels);

// GET /api/hotels/:id - Get single hotel details
router.get('/:id', hotelController.getHotelById);

// POST /api/hotels - Create new hotel with image upload
router.post('/', upload.single('image'), hotelController.createHotel);

// PUT /api/hotels/:id - Update hotel with optional image upload
router.put('/:id', upload.single('image'), hotelController.updateHotel);

// DELETE /api/hotels/:id - Delete hotel and clean up image
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
