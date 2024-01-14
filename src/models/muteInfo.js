'use strict';

const mongoose = require('mongoose');

const roleTimeSchema = new mongoose.Schema({
  guildId: {type: String, required: true}  
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('RoleTime', roleTimeSchema);
