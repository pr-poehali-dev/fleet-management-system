-- Расширяем таблицу vehicles: добавляем год, пробег, оборудование, подразделение
ALTER TABLE vehicles 
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS mileage_km INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS equipment TEXT,
  ADD COLUMN IF NOT EXISTS department VARCHAR(200);

-- Расширяем таблицу drivers: добавляем категорию прав, стаж, персональные данные
ALTER TABLE drivers
  ADD COLUMN IF NOT EXISTS license_category VARCHAR(10),
  ADD COLUMN IF NOT EXISTS experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS email VARCHAR(100);

-- Расширяем таблицу requests: добавляем тип груза/пассажиры, требуемый тип ТС, утверждение
ALTER TABLE requests
  ADD COLUMN IF NOT EXISTS cargo_type VARCHAR(200),
  ADD COLUMN IF NOT EXISTS cargo_weight_kg INTEGER,
  ADD COLUMN IF NOT EXISTS passengers_count INTEGER,
  ADD COLUMN IF NOT EXISTS required_vehicle_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS approved_by VARCHAR(200),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Расширяем таблицу routes: добавляем связь с заявкой, даты выполнения, путевой лист
ALTER TABLE routes
  ADD COLUMN IF NOT EXISTS request_id INTEGER REFERENCES requests(id),
  ADD COLUMN IF NOT EXISTS start_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS end_time TIMESTAMP,
  ADD COLUMN IF NOT EXISTS waybill_number VARCHAR(50);

-- Создаём таблицу пользователей для аутентификации
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'driver',
  full_name VARCHAR(200),
  driver_id INTEGER REFERENCES drivers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём таблицу путевых листов
CREATE TABLE IF NOT EXISTS waybills (
  id SERIAL PRIMARY KEY,
  waybill_number VARCHAR(50) UNIQUE NOT NULL,
  route_id INTEGER REFERENCES routes(id),
  vehicle_number VARCHAR(20) NOT NULL,
  driver_name VARCHAR(200) NOT NULL,
  issue_date DATE NOT NULL,
  mileage_start INTEGER,
  mileage_end INTEGER,
  fuel_start DECIMAL(10,2),
  fuel_end DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'issued',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём индексы для производительности
CREATE INDEX IF NOT EXISTS idx_routes_vehicle ON routes(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_routes_driver ON routes(driver_name);
CREATE INDEX IF NOT EXISTS idx_routes_request ON routes(request_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_waybills_number ON waybills(waybill_number);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);