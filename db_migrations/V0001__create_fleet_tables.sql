-- Vehicles table (Транспортные средства)
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'idle',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vehicles_status_check CHECK (status IN ('active', 'maintenance', 'idle'))
);

-- Drivers table (Водители)
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    license VARCHAR(10) NOT NULL,
    vehicle_number VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT drivers_status_check CHECK (status IN ('available', 'on_route', 'off_duty'))
);

-- Requests table (Заявки)
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    from_address VARCHAR(500) NOT NULL,
    to_address VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT requests_status_check CHECK (status IN ('pending', 'approved', 'in_progress', 'completed')),
    CONSTRAINT requests_priority_check CHECK (priority IN ('low', 'medium', 'high'))
);

-- Routes table (Рейсы)
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL,
    driver_name VARCHAR(200) NOT NULL,
    distance_km INTEGER,
    fuel_liters INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT routes_status_check CHECK (status IN ('planned', 'active', 'completed'))
);

-- Insert sample data
INSERT INTO vehicles (number, model, status) VALUES
    ('А123БВ777', 'Mercedes Sprinter', 'active'),
    ('К456ЕР199', 'КАМАЗ 5320', 'maintenance'),
    ('Т789УС116', 'ГАЗель Next', 'active'),
    ('М321НО197', 'Iveco Daily', 'idle');

INSERT INTO drivers (name, license, vehicle_number, status) VALUES
    ('Иванов Иван Иванович', 'BC', 'А123БВ777', 'on_route'),
    ('Петров Петр Петрович', 'BCE', 'К456ЕР199', 'off_duty'),
    ('Сидоров Сергей Сергеевич', 'BC', 'Т789УС116', 'on_route'),
    ('Козлов Андрей Владимирович', 'BC', NULL, 'available');

INSERT INTO requests (date, from_address, to_address, status, priority) VALUES
    ('2025-11-11', 'Москва, Тверская 10', 'Тула, Ленина 5', 'approved', 'high'),
    ('2025-11-11', 'СПб, Невский 25', 'Москва, Садовая 12', 'in_progress', 'medium'),
    ('2025-11-12', 'Казань, Баумана 3', 'Н.Новгород, Горького 8', 'pending', 'low'),
    ('2025-11-12', 'Екатеринбург, Ленина 20', 'Челябинск, Труда 15', 'approved', 'high');

INSERT INTO routes (vehicle_number, driver_name, distance_km, fuel_liters, status) VALUES
    ('А123БВ777', 'Иванов И.И.', 342, 48, 'active'),
    ('Т789УС116', 'Сидоров С.С.', 125, 18, 'active'),
    ('М321НО197', 'Козлов А.В.', 280, 38, 'planned'),
    ('К456ЕР199', 'Петров П.П.', 520, 85, 'completed');