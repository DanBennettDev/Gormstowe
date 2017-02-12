SELECT id, name, email, dateJoined, dateDisabled 
FROM User
WHERE id = ?
LIMIT 1;