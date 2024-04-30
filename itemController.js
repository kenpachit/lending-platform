npm install node-cache
```
```javascript
const mongoose = require('mongoose');
const Item = require('./models/Item');
const NodeCache = require('node-cache');
const itemCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const createItem = async (itemData) => {
  if (!itemData.name || !itemData.price) {
    throw new Error('Missing required fields');
  }
  const newItem = new Item(itemData);
  const savedItem = await newItem.save();
  itemCache.del("allItems");
  return savedItem;
};

const readItem = async (id) => {
  const cacheKey = `item_${id}`;
  const cachedItem = itemCache.get(cacheKey);
  if (cachedItem) {
    return cachedItem;
  }
  const item = await Item.findById(id);
  if (!item) {
    throw new Error('Item not found');
  }
  itemCache.set(cacheKey, item);
  return item;
};

const readAllItems = async () => {
  const cacheKey = "allItems";
  const cachedItems = itemCache.get(cacheKey);
  if (cachedItems) {
    return cachedItems;
  }
  const items = await Item.find({});
  itemCache.set(cacheKey, items);
  return items;
};

const updateItem = async (id, updateData) => {
  const cacheKey = `item_${id}`;
  const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedItem) {
    throw new Error('Item not found');
  }
  itemCache.set(cacheKey, updatedItem);
  itemCache.del("allItems");
  return updatedItem;
};

const deleteItem = async (id) => {
  const cacheKey = `item_${id}`;
  const deletedItem = await Item.findByIdAndDelete(id);
  if (!deletedItem) {
    throw new Error('Item not found');
  }
  itemCache.del(cacheKey);
  itemCache.del("allItems");
  return deletedItem;
};

module.exports = { createItem, readItem, readAllItems, updateItem, deleteItem };