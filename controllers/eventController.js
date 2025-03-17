const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, category, createdBy } = req.body;

        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            createdBy,
        });

        await event.save();
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'name email') // Populate createdBy user details (you can adjust the fields)
            .populate('interestedUsers', 'name email'); // Populate interested users details (you can adjust the fields)
        
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
            .populate('createdBy', 'name email')
            .populate('interestedUsers', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, category } = req.body;

        const event = await Event.findByIdAndUpdate(
            req.params.eventId,
            { title, description, date, time, location, category },
            { new: true } // Return the updated event
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a user to the interestedUsers list
exports.addInterestedUser = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Avoid adding the same user twice
        if (event.interestedUsers.includes(req.body.userId)) {
            return res.status(400).json({ message: 'User is already interested in this event' });
        }

        event.interestedUsers.push(req.body.userId);
        await event.save();

        res.status(200).json({ message: 'User added to interested users list', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a user from the interestedUsers list
exports.removeInterestedUser = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove the user from the interestedUsers array
        event.interestedUsers = event.interestedUsers.filter(
            (userId) => userId.toString() !== req.body.userId
        );

        await event.save();

        res.status(200).json({ message: 'User removed from interested users list', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
