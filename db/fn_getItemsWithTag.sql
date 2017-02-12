select Item.* 
from Tag 
INNER JOIN ItemTag
on Tag.id = ItemTag.tagID
INNER JOIN Item
on Item.id = ItemTag.ItemID
where Tag.id = ?
ORDER BY Item.name asc;