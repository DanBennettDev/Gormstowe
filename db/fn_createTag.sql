

INSERT INTO Tag (name, description)
SELECT $name, $description
WHERE NOT EXISTS(SELECT 1 FROM Tag WHERE name = $name);
