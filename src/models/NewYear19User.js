'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: 1 },
    userId: { type: String, required: true, index: 1 },
    cookies: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
