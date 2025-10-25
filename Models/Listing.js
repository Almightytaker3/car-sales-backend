const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  CarModel: String,
  Year: String,
  Price: String,
  ImageURL: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', listingSchema);
