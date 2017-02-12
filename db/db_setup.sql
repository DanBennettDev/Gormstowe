
-- handle temp tables in memory
PRAGMA temp_store = 2;

---------------------------------
-- SETUP DATABASE TABLES
----------------------------------

DROP TABLE IF EXISTS RelationTag;
DROP TABLE IF EXISTS ItemRelation;
DROP TABLE IF EXISTS UserFollow;
DROP TABLE IF EXISTS UserLike;
DROP TABLE IF EXISTS ItemTag;
DROP TABLE IF EXISTS ItemParent;
DROP TABLE IF EXISTS Tag;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS FunctionType;
DROP TABLE IF EXISTS ItemType;



-- TODO -add cascades to remove dependents on deletion of Item User Tag
CREATE TABLE ItemType (
	id INTEGER PRIMARY KEY,
	name NVARCHAR(128) NOT NULL
);

CREATE TABLE FunctionType (
	id INTEGER PRIMARY KEY,
	name NVARCHAR(128) NOT NULL
);


CREATE TABLE User(
	id INTEGER PRIMARY KEY,
	name NVARCHAR(255) NOT NULL,
	email NVARCHAR(255) NOT NULL,
	pwrd NVARCHAR(30) NOT NULL,
	dateJoined DATETIME NOT NULL,
	dateDisabled DATETIME NULL,
	lastActive DATETIME NOT NULL,
	CONSTRAINT u_name UNIQUE (name)
);

-- TODO - add constraint to force item data population dependent on type
CREATE TABLE Item (
	id INTEGER PRIMARY KEY,
	ownerID INT8 NOT NULL,
	positionX INT8 NOT NULL,
	positionY INT8 NOT NULL,
	name NVARCHAR(128) NOT NULL,
	captionText NVARCHAR(4000),
	fileURL NVARCHAR(1000) NOT NULL,
	dateCreated DATETIME NOT NULL,
	generationNo INT NOT NULL,
	typeID TINYINT NOT NULL,
	image_Width INT,
	image_Height INT,
	sound_Length INT,
	functionTypeID TINYINT NOT NULL,
	CONSTRAINT fk_Item_ownerID  FOREIGN KEY (ownerID)
								REFERENCES User(id),
	CONSTRAINT fk_Item_typeID  FOREIGN KEY (typeID)
								REFERENCES ItemType(id)
	CONSTRAINT fk_Item_functionTypeID  FOREIGN KEY (functionTypeID)
								REFERENCES FunctionType(id)								
);


CREATE TABLE Tag (
	id INTEGER PRIMARY KEY,
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
	id INTEGER PRIMARY KEY,
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





---------------------------------
-- SETUP DATABASE TABLES
----------------------------------

-- ITEM TYPES
INSERT INTO ItemType (name) VALUES ('image');
INSERT INTO ItemType (name) VALUES ('sound');
INSERT INTO ItemType (name) VALUES ('text');

INSERT INTO FunctionType (name) VALUES ('object');
INSERT INTO FunctionType (name) VALUES ('field');

-- master user
INSERT INTO User (name, email, 	pwrd, dateJoined, dateDisabled, lastActive)
VALUES ('admin', 'pavementsands@gmail.com', 'bertie8', datetime(), NULL, datetime() );


