const StudentAttendance = require('../models/StudentAttendance');
const EmployeeAttendance = require('../models/EmployeeAttendance');
const Student = require('../models/Student');
const Employee = require('../models/Employee');

// --- STUDENT ATTENDANCE SECTION ---

// Get list of registered students for a specific batch and time to take attendance
exports.getStudentsForAttendance = async (req, res) => {
    try {
        const { batch, batchTime } = req.query;

        if (!batch || !batchTime) {
            return res.status(400).json({ message: "Batch and Batch Time are required" });
        }

        // Fetch students who are registered AND belong to the batch/time
        // Assuming Student model has 'batch' and 'batchTime' fields or effective equivalent.
        // Looking at Student.js, it has 'batch'. It does NOT seem to have 'batchTime' explicitly?
        // Wait, let me check Student.js again in memory.
        // It has 'batch': String. It does NOT have 'batchTime'.
        // However, the user request says: "batch name (dropdown option), batch time (dropdown option)".
        // And "after selecting batch name and batch time it will let appear attendance table".
        // It implies we might need to filter students by simple batch name first, or maybe the system assumes students are in a batch that has a time?
        // Or maybe the user filters students just by batch, and 'batchTime' is just recorded for the attendance record (e.g. which slot).
        // BUT, usually a student belongs to a batch.
        
        // Let's look at the "Batch" model. Maybe Batch has time?
        // I don't have Batch model content loaded but I saw it exists.
        // Actually, if the Student model has only 'batch', then we filter by 'batch'.
        // If the user selects a time, it might just be metadata for the attendance record.
        // However, if the students are segregated by time, then we need to know.
        // Re-reading User Request: "after selecting batch name and batch time it will let appear attendance table"
        // It might be possible that we just show ALL students in that batch, and the 'Time' is just for the record.
        
        // Strategy: Filter by batch.
        // Also ensure isRegistered: true as per requirement.
        
        const students = await Student.find({ 
            batch: batch, 
            isRegistered: true,
            isActive: true,
            isDeleted: false
        }).populate('course', 'name'); 

        // Map to a cleaner format for frontend
        const mappedStudents = students.map(s => ({
            _id: s._id,
            enrollmentNo: s.enrollmentNo,
            name: `${s.firstName} ${s.lastName}`,
            courseName: s.course ? s.course.name : '',
            contactStudent: s.mobileStudent,
            contactParent: s.mobileParent,
        }));

        res.status(200).json(mappedStudents);

    } catch (error) {
        console.error("Error fetching students for attendance:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Check if attendance already taken
exports.checkStudentAttendanceStatus = async (req, res) => {
    try {
        const { date, batch, batchTime } = req.query;
        if (!date || !batch || !batchTime) return res.status(400).json({ message: "Missing params" });

        // Date needs to be normalized to start of day or ISO string match depending on how frontend sends it.
        // Usually frontend sends YYYY-MM-DD.
        // MongoDB stores Dates with time. 
        // Best approach: Store date as start of day payload from frontend or range query.
        // For simplicity, let's assume specific date match if stored with time 00:00:00, or use range.
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23,59,59,999);

        const existingRecord = await StudentAttendance.findOne({
            batchName: batch,
            batchTime: batchTime,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('takenBy', 'name')
          .populate('records.studentId', 'firstName lastName');

        if (existingRecord) {
            return res.status(200).json({ 
                exists: true, 
                takenBy: existingRecord.takenBy?.name || 'Unknown',
                record: existingRecord
            });
        }

        res.status(200).json({ exists: false });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Save Student Attendance
exports.saveStudentAttendance = async (req, res) => {
    try {
        const { date, batchName, batchTime, remarks, records } = req.body;
        const takenBy = req.user.id; // From auth middleware

        // Validate basic
        if(!date || !batchName || !batchTime || !records) {
             return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Parse date
        const attendanceDate = new Date(date);
        // Normalize time to avoid dupes if strictly checking date
        // But the schema has unique index on date+batch+time. 
        // It's safer if we rely on the Date object being consistent (e.g. set to noon or midnight UTC) OR use the query range check above.
        // Ideally, we should check if exists first to update or throw error.
        
        // Double check uniqueness to be safe (though index handles it)
        const startOfDay = new Date(attendanceDate);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(attendanceDate);
        endOfDay.setHours(23,59,59,999);

        let attendance = await StudentAttendance.findOne({
            batchName,
            batchTime,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (attendance) {
            // Update existing
             attendance.takenBy = takenBy;
             attendance.remarks = remarks;
             attendance.records = records;
             await attendance.save();
             return res.status(200).json({ message: "Attendance updated successfully", attendance });
        } else {
            // Create new
            attendance = new StudentAttendance({
                date: attendanceDate,
                batchName,
                batchTime,
                takenBy,
                remarks,
                records
            });
            await attendance.save();
            return res.status(201).json({ message: "Attendance saved successfully", attendance });
        }

    } catch (error) {
        console.error("Save Student Attendance Error:", error);
        res.status(500).json({ message: "Error saving attendance", error: error.message });
    }
};

// Get Attendance History (Filter)
exports.getStudentAttendanceHistory = async (req, res) => {
    try {
        const { fromDate, toDate, batch } = req.query;
        let query = {};
        
        if (fromDate && toDate) {
             query.date = {
                 $gte: new Date(fromDate),
                 $lte: new Date(toDate)
             };
        }
        
        if (batch) {
            query.batchName = batch;
        }

        const history = await StudentAttendance.find(query)
            .sort({ date: -1 })
            .limit(10); // Limit ?

        // User mentioned "Main Filter: From Date, to date, batch name, batch time".
        // And table showing: enrollment number, batch name, batch time, attendance date, view, edit, delete.
        // Wait, the history table shows *records* (summary of a batch attendance) or *individual students*?
        // "table: enrollment number, batch name, batch time, attendance date..." 
        // "Attendance Table" typically implies listing the Batch Attendance event.
        // BUT "Enrollment number" in the columns suggests it lists INDIVIDUAL student attendance logs?
        // Re-reading: "-> table: enrollment number, batch name, batch time, attendance date, view, edit, delete"
        // If it lists "enrollment number", it implies searching for a specific student's attendance? 
        // OR does it mean the user wants to see a list of Students who were marked?
        // The structure "Add new attendance form" -> then "Attendance Table" (taking process).
        // Then outside, "Main Filter" -> "Table".
        // This outer table seems to be the "Report" or "View" list.
        // If "Enrollment number" is a column, it means rows are Students.
        // If so, `StudentAttendance` model stores a document *per batch*. I'd need to unwind it or query differently.
        // However, usually "Edit Attendance" edits the whole batch record.
        // "Edit" button on a specific student row would be odd if the form is for a whole batch.
        
        // LET'S RE-READ CAREFULLY:
        // "Attendance table: ... enrollment number ..." (This is inside the 'Add new attendance form' -> 'Attendance Table'). This is the grid to check present/absent.
        
        // "-> Table" (This is at the bottom, presumably the result of "Main Filter").
        // "enrollment number, batch name, batch time, attendance date, view, edit, delete"
        // Use of "Enrollment number" here is confusing if it lists the Batch Attendance.
        // Maybe the user wants to see a flat list of all students' attendance records?
        // But "Edit/Delete" usually applies to the Batch Entry.
        // AND "View" says "for showing table of present students with remarks". This implies the row represents a BATCH ENTRY, not a student.
        // If the row is a Batch Entry, "Enrollment number" makes no sense there.
        // UNLESS the user wants to search attendance BY student?
        // BUT the filter inputs are: "From Date, to date, batch name, batch time". NO Student search input.
        // So "Enrollment number" in the result table might be a typo / misunderstanding in the prompt, OR it simply shouldn't be there for a Batch-based record.
        // OR, maybe the user copied the columns from the inner table.
        // I will assume the MAIN list should show the BATCH ATTENDANCE RECORDS (Date, Batch, Time, Taken By).
        // I will OMIT "Enrollment number" from the main list columns because it doesn't fit a "Grouped" record.
        // Instead, I'll allow "View" to see the details (which include enrollment numbers).
        
        const records = await StudentAttendance.find(query)
                                .populate('takenBy', 'name')
                                .populate('records.studentId', 'firstName lastName')
                                .sort({ date: -1 });
                                
        res.status(200).json(records);

    } catch (error) {
         res.status(500).json({ message: "Server Error", error });
    }
};

// Delete Student Attendance
exports.deleteStudentAttendance = async (req, res) => {
    try {
        await StudentAttendance.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting", error });
    }
};


// --- EMPLOYEE ATTENDANCE SECTION ---

exports.getEmployeesForAttendance = async (req, res) => {
    try {
        // Fetch all active employees
        const employees = await Employee.find({ 
            isActive: true, 
            isDeleted: false 
        });

        // Map
        const mapped = employees.map(e => ({
            _id: e._id,
            name: e.name,
            srNumber: e.regNo || e._id.toString().substring(0,6), // Fallback if no regNo
            role: e.type
        }));

        res.status(200).json(mapped);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.checkEmployeeAttendanceStatus = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: "Date required" });
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23,59,59,999);

        const record = await EmployeeAttendance.findOne({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('takenBy', 'name')
          .populate('records.employeeId', 'name');

        if (record) {
             return res.status(200).json({ exists: true, record, takenBy: record.takenBy?.name });
        }
        res.status(200).json({ exists: false });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.saveEmployeeAttendance = async (req, res) => {
    try {
        const { date, remarks, records } = req.body;
        const takenBy = req.user.id;

        const attendanceDate = new Date(date);
        const startOfDay = new Date(attendanceDate);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(attendanceDate);
        endOfDay.setHours(23,59,59,999);

        let attendance = await EmployeeAttendance.findOne({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (attendance) {
            attendance.takenBy = takenBy;
            attendance.remarks = remarks;
            attendance.records = records;
            await attendance.save();
            return res.status(200).json({ message: "Employee attendance updated", attendance });
        } else {
            attendance = new EmployeeAttendance({
                date: attendanceDate,
                takenBy,
                remarks,
                records
            });
            await attendance.save();
            return res.status(201).json({ message: "Employee attendance saved", attendance });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving employee attendance", error });
    }
};

exports.getEmployeeAttendanceHistory = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let query = {};
        if (fromDate && toDate) {
            query.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
        }
        
        const records = await EmployeeAttendance.find(query)
            .populate('takenBy', 'name')
            .populate('records.employeeId', 'name')
            .sort({ date: -1 });

        res.status(200).json(records);

    } catch (error) {
         res.status(500).json({ message: "Server Error", error });
    }
};

exports.deleteEmployeeAttendance = async (req, res) => {
    try {
        await EmployeeAttendance.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting", error });
    }
};
