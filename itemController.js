const mongoose = require('mongoose');
const ItemModel = require('./models/Item');
const NodeCache = require('node-cache');
const itemCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

myEmitter.on('itemAdded', (item) => {
  console.log(`New item added: ${item.name}`);
});

myEmitter.on('itemUpdated', (item) => {
  console.log(`Item updated: ${item.name}`);
});

myEmitter.on('itemRemoved', (itemId) => {
  console.log(`Item removed with ID: ${itemId}`);
});

const addItem = async (itemDetails) => {
  if (!itemDetails.name || !itemDetails.price) {
    throw new Error('Missing required fields');
  }
  const newItem = new ItemModel(itemDetails);
  const savedItem = await newItem.save();
  itemCache.del("allItemsCache");
  myEmitter.emit('itemAdded', savedItem);
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
  myEmitter.emit('itemUpdated', updatedItem);
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
  myEmitter.emit('itemRemoved', itemId);
  return deletedItem;
};

module.exports = { addItem, fetchItemById, fetchAllItems, updateItemDetails, removeItem };