const mongoose = require('mongoose');
require('dotenv').config();

const fixIndexes = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/education_erp');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const db = mongoose.connection.db;
        const collection = db.collection('students');

        // Check existing indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        // Drop the problematic index
        if (indexes.find(i => i.name === 'regNo_1')) {
            await collection.dropIndex('regNo_1');
            console.log('dropped index: regNo_1');
        } else {
            console.log('Index regNo_1 not found (might already be fixed or named differently)');
        }
        
        console.log('Done. Please restart your application server to recreate indexes correctly.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIndexes();
