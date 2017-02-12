select Item.* 
from Item 
Inner join User
On Item.ownerID = User.id
where User.id = ?
ORDER BY dateCreated desc; 