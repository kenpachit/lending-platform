const mongoose = require('mongoose');

const lendingItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: String,
  itemOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentBorrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Adding a method to log information about lending items
lendingItemSchema.methods.logDetails = function() {
  console.log(`Item Name: ${this.itemName}`);
  console.log(`Description: ${this.itemDescription}`);
  console.log(`Owner ID: ${this.itemOwner}`);
  console.log(`Available: ${this.isAvailable}`);

  if (this.currentBorrower) {
    console.log(`Currently Borrowed By: ${this.currentBorrower}`);
  } else {
    console.log("Currently Not Borrowed");
  }
};

module.exports = mongoose.model('LendingItem', lendingItemSchema);

const LendingItem = require('./path-to-your-model-file'); // Adjust the path as necessary

// Assume you have found an item from your database, for example
LendingItem.findById(itemId)
  .then(item => {
    item.logDetails(); // This will log the details of the item to the console.
  })
  .catch(err => {
    console.error('Error fetching item:', err);
  });