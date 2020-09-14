const mongoose = require('mongoose');
//const db = "mongodb+srv://sagar:********@cluster0.akhk4.mongodb.net/newdatabase";
//this is for mongodb Atlas account we are storing data in cloude....

mongoose.connect('mongodb://localhost:27017/EmployeeDB', { useNewUrlParser: true,useCreateIndex:true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./employee.model');