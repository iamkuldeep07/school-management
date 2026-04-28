import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      version: '1.0.0',
      description:
        'REST API for managing schools with proximity-based sorting using the Haversine formula.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `https://school-management-it4o.onrender.com`,
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        School: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated school ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Name of the school',
              example: 'Delhi Public School',
            },
            address: {
              type: 'string',
              description: 'Full address of the school',
              example: '15 Park Avenue, New Delhi, India',
            },
            latitude: {
              type: 'number',
              format: 'float',
              description: 'Latitude coordinate',
              example: 28.6139,
            },
            longitude: {
              type: 'number',
              format: 'float',
              description: 'Longitude coordinate',
              example: 77.209,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Record last-update timestamp',
            },
          },
        },
        SchoolWithDistance: {
          allOf: [
            { $ref: '#/components/schemas/School' },
            {
              type: 'object',
              properties: {
                distance_km: {
                  type: 'number',
                  format: 'float',
                  description: 'Distance from user location in kilometres',
                  example: 3.42,
                },
              },
            },
          ],
        },
        AddSchoolRequest: {
          type: 'object',
          required: ['name', 'address', 'latitude', 'longitude'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Name of the school',
              example: 'Delhi Public School',
            },
            address: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Full address of the school',
              example: '15 Park Avenue, New Delhi, India',
            },
            latitude: {
              type: 'number',
              minimum: -90,
              maximum: 90,
              description: 'Latitude (-90 to 90)',
              example: 28.6139,
            },
            longitude: {
              type: 'number',
              minimum: -180,
              maximum: 180,
              description: 'Longitude (-180 to 180)',
              example: 77.209,
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
