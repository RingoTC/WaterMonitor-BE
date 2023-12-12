const express = require('express');
const router = express.Router();
const Site = require('../models/sites');

router.get('/find/:MonitoringLocationIdentifier', async (req, res) => {
    const MonitoringLocationIdentifier = req.params.MonitoringLocationIdentifier;

    try {
        const site = await Site.findOne({ MonitoringLocationIdentifier: MonitoringLocationIdentifier });

        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }

        return res.json(site);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const sites = await Site.find();
        return res.json(sites);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete', async (req, res) => {
    const { MonitoringLocationIdentifier } = req.body;

    try {
        console.log("delete site", MonitoringLocationIdentifier);
        const site = await Site.findOneAndDelete({ MonitoringLocationIdentifier: MonitoringLocationIdentifier });

        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }

        return res.json(site);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;