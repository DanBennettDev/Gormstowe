select Tag.* 
from Tag 
INNER JOIN ItemTag
on Tag.id = ItemTag.tagID
INNER JOIN Item
on Item.id = ItemTag.ItemID
where Item.id = ?
ORDER BY Tag.name asc;