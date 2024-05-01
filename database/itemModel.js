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

module.exports = mongoose.model('LendingItem', lendingItemSchema);