'use strict';

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: 1 },
    userId: { type: String, required: true, index: 1 },
    editorId: { type: String, required: true, index: 1 },
    cookies: { type: [Number], required: true },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('biz-users', logSchema);
