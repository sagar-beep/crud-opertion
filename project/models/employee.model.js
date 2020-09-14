const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    Taskname: {type: String },
    creation_timestamp: { type: Date},
    edit_timestamp: { type: Date },
    expiry: { type: Date},
    completion_status: { type: String },
    createdBy:{ type: String }
});



mongoose.model('Employee', employeeSchema);