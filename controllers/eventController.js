const Event = require('../models/Event');
const User = require('../models/User');
const { format } = require('date-fns');
// Get all events
const getAllEvents = async (req, res) => {
    try {
        // Extract page and limit from query parameters with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Fetch events with pagination
        const events = await Event.find()
            .populate('createdBy', 'name email') // Populate createdBy user details
            .populate('interestedUsers', 'name email') // Populate interested users details
            .skip(skip) // Skip previous pages' events
            .limit(limit); // Limit the number of results per page

        // Count total events for frontend reference
        const totalEvents = await Event.countDocuments();

        res.status(200).json({
            events,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page,
            hasMore: skip + events.length < totalEvents, // Check if more pages exist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving events' });
    }
};


// Create a new event
const createEvent = async (req, res) => {
    const { title, description, date, time, location, category } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            createdBy: userId,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

// Get a single event by ID
const getEventById = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId)
            .populate('createdBy', 'name email')
            .populate('interestedUsers', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving event' });
    }
};

// Update an event
const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const { title, description, date, time, location, category } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is authorized to update the event
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this event' });
        }

        // Format the time to 12-hour AM/PM format
        const formattedTime = time ? format(new Date(`1970-01-01T${time}:00`), 'hh:mm a') : event.time;

        // Update event fields
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = formattedTime; // Use the formatted time
        event.location = location || event.location;
        event.category = category || event.category;

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event' });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is authorized to delete the event
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this event' });
        }

        // Delete the event
        await event.deleteOne();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};

// Add a user to the interestedUsers list
const addInterestedUser = async (req, res) => {
    const { eventId } = req.params;
    const  userId  = req.user.id; 

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Avoid adding the same user twice
        if (event.interestedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User is already interested in this event' });
        }

        event.interestedUsers.push(userId);
        await event.save();

        res.status(200).json({ message: 'User added to interested users list', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding user to event' });
    }
};

// Remove a user from the interestedUsers list
const removeInterestedUser = async (req, res) => {
    const { eventId } = req.params;
    const  userId  = req.user.id;  

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove the user from the interestedUsers array
        event.interestedUsers = event.interestedUsers.filter(
            (id) => id.toString() !== userId
        );

        await event.save();
        res.status(200).json({ message: 'User removed from interested users list', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing user from event' });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    addInterestedUser,
    removeInterestedUser,
};
