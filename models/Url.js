const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
});

module.exports = mongoose.model('Url', urlSchema);
