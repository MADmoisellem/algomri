var express = require('express');
var router = express.Router();

const messagesModel = require('../models/Messages')

/* GET messages. */

router.get('/', async (req, res, next) => {
    try {
        const message = await messagesModel.find()
        .populate("category")
        .populate("recipient")
        .populate("sender")
        res.json(message)
    } catch (err) {
        next(err)
    }
})

/* POST messages. */

router.post('/', async (req, res, next) => {
    try {
        const newMessage = await messagesModel.create(req.body)
        res.json(newMessage)
    } catch (err) {
        next(err)
    }
})

/* UPDATE messages. */
router.patch('/:id', async (req, res, next) => {
    try {
        const updatedMessage = await messagesModel.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true
            })
        res.json(updatedMessage)
    } catch (err) {
        next(err)
    }
})

/* DELETE messages. */
router.delete('/:id', async(req, res, next) => {
    try{
        const deletedMessage = await messagesModel.findByIdAndDelete(req.params.id)
        res.json(deletedMessage)
    }catch(err){
        next(err)
    }
})

module.exports = router;