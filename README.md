# 🏫 School Management API

A production-ready **Node.js / Express.js** REST API for managing schools, featuring proximity-based sorting via the **Haversine formula** and interactive **Swagger UI** documentation.

---

## 🌐 Live Links & Deliverables

* **Live API Base URL:** `https://school-management-it4o.onrender.com` 
* **Interactive API Docs:** `https://school-management-it4o.onrender.com/api-docs/` 
* **Postman Collection:** [Click here to view/download the Postman Collection](./School API.postman_collection.json) 

---

## 📁 Project Structure

```
school-management/
├── src/
│   ├── app.js                        # Entry point & Express setup
│   ├── config/
│   │   ├── database.js               # MySQL pool + auto-initialisation
│   │   └── swagger.js                # OpenAPI 3.0 spec config
│   ├── controllers/
│   │   └── schoolController.js       # Business logic
│   ├── middlewares/
│   │   └── validation.js             # Input validators
│   ├── routes/
│   │   └── schoolRoutes.js           # Route definitions + Swagger JSDoc
│   └── utils/
│       └── haversine.js              # Great-circle distance helper
├── database_setup.sql                # Manual DB bootstrap script
├── .env.example                      # Environment variable template
└── package.json
```

---

## ⚙️ Prerequisites

| Tool    | Minimum version                  |
|---------|-------------------------------   |
| Node.js | 18 LTS                           |
| MySQL   | 8.0 (Local or Cloud provider like Aiven)                                       |
| npm     | 9                                |

---

## 🚀 Getting Started

### 1 — Clone & install dependencies

```bash
git clone <repo-url>
cd school-management
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=school_management
```

### 3 — Start the server

```bash
# Production
npm start

# Development (auto-restart on file change)
npm run dev
```

The server auto-creates the database and `schools` table on first start.

**Alternatively**, run the SQL script manually:

```bash
mysql -u root -p < database_setup.sql
```

---

## 📖 API Reference

Interactive docs are available at **`http://localhost:3000/api-docs`** once the server is running.

---

### `POST /addSchool`

Adds a new school to the database.

**Request body (JSON):**

| Field     | Type   | Required | Constraints            |
|-----------|--------|----------|------------------------|
| name      | string | ✅       | 1–255 characters       |
| address   | string | ✅       | 1–500 characters       |
| latitude  | float  | ✅       | −90 to 90              |
| longitude | float  | ✅       | −180 to 180            |

**Example request:**

```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name":      "Delhi Public School",
    "address":   "15 Park Avenue, New Delhi, India",
    "latitude":  28.6139,
    "longitude": 77.2090
  }'
```

**201 response:**

```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "school": {
      "id": 1,
      "name": "Delhi Public School",
      "address": "15 Park Avenue, New Delhi, India",
      "latitude": 28.6139,
      "longitude": 77.209,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### `GET /listSchools`

Returns all schools sorted by distance from the supplied coordinates (closest first).

**Query parameters:**

| Parameter | Type  | Required | Constraints |
|-----------|-------|----------|-------------|
| latitude  | float | ✅       | −90 to 90   |
| longitude | float | ✅       | −180 to 180 |

**Example request:**

```bash
curl "http://localhost:3000/listSchools?latitude=28.7041&longitude=77.1025"
```

**200 response:**

```json
{
  "success": true,
  "message": "Schools retrieved and sorted by proximity.",
  "data": {
    "total": 2,
    "user_location": { "latitude": 28.7041, "longitude": 77.1025 },
    "schools": [
      {
        "id": 3,
        "name": "Springdales School",
        "address": "Pusa Road, New Delhi, India",
        "latitude": 28.639,
        "longitude": 77.178,
        "created_at": "...",
        "updated_at": "...",
        "distance_km": 8.23
      },
      {
        "id": 1,
        "name": "Delhi Public School",
        "address": "15 Park Avenue, New Delhi, India",
        "latitude": 28.6139,
        "longitude": 77.209,
        "created_at": "...",
        "updated_at": "...",
        "distance_km": 12.47
      }
    ]
  }
}
```

---

## 🧮 Distance Calculation

Distance is calculated with the **Haversine formula**, which accounts for the curvature of the Earth and returns the shortest great-circle path between two coordinates. Results are in **kilometres**, rounded to 2 decimal places.

---

## 🛡️ Validation Rules

| Field     | Rule                                              |
|-----------|---------------------------------------------------|
| name      | Non-empty string, max 255 chars                   |
| address   | Non-empty string, max 500 chars                   |
| latitude  | Numeric, between −90 and 90                       |
| longitude | Numeric, between −180 and 180                     |

Invalid requests return HTTP **400** with an `errors` array describing each problem.

---

## 📌 Endpoints Summary

| Method | Endpoint       | Description                          |
|--------|----------------|--------------------------------------|
| POST   | `/addSchool`   | Add a new school                     |
| GET    | `/listSchools` | List schools sorted by proximity     |
| GET    | `/health`      | Server health check                  |
| GET    | `/api-docs`    | Swagger UI                           |
| GET    | `/api-docs.json` | Raw OpenAPI JSON spec              |


---

## 🔮 Future Enhancements

While this API is production-ready for standard workloads, scaling it to millions of records would require a few architectural shifts:

1. **SQL-Level Haversine Calculation:** Currently, the `listSchools` endpoint fetches all records into Node.js memory to calculate distances and sort. For massive datasets, this logic should be shifted directly into the MySQL `SELECT` query to leverage the database engine's native $O(N \log N)$ sorting routines and reduce network overhead.
2. **Authentication:** Implementing JWT-based authentication for the `POST /addSchool` endpoint to ensure only authorized administrators can mutate the database.
3. **Spatial Indexing:** Replacing the standard `FLOAT` columns with MySQL's native `POINT` spatial data types and adding a Spatial Index (SPATIAL KEY) for lightning-fast radius searches.
