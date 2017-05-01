
-- $ownerID, $positionX, $positionY, $name, $captionText, $fileURL, 
-- $type, $functionType, $image_Width, $image_Height, $sound_Length

INSERT INTO Item 
(	ownerID, 
	positionX, 
	positionY, 
	name, 
	captionText, 
	fileURL, 
	dateCreated, 
	generationNo,
	typeID,
	functionTypeID,
	image_Width, 
	image_Height,
	sound_Length
	)

SELECT $ownerID, $positionX, $positionY, $name,
		$captionText, $fileURL, datetime(), 0,
		ityp.id, ftyp.ID, $image_Width, $image_Height,
		$sound_Length 
FROM  	ItemType ityp, FunctionType ftyp
where 	ityp.name = $type
and 	ftyp.name = $functionType;