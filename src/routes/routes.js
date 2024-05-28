const Tle = require('../models/Tle');
const express = require('express');
const router = express.Router();
router.use(express.json());


router.get('/tle', async (req, res) => {
 
    // res.status(200).json({result});
    
    // const dataAll = JSON.stringify(result);
    try {
           // const result = await Tle.aggregate([
    //     {
    //         $group: {
    //             _id: '$satelliteNumber',
    //             // latest: { $first: '$$ROOT' },
    //             // previous: { $last: '$$ROOT' }
    //             data: { $push: "$$ROOT" }
    //         }
    //     }
    // ]);

        // const tleData = await Tle.find();
        const tleData = await Tle.aggregate([
            {
                $group: {
                    _id: '$satelliteNumber',
                    // latest: { $first: '$$ROOT' },
                    // previous: { $last: '$$ROOT' }
                    data: { $push: "$$ROOT" }
                }
            }
        ]);
        res.json(tleData);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch TLE data'});
    }
});

router.get('/tle/:satelliteNumber', async (req, res) => {
    const { satelliteNumber } = req.params;
    try {
        const tleData = await Tle.find({ satelliteNumber });
        res.json(tleData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TLE data' });
    }
});


module.exports = router;