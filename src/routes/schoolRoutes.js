import { Router } from 'express';
import { addSchool, listSchools } from '../controllers/schoolController.js';
import { validateAddSchool, validateListSchools } from '../middlewares/validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: School management endpoints
 */

/**
 * @swagger
 * /addSchool:
 *   post:
 *     summary: Add a new school
 *     description: >
 *       Validates input and inserts a new school record into the database.
 *       All four fields are required; latitude must be −90 to 90 and
 *       longitude must be −180 to 180.
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddSchoolRequest'
 *           examples:
 *             ValidSchool:
 *               summary: A valid school payload
 *               value:
 *                 name: "Delhi Public School"
 *                 address: "15 Park Avenue, New Delhi, India"
 *                 latitude: 28.6139
 *                 longitude: 77.2090
 *     responses:
 *       201:
 *         description: School created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         school:
 *                           $ref: '#/components/schemas/School'
 *       400:
 *         description: Validation error — missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Validation failed."
 *               errors:
 *                 - "name is required and must be a non-empty string."
 *                 - "latitude must be a number between -90 and 90."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/addSchool', validateAddSchool, addSchool);

/**
 * @swagger
 * /listSchools:
 *   get:
 *     summary: List all schools sorted by proximity
 *     description: >
 *       Retrieves every school from the database and returns them sorted
 *       by their Haversine distance from the supplied user coordinates
 *       (closest first). Each record includes a `distance_km` field.
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         description: User's latitude (−90 to 90)
 *         example: 28.7041
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         description: User's longitude (−180 to 180)
 *         example: 77.1025
 *     responses:
 *       200:
 *         description: Schools retrieved and sorted by proximity.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 3
 *                         user_location:
 *                           type: object
 *                           properties:
 *                             latitude:
 *                               type: number
 *                               example: 28.7041
 *                             longitude:
 *                               type: number
 *                               example: 77.1025
 *                         schools:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/SchoolWithDistance'
 *       400:
 *         description: Missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Validation failed."
 *               errors:
 *                 - "longitude query parameter is required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/listSchools', validateListSchools, listSchools);

export default router;
