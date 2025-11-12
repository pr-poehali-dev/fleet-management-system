-- Добавляем тестовых пользователей (пароль для обоих: admin)
INSERT INTO users (username, password_hash, role, full_name) VALUES 
('dispatcher', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'dispatcher', 'Иванов Иван Иванович'),
('driver1', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'driver', 'Петров Пётр Петрович')
ON CONFLICT (username) DO NOTHING;