-- ============================================================
--  School Management — Database Setup Script
--  Run: mysql -u root -p < database_setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255)  NOT NULL,
  address    VARCHAR(500)  NOT NULL,
  latitude   FLOAT         NOT NULL,
  longitude  FLOAT         NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_coordinates (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sample data ─────────────────────────────────────────────
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Delhi Public School',         '15 Park Avenue, New Delhi, India',          28.6139, 77.2090),
  ('Kendriya Vidyalaya No. 1',    'Sector 8, Dwarka, New Delhi, India',        28.5921, 77.0460),
  ('Springdales School',          'Pusa Road, New Delhi, India',               28.6390, 77.1780),
  ('The Mother''s International', 'Sri Aurobindo Marg, New Delhi, India',      28.5355, 77.2090),
  ('Vasant Valley School',        'Vasant Kunj, New Delhi, India',             28.5245, 77.1587);
