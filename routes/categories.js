var express = require('express');
var router = express.Router();
const categoryModel = require('../models/Categories')
const langModel = require('../models/Languages')

/* GET categories. */
router.get('/', async (req, res, next) => {
    try {
        const Cat = await categoryModel.find()
        res.json(Cat)
    } catch (err) {
        next(err)
    }
});

/* GET ONE categories. */
router.get('/:id', async (req, res, next) => {
    try {
        const oneCat = await categoryModel.findById(req.params.id)
        res.json(oneCat)
    } catch (err) {
        next(err)
    }
});

/* POST cat. */
router.post('/', async (req, res, next) => {
    try {
        const newLang = await langModel.create(req.body)
        res.json(newLang)
    } catch (err) {
        next(err)
    }
});

/* UPDATE cat. */

router.patch('/:id', async (req, res, next) => {
    try {
        const updatedCat = await categoryModel.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true
            })

        res.json(updatedCat)
    } catch (err) {
        next(err)
    }
})

/* DELETE cat. */

router.delete('/:id', async (req, res, next) => {
    try{
        const deletedCat = await categoryModel.findByIdAndDelete(req.params.id)
        res.json(deletedCat)
    }catch(err){
        next(err)
    }
});

module.exports = router;