SELECT 	User.name as owner,
		User.id as ownerID,
		Item.positionX,
		Item.positionY,
		Item.id as itemID,
		Item.name as itemName,
		Item.captionText as caption,
		Item.fileURL as URL,
		Item.dateCreated as dateCreated,
		Item.generationNo as generationNo,
		ItemType.name as itemType,
		FunctionType.name as itemFunction,
		Item.image_Width,
		Item.image_Height,
		Item.sound_Length
FROM 	Item
INNER JOIN User on Item.ownerID = User.id
INNER JOIN ItemType on Item.typeID = ItemType.id
INNER JOIN FunctionType on Item.functionTypeID = FunctionType.id
WHERE 	Item.positionX > $fromX
AND 	Item.positionX <= $toX 
AND		Item.positionY > $fromY
AND 	Item.positionY <= $toY
;