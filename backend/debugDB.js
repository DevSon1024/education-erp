const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let output = 'Connected to DB\n';
        
        const indexes = await mongoose.connection.collection('employees').indexes();
        output += 'INDEXES:\n' + JSON.stringify(indexes, null, 2) + '\n';

        const employees = await mongoose.connection.collection('employees').find().toArray();
        output += `Total Employees: ${employees.length}\n`;
        
        const emails = {};
        const regNos = {};
        
        employees.forEach(e => {
            if(emails[e.email]) emails[e.email].push(e._id);
            else emails[e.email] = [e._id];
            
            if(e.regNo) {
                if(regNos[e.regNo]) regNos[e.regNo].push(e._id);
                else regNos[e.regNo] = [e._id];
            }
        });

        output += '\n--- DUPLICATES ---\n';
        Object.keys(emails).forEach(email => {
            if(emails[email].length > 1) {
                output += `Duplicate Email: ${email} -> IDs: ${emails[email].join(', ')}\n`;
            }
        });
        Object.keys(regNos).forEach(regNo => {
             if(regNos[regNo].length > 1) {
                output += `Duplicate RegNo: ${regNo} -> IDs: ${regNos[regNo].join(', ')}\n`;
            }
        });
        
        output += '\n--- ALL EMPLOYEES ---\n';
        employees.forEach(e => {
            output += `${e._id} | ${e.name} | ${e.email} | ${e.regNo || 'NO_ID'}\n`;
        });

        fs.writeFileSync('debug_output.txt', output);
        console.log('Output written to debug_output.txt');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
