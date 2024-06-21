const mongoose = require("mongoose");


const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter the author names, if there are multiple names use comma"]
    },
    roll: {
        type: String,
        required: [true, "Enter the roll id, if there are multiple names use comma"]
    },
    thesis_or_project: {
        type: Boolean,
        required: [true, "Enter the type"]
    },
    thesis_project: {
        type: String,
        required: [true, "Enter the link"]
   
    },
    
        workLink: {
            type: String,
            required: [false, "Enter the link"]
        },
    
    university: {
        type: String,
        required: [true, "Enter the university names, if there are multiple names use comma"]
   
    },
    work: {
        type: String,

    }
},{
    timestamps: true,
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;