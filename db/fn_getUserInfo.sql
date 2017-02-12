SELECT id, name, email, dateJoined, dateDisabled 
FROM User
WHERE name = ?
LIMIT 1;