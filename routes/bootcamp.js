const express = require('express')
const router = express.Router()

router.get('/',(req,res) => {
    res.status(200).json({ success : true , msg : 'Show all bootcamps'})
})
router.post('/',(req,res) => {
    res.status(200).json({ success : true , msg : 'Create new Bootcamp'})
})
router.put('/:id',(req,res) => {
    res.status(200).json({ success : true , msg : `Update the bootcamp with id ${req.params.id}`})
})
router.get('/:id',(req,res) => {
    res.status(200).json({ success : true , msg : `Get Bootcamp with id ${req.params.id}`})
})
router.delete('/:id',(req,res) => {
    res.status(200).json({ success : true , msg : `Delete the bootcamp with id ${req.params.id}`})
})

module.exports = router