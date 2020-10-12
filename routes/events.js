var express = require('express');
var router = express.Router();

const eventsModel = require('../models/Events')

/* GET events. */

router.get('/', async (req, res, next) => {
    try {
        const event = await eventsModel.find()
        .populate("category")
        .populate("participants")
        .populate("author")
        res.json(event)
    } catch (err) {
        next(err)
    }
})

/* POST events. */

router.post('/', async (req, res, next) => {
    try {
        const newEvent = await eventsModel.create(req.body)
        res.json(newEvent)
    } catch (err) {
        next(err)
    }
})

/* UPDATE events. */
router.patch('/:id', async (req, res, next) => {
    try {
        const updatedEvent = await eventsModel.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true
            })
        res.json(updatedEvent)
    } catch (err) {
        next(err)
    }
})

/* DELETE events. */
router.delete('/:id', async(req, res, next) => {
    try{
        const deletedEvent = await eventsModel.findByIdAndDelete(req.params.id)
        res.json(deletedEvent)
    }catch(err){
        next(err)
    }
})

module.exports = router;