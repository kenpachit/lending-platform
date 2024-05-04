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

lendingItemSchema.methods = {
  ...lendingItemSchema.methods,

  logDetails() {
    this.logBasicDetails();
    this.logAvailability();
    this.logBorrowerDetails();
  },

  logBasicDetails() {
    console.log(`Item Name: ${this.itemName}`);
    console.log(`Description: ${this.itemDescription}`);
    console.log(`Owner ID: ${this.itemOwner}`);
  },

  logAvailability() {
    console.log(`Available: ${this.isAvailable}`);
  },

  logBorrowerDetails() {
    const borrowerMessage = this.currentBorrower
      ? `Currently Borrowed By: ${this.currentBorrower}`
      : "Currently Not Borrowed";
    console.log(borrowerMessage);
  }
};

module.exports = mongoose.model('LendingItem', lendingItemSchema);

const LendingItem = require('./path-to-your-model-file'); 

LendingItem.findById(itemId)
  .then(item => {
    item.logDetails();
  })
  .catch(err => {
    console.error('Error fetching item:', err);
  });