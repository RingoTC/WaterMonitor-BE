// models/sites.js

const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    MonitoringLocationIdentifier: { type: Number, required: true },
});

const Site = mongoose.model('Sites', siteSchema, 'sites');

module.exports = Site;
