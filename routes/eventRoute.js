const express = require('express');
const router = express.Router();
const {protect}=require('../middlewares/authMiddleware')
const eventController = require('../controllers/eventController');

const {createEvent, getAllEvents, } =require('../controllers/eventController')


router.post('/new',protect, createEvent);
router.get('/',getAllEvents);


module.exports = router;