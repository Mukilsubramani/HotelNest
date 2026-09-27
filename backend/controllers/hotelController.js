// Hotel CRUD operations using native PostgreSQL queries
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/*
 * GET /api/hotels
 * Returns a paginated list of hotels with optional search and price filters
 */
const getAllHotels = async (req, res) => {
  try {
    const { title, minPrice, maxPrice } = req.query;
    const limit = parseInt(req.query.limit, 10) || 6;
    const offset = parseInt(req.query.offset, 10) || 0;

    // Build the WHERE clause dynamically based on which filters are provided
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Title search using case-insensitive ILIKE
    if (title && title.trim() !== '') {
      conditions.push(`title ILIKE $${paramIndex}`);
      values.push(`%${title.trim()}%`);
      paramIndex++;
    }

    // Minimum price filter
    if (minPrice && !isNaN(minPrice) && minPrice !== '') {
      conditions.push(`price >= $${paramIndex}`);
      values.push(parseFloat(minPrice));
      paramIndex++;
    }

    // Maximum price filter
    if (maxPrice && !isNaN(maxPrice) && maxPrice !== '') {
      conditions.push(`price <= $${paramIndex}`);
      values.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Build the full WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) AS total FROM hotels ${whereClause}`;
    const countResult = await db.query(countSql, values);
    const totalCount = parseInt(countResult.rows[0].total, 10);

    // Get the actual hotel records for this page
    const dataValues = [...values, limit, offset];
    const dataSql = `
      SELECT * FROM hotels 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await db.query(dataSql, dataValues);

    return res.status(200).json({
      success: true,
      hotels: dataResult.rows,
      totalCount: totalCount,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching hotels.',
      error: error.message,
    });
  }
};

/*
 * GET /api/hotels/:id
 * Returns a single hotel by ID
 */
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM hotels WHERE id = $1';
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found.',
      });
    }

    return res.status(200).json({
      success: true,
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching hotel by id:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching hotel details.',
      error: error.message,
    });
  }
};

/*
 * POST /api/hotels
 * Creates a new hotel with an image upload
 */
const createHotel = async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;

    // Field validations
    const errors = {};
    if (!title || title.trim() === '') errors.title = 'Title is required';
    if (!description || description.trim() === '') errors.description = 'Description is required';
    
    const latNum = parseFloat(latitude);
    if (latitude === undefined || latitude === '' || isNaN(latNum) || latNum < -90 || latNum > 90) {
      errors.latitude = 'Latitude must be a valid coordinate between -90 and 90';
    }

    const lngNum = parseFloat(longitude);
    if (longitude === undefined || longitude === '' || isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      errors.longitude = 'Longitude must be a valid coordinate between -180 and 180';
    }

    const priceNum = parseFloat(price);
    if (price === undefined || price === '' || isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (!req.file) {
      errors.image = 'Hotel image is required';
    }

    // Return validation errors if any fields are invalid
    if (Object.keys(errors).length > 0) {
      // If a file was uploaded but validation failed, clean up uploaded file
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({ success: false, errors });
    }

    // Relative web path for the image (e.g., /uploads/hotel-12345.jpg)
    const imagePath = `/uploads/${req.file.filename}`;

    // SQL INSERT
    const insertSql = `
      INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const insertValues = [title.trim(), description.trim(), imagePath, latNum, lngNum, priceNum];

    const result = await db.query(insertSql, insertValues);

    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully!',
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while creating hotel.',
      error: error.message,
    });
  }
};

/*
 * PUT /api/hotels/:id
 * Updates an existing hotel and replaces the image if a new one is uploaded
 */
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    // Check if hotel exists first
    const existing = await db.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const currentHotel = existing.rows[0];

    // Field validations
    const errors = {};
    if (!title || title.trim() === '') errors.title = 'Title is required';
    if (!description || description.trim() === '') errors.description = 'Description is required';

    const latNum = parseFloat(latitude);
    if (latitude === undefined || latitude === '' || isNaN(latNum) || latNum < -90 || latNum > 90) {
      errors.latitude = 'Latitude must be a valid coordinate between -90 and 90';
    }

    const lngNum = parseFloat(longitude);
    if (longitude === undefined || longitude === '' || isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      errors.longitude = 'Longitude must be a valid coordinate between -180 and 180';
    }

    const priceNum = parseFloat(price);
    if (price === undefined || price === '' || isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({ success: false, errors });
    }

    // Use the new image if uploaded, otherwise keep the existing one
    let imagePath = currentHotel.image_path;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;

      // If old image exists on server and is an uploaded user file (not default seed SVG), delete it
      if (currentHotel.image_path && currentHotel.image_path.startsWith('/uploads/')) {
        const oldFilename = path.basename(currentHotel.image_path);
        const seedFiles = ['hotel-grand-palace.svg', 'hotel-mountain-resort.svg', 'hotel-city-boutique.svg', 'hotel-sunset-villa.svg'];
        if (!seedFiles.includes(oldFilename)) {
          const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
          if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error('Error removing old image:', err);
            });
          }
        }
      }
    }

    // SQL UPDATE
    const updateSql = `
      UPDATE hotels
      SET title = $1, description = $2, image_path = $3, latitude = $4, longitude = $5, price = $6
      WHERE id = $7
      RETURNING *
    `;
    const updateValues = [title.trim(), description.trim(), imagePath, latNum, lngNum, priceNum, id];

    const result = await db.query(updateSql, updateValues);

    return res.status(200).json({
      success: true,
      message: 'Hotel updated successfully!',
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while updating hotel.',
      error: error.message,
    });
  }
};

/*
 * DELETE /api/hotels/:id
 * Deletes the hotel and removes its image file from disk
 */
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the hotel first to get its image path
    const checkSql = 'SELECT * FROM hotels WHERE id = $1';
    const checkResult = await db.query(checkSql, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found.',
      });
    }

    const hotel = checkResult.rows[0];

    // SQL DELETE
    const deleteSql = 'DELETE FROM hotels WHERE id = $1';
    await db.query(deleteSql, [id]);

    // Also remove the image file from disk (but skip the default seed images)
    if (hotel.image_path && hotel.image_path.startsWith('/uploads/')) {
      const filename = path.basename(hotel.image_path);
      const seedFiles = ['hotel-grand-palace.svg', 'hotel-mountain-resort.svg', 'hotel-city-boutique.svg', 'hotel-sunset-villa.svg'];
      if (!seedFiles.includes(filename)) {
        const filePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error removing hotel image file:', err);
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting hotel.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
