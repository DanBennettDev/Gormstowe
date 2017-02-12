select Item.* 
from Item 
Inner join User
On Item.ownerID = User.id
where User.name = ?
ORDER BY dateCreated desc; 