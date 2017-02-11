
-- TODO -add cascades to remove dependents on deletion of Item/User/Tag


CREATE TABLE ItemType (
	id TINYINT PRIMARY KEY,
	name NVARCHAR(128) NOT NULL
);


CREATE TABLE User(
	id INT8 PRIMARY KEY,
	name NVARCHAR(255) NOT NULL,
	email NVARCHAR(255) NOT NULL,
	dateJoined DATETIME NOT NULL,
	lastActive DATETIME NOT NULL
);

-- TODO - add constraint to force item data population dependent on type
CREATE TABLE Item (
	id INT8 PRIMARY KEY,
	ownerID INT8 NOT NULL,
	positionX INT8 NOT NULL,
	positionY INT8 NOT NULL,
	name NVARCHAR(128) NOT NULL,
	caption NVARCHAR(1000),
	fileURL NVARCHAR(1000) NOT NULL,
	dateCreated DATETIME NOT NULL,
	generationNo INT NOT NULL,
	typeID TINYINT NOT NULL,
	image_Width INT,
	image_Height INT,
	sound_Length INT,
	CONSTRAINT fk_Item_ownerID  FOREIGN KEY (ownerID)
								REFERENCES User(id),
	CONSTRAINT fk_Item_typeID  FOREIGN KEY (typeID)
								REFERENCES ItemType(id)
);


CREATE TABLE Tag (
	id INT8 PRIMARY KEY,
	name NVARCHAR(255) NOT NULL,
	description NVARCHAR(255)
);



CREATE TABLE ItemParent (
	itemID INT8 NOT NULL,
	parentID INT8 NOT NULL,
	CONSTRAINT fk_ItemParent_item  FOREIGN KEY (itemID)
									REFERENCES Item(id),	
	CONSTRAINT fk_ItemParent_parent  FOREIGN KEY (parentID)
									REFERENCES Item(id),
	PRIMARY KEY (itemID, parentID)
);


CREATE TABLE ItemTag (
	itemID INT8 NOT NULL,
	tagID INT8 NOT NULL,
	PRIMARY KEY (itemID, tagID),
	CONSTRAINT fk_ItemTag_item  FOREIGN KEY (itemID)
									REFERENCES Item(id),	
	CONSTRAINT fk_ItemTag_tag  FOREIGN KEY (tagID)
									REFERENCES Tag(id)
);

CREATE TABLE UserLike (
	userID INT8 NOT NULL,
	itemID INT8 NOT NULL,
	added_dttm datetime NOT NULL,
	removed_dttm DATETIME NULL,
	isRemoved BOOLEAN NOT NULL,
	PRIMARY KEY (userID, itemID),
	CONSTRAINT fk_UserLike_user  FOREIGN KEY (userID)
									REFERENCES User(id),	
	CONSTRAINT fk_UserLike_item  FOREIGN KEY (itemID)
									REFERENCES Item(id)
);


CREATE TABLE UserFollow (
	followerID INT8 NOT NULL,
	followedID INT8 NOT NULL,
	added_dttm datetime NOT NULL,
	removed_dttm DATETIME NULL,
	isRemoved BOOLEAN NOT NULL,
	PRIMARY KEY (followerID, followedID),
	CONSTRAINT fk_UserFollow_follower  FOREIGN KEY (followerID)
									REFERENCES User(id),	
	CONSTRAINT fk_UserFollow_followed  FOREIGN KEY (followedID)
									REFERENCES User(id)
);



CREATE TABLE ItemRelation (
	id INT8 PRIMARY KEY,
	itemA_id INT8 NOT NULL,
	itemB_id INT8 NOT NULL,
	added_dttm datetime NOT NULL,
	removed_dttm DATETIME NULL,
	isRemoved BOOLEAN NOT NULL,
	CONSTRAINT u_itemRelation UNIQUE (itemA_id, itemB_id),
	CONSTRAINT fk_ItemRelation_itemA  FOREIGN KEY (itemA_id)
									REFERENCES Item(id),	
	CONSTRAINT fk_ItemRelation_itemB  FOREIGN KEY (itemB_id)
									REFERENCES Item(id)
);


CREATE TABLE RelationTag (
	RelationID INT8 NOT NULL,
	tagID INT8 NOT NULL,
	added_dttm datetime NOT NULL,
	removed_dttm DATETIME NULL,
	isRemoved BOOLEAN NOT NULL,
	PRIMARY KEY (RelationID, tagID),
	CONSTRAINT fk_RelationTag_relation  FOREIGN KEY (RelationID)
									REFERENCES ItemRelation(id),	
	CONSTRAINT fk_RelationTag_tag  FOREIGN KEY (tagID)
									REFERENCES Tag(id)
);


