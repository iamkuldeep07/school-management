/**
 * Validates the request body for the Add School endpoint.
 */
const validateAddSchool = (req, res, next) => {
  const errors = [];
  const { name, address, latitude, longitude } = req.body;

  // name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string.');
  } else if (name.trim().length > 255) {
    errors.push('name must not exceed 255 characters.');
  }

  // address
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.push('address is required and must be a non-empty string.');
  } else if (address.trim().length > 500) {
    errors.push('address must not exceed 500 characters.');
  }

  // latitude
  const lat = parseFloat(latitude);
  if (latitude === undefined || latitude === null || latitude === '') {
    errors.push('latitude is required.');
  } else if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('latitude must be a number between -90 and 90.');
  }

  // longitude
  const lon = parseFloat(longitude);
  if (longitude === undefined || longitude === null || longitude === '') {
    errors.push('longitude is required.');
  } else if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push('longitude must be a number between -180 and 180.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  // Normalise types for downstream use
  req.body.name      = name.trim();
  req.body.address   = address.trim();
  req.body.latitude  = lat;
  req.body.longitude = lon;

  next();
};

/**
 * Validates query parameters for the List Schools endpoint.
 */
const validateListSchools = (req, res, next) => {
  const errors = [];
  const { latitude, longitude } = req.query;

  const lat = parseFloat(latitude);
  if (latitude === undefined || latitude === '') {
    errors.push('latitude query parameter is required.');
  } else if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('latitude must be a number between -90 and 90.');
  }

  const lon = parseFloat(longitude);
  if (longitude === undefined || longitude === '') {
    errors.push('longitude query parameter is required.');
  } else if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push('longitude must be a number between -180 and 180.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  req.query.latitude  = lat;
  req.query.longitude = lon;

  next();
};

export { validateAddSchool, validateListSchools };
