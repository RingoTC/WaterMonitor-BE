// models/sites.js

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    MonitoringLocationIdentifier: Number,
    MonitoringLocationDescriptionText: String,
    EstimatedDate: Date,
    name: String,
    COD_Value: Number,
    DO_Value: Number,
    NH4N_Value: Number,
    pH_Value: Number,
    LongitudeMeasure: Number,
    LatitudeMeasure: Number,
    reporter: {
        type: [String],
        default: ["hanliao"]
    },
    status: {
        type: String,
        enum: ['complete', 'incomplete'],
        default: 'incomplete',
    },
});

recordSchema.index({ MonitoringLocationIdentifier: 1, MonitoringYear: 1, MonitoringWeek: 1, IndicatorsName: 1 }, { unique: true });

const Record = mongoose.model('Record', recordSchema, 'records');

module.exports = Record;
