--$itemID, $tagName

INSERT INTO ItemTag (itemID, tagID)
SELECT $itemID, Tag.id
FROM Tag
where Tag.name = $tagName;