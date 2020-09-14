const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const signup=require('../models/signup')



/*******************************************

For all api routes we need jwt(authentications) token means we have to use this verifyToken for all the routes as a middleware

*******************************************/

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }





router.get('/signup', (req, res) => {
    res.render("employee/signup", {
        viewTitle: "Sign up Form"
    });
});



router.post('/signup', (req, res) => {
    const user=new signup({
      _id: new mongoose.Types.ObjectId(),  
      email:req.body.email,
      password:req.body.password,

    })
    user.save((err, registeredUser) => {
      if (!err) {
        res.redirect('/employee/list');   
      } else {
        console.log(err) 
      }
    })
  })
  

  router.get('/signin', (req, res) => {
    res.render("employee/signin", {
        viewTitle: "Sign in Form"
    });
});


  router.post('/signin', (req, res) => {
    let userData = req.body
    signup.findOne({email: userData.email}, (err, user) => {
      if (err) {
        console.log(err)    
      } else {
        if (!user) {
          res.status(401).send('Invalid Email')
        } else 
        if ( user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
         let payload = {subject: user._id}
         let token = jwt.sign(payload, 'secretKey')
         console.log(token);
         res.redirect('/employee/list');
        
         
        }
      }
    })
  })
  







router.get('/',(req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Add NewTask"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var employee = new Employee();
    employee.Taskname = req.body.Taskname;
    employee.creation_timestamp = req.body.creation_timestamp;
    employee.edit_timestamp = req.body.edit_timestamp;
    employee.expiry = req.body.expiry;
    employee.completion_status = req.body.completion_status;
    employee.createdBy = req.body.createdBy;

    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
            
            else
                console.log('Error during record insertion : ' + err);

    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
            else
                console.log('Error during record update : ' + err);
        
    });
}


router.get('/list', (req, res) => {

  Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    
    });

});



router.get('/:id',(req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id',(req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});















module.exports = router;