// models/allSite.js

const mongoose = require('mongoose');

const allSiteSchema = new mongoose.Schema({
    MonitoringLocationIdentifier: Number,
    LongitudeMeasure: Number,
    LatitudeMeasure: Number,
    MonitoringLocationDescriptionText: String,
});

const Site = mongoose.model('allSite', allSiteSchema, 'sites');

module.exports = Site;
