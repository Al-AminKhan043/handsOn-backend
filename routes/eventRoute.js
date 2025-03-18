const express = require('express');
const router = express.Router();
const {protect}=require('../middlewares/authMiddleware')
const {getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    addInterestedUser,
    removeInterestedUser } =require('../controllers/eventController')


router.post('/new',protect, createEvent);
router.get('/',getAllEvents);
router.put('/:eventId/edit', protect,updateEvent);
router.get('/:eventId',protect,getEventById)
router.delete('/:eventId',protect, deleteEvent);
router.post('/:eventId/user', protect,addInterestedUser )
router.delete('/:eventId/user', protect,removeInterestedUser)
module.exports = router;