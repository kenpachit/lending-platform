const mongoose = require('mongoose');
const ItemModel = require('./models/Item');
const NodeCache = require('node-cache');
const itemCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const addItem = async (itemDetails) => { 
  if (!itemDetails.name || !itemDetails.price) {
    throw new Error('Missing required fields');
  }
  const newItem = new ItemModel(itemDetails);
  const savedItem = await newItem.save();
  itemCache.del("allItemsCache");
  return savedItem;
};

const fetchItemById = async (itemId) => { 
  const cacheKey = `item_${itemId}`;
  const cachedItem = itemCache.get(cacheKey);
  if (cachedItem) {
    return cachedItem;
  }
  const item = await ItemModel.findById(itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  itemCache.set(cacheKey, item);
  return item;
};

const fetchAllItems = async () => { 
  const allItemsCacheKey = "allItemsCache";
  const cachedItems = itemCache.get(allItemsCacheKey);
  if (cachedItems) {
    return cachedItems;
  }
  const items = await ItemModel.find({});
  itemCache.set(allItemsCacheKey, items);
  return items;
};

const updateItemDetails = async (itemId, newData) => { 
  const cacheKey = `item_${itemId}`;
  const updatedItem = await ItemModel.findByIdAndUpdate(itemId, newData, { new: true });
  if (!updatedItem) {
    throw new Error('Item not found');
  }
  itemCache.set(cacheKey, updatedItem);
  itemCache.del("allItemsCache");
  return updatedItem;
};

const removeItem = async (itemId) => {
  const cacheKey = `item_${itemId}`;
  const deletedItem = await ItemModel.findByIdAndDelete(itemId);
  if (!deletedItem) {
    throw new Error('Item not found');
  }
  itemCache.del(cacheKey);
  itemCache.del("allItemsCache");
  return deletedItem;
};

module.exports = { addItem, fetchItemById, fetchAllItems, updateItemDetails, removeItem };