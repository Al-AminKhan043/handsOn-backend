const express = require('express');
const router = express.Router();
const {protect}=require('../middlewares/authMiddleware')
const {getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    addInterestedUser,
    removeInterestedUser, } =require('../controllers/eventController')


router.post('/new',protect, createEvent);
router.get('/',getAllEvents);
router.put('/:eventId/edit', protect,updateEvent);
router.delete('/:eventId',protect, deleteEvent);


module.exports = router;