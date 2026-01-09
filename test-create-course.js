const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./backend/models/Course');

dotenv.config({ path: './backend/.env' }); // Adjust path if needed. Assuming running from root.

// Fallback if .env not loaded correctly (User might be running from root and .env is in backend or root)
// We'll try to guess or use the one from code if hardcoded (not recommended but for test)
// Better: assume process.env.MONGO_URI is available or hardcode for this test if we knew it. 
// Since we don't know the exact URI, we rely on existing config.
// Instead of creating a new connection logic, let's use the valid one from config/db.js if possible, but that's a module.
// Let's try standard connect.

const run = async () => {
    try {
        console.log("Connecting to DB...");
        // NOTE: We need the actual MONGO_URI. 
        // I will inspect .env file content first in the next step if this fails, 
        // but for now let's assume dotenv works if run from correct dir.
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Creating Course...");

        const testCourse = {
            name: "Test Course " + Date.now(),
            shortName: "TEST",
            courseFees: 1000,
            duration: 6,
            courseType: "Diploma",
            isActive: true,
            isDeleted: false
        };

        const created = await Course.create(testCourse);
        console.log("Course Created:", created._id);

        const found = await Course.findById(created._id);
        console.log("Course Found in DB:", found ? "YES" : "NO");
        console.log(found);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

run();
