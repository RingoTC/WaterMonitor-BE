const express = require('express');
const router = express.Router();
const Record = require('../models/record');

router.get('/find/:MonitoringLocationIdentifier', async (req, res) => {
    const MonitoringLocationIdentifier = req.params.MonitoringLocationIdentifier;

    try {
        const record = await Record.find({ MonitoringLocationIdentifier: MonitoringLocationIdentifier });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        return res.json(record);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const records = await Record.find().sort({ EstimatedDate: -1 });
        return res.json(records);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/all/latest', async (req, res) => {
    try {
        const latestData = await Record.aggregate([
            {
                $sort: {
                    MonitoringLocationIdentifier: 1,
                    EstimatedDate: -1,
                },
            },
            {
                $group: {
                    _id: "$MonitoringLocationIdentifier",
                    latestData: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: { newRoot: "$latestData" },
            },
        ]);

        res.json(latestData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/totalcount', async (req, res) => {
    try {
        const count = await Record.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/totalComplete', async (req, res) => {
    try {
        const count = await Record.countDocuments({ status: 'complete' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/totalLoading', async (req, res) => {
    try {
        const count = await Record.countDocuments({ status: 'loading' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/addticket', async (req, res) => {
    try {
        const { MonitoringLocationIdentifier, MonitoringYear, MonitoringWeek, 
            MonitoringLocationDescriptionText, IndicatorsName,
            Value, Unit, status } = req.body;

        const EstimatedDate = new Date(); 

        const newRecord = new Record({ 
            MonitoringLocationIdentifier, MonitoringYear, MonitoringWeek, 
            MonitoringLocationDescriptionText, EstimatedDate, IndicatorsName,
            Value, Unit, status 
        });

        await newRecord.save();

        return res.status(201).json(newRecord); 
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/latest/:MonitoringLocationIdentifier', async (req, res) => {
    const MonitoringLocationIdentifier = req.params.MonitoringLocationIdentifier;
    try {
        const record = await Record.findOne({ MonitoringLocationIdentifier: MonitoringLocationIdentifier }).sort({ EstimatedDate: -1 });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        return res.json(record);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/latest/:MonitoringLocationIdentifier', async (req, res) => {
    const MonitoringLocationIdentifier = req.params.MonitoringLocationIdentifier;
    try {
        const record = await Record.findOne({ MonitoringLocationIdentifier: MonitoringLocationIdentifier }).sort({ EstimatedDate: -1 });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        return res.json(record);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedRecord = await Record.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        return res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting from MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/updateticket/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedRecord = await Record.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        return res.json(updatedRecord);
    } catch (error) {
        console.error('Error updating MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/ticket/:id', async (req, res) => {
    try {
        const ticket = await Record.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/finduserticket/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const records = await Record.find({ reporter: username });
        if (records.length === 0) {
            return res.status(404).json({ message: 'No records found for this user' });
        }
        return res.json(records);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


module.exports = router;