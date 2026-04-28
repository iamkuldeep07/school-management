import { pool } from '../config/database.js';
import { haversineDistance } from '../utils/haversine.js';

/**
 * POST /addSchool
 * Adds a new school record to the database.
 */
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO schools (name, address, latitude, longitude)
       VALUES (?, ?, ?, ?)`,
      [name, address, latitude, longitude]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM schools WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully.',
      data: { school: rows[0] },
    });
  } catch (error) {
    console.error('addSchool error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while adding the school.',
      errors: [error.message],
    });
  }
};

/**
 * GET /listSchools
 * Fetches all schools sorted by proximity to the user's coordinates.
 */
const listSchools = async (req, res) => {
  const userLat = req.query.latitude;
  const userLon = req.query.longitude;

  try {
    const [schools] = await pool.execute(`SELECT * FROM schools`);

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found.',
        data: { total: 0, user_location: { latitude: userLat, longitude: userLon }, schools: [] },
      });
    }

    // Attach distance and sort ascending
    const schoolsWithDistance = schools
      .map((school) => ({
        ...school,
        distance_km: haversineDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: 'Schools retrieved and sorted by proximity.',
      data: {
        total: schoolsWithDistance.length,
        user_location: { latitude: userLat, longitude: userLon },
        schools: schoolsWithDistance,
      },
    });
  } catch (error) {
    console.error('listSchools error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching schools.',
      errors: [error.message],
    });
  }
};

export { addSchool, listSchools };
