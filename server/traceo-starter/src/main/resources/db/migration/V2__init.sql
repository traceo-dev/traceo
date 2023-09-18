INSERT INTO traceo_user (id, name, username, email, password, is_admin, is_password_updated, status)
SELECT 'c521de20-a20d-4252-817b-c5a3fc8fc305', 'admin', 'admin','admin@localhost','$2a$12$38qHtiEIJHY8GMfbJJ883.rsl2kEgecttaCriyUzntefKGpPBVXt2', true, false, 0
WHERE NOT EXISTS (SELECT 1 FROM traceo_user WHERE email = 'admin@localhost');
