const mongoose = require('mongoose');
const Item = require('./models/Item'); 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const createItem = async (itemData) => {
  if (!itemData.name || !itemData.price) {
    throw new Error('Missing required fields');
  }
  const newItem = new Item(itemData);
  const savedItem = await newItem.save();
  return savedItem;
};

const readItem = async (id) => {
  const item = await Item.findById(id);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
};

const readAllItems = async () => {
  const items = await Item.find({});
  return items;
};

const updateItem = async (id, updateData) => {
  const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedItem) {
    throw new Error('Item not found');
  }
  return updatedItem;
};

const deleteItem = async (id) => {
  const deletedItem = await Item.findByIdAndDelete(id);
  if (!deletedItem) {
    throw new Error('Item not found');
  }
  return deletedItem;
};

module.exports = { createItem, readItem, readAllItems, updateItem, deleteItem };