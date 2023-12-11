// models/sites.js

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    MonitoringLocationIdentifier: { type: Number},
    LongitudeMeasure: { type: Number },
    LatitudeMeasure: { type: Number },
    MonitoringYear: { type: Number },
    MonitoringWeek: { type: Number },
    MonitoringLocationDescriptionText: { type: String },
    EstimatedDate: { type: Date },
    IndicatorsName: { type: String },
    Value: { type: Number },
    Unit: { type: String },
    status: { type: String, default: "loading" },
    COD:{ type: Number },
    DO_Value: { type: Number },
    NH4N_Value: { type: Number },
    pH_Value: { type: Number },
    
});

recordSchema.index({ MonitoringLocationIdentifier: 1, MonitoringYear: 1, MonitoringWeek: 1, IndicatorsName: 1 }, { unique: true });

const Record = mongoose.model('Record', recordSchema, 'records');

module.exports = Record;
