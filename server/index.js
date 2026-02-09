const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock Calendar Data (until real OAuth is set up)
// In a real scenario, we'd use oauth2Client to list events.
const mockAvailability = {
    '2026-02-10': ['10:00', '14:00', '16:00'],
    '2026-02-11': ['09:00', '11:00', '15:00'],
    '2026-02-12': ['13:00', '14:00', '15:00']
};

// Endpoint to check availability
app.post('/api/check-availability', async (req, res) => {
    const { date } = req.body; // Expecting 'YYYY-MM-DD'
    console.log(`Checking availability for: ${date}`);

    // In a real implementation:
    // 1. Authenticate with Google Calendar API
    // 2. List events for the given date
    // 3. Calculate free slots based on existing events

    // For demo/prototype:
    const slots = mockAvailability[date] || ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    // Return free slots
    res.json({ date, available_slots: slots });
});

// Endpoint to schedule a meeting
app.post('/api/schedule-meeting', async (req, res) => {
    const { date, time, email, name } = req.body;
    console.log(`Scheduling meeting for ${name} (${email}) on ${date} at ${time}`);

    // In a real implementation:
    // 1. Authenticate with Google Calendar API
    // 2. Create an event resource
    // 3. Insert event into calendar

    res.json({
        success: true,
        message: `Meeting scheduled successfully for ${date} at ${time}`,
        meeting_details: { date, time, email, name }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
