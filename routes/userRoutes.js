const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const moment = require('moment');
// const { default: UserProfile } = require('../client/src/pages/User/UserProfile');

router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res
                .status(200)
                .send({ message: "User already exists ", success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res
            .status(200)
            .send({ message: "User created successfully ", success: true });
    } catch (error) {
        //console.log(error)
        res.status(500)
            .send({ message: "Error logging in", success: false, error });
    }
});


router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Password is incorrect", success: false });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            res.status(200).send({ message: "Login Successful", success: true, data: token });
        }
        // else{
        //     res.status(200).send({
        //         success: true,
        //         data: {...user_doc , password: ''},
        //     });
        // }
    } catch (error) {
       // console.log(error)
        res.status(500)
        .send({ message: "Error logging in", success: false, error });
    }
});

router.post('/get-user-info-by-id', authMiddleware, async (req,res) => {

    try {
        const user = await User.findOne({ _id: req.body.userId});
        console.log(user)
        user.password = undefined;
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        }
        else {
            res.status(200).send({
                success: true, 
                data: user
            });
        }
    } catch (error) {
        res.status(500)
            .send({ message: "Error getting user info", success: false, error });
    }

});

router.post('/update-user-profile', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const updateData = {
            name: req.body.userName,
            email: req.body.userEmail
        };
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            updateData,
            { new: true }
        ).select('-password');
        console.log("Updated User:", user);
        res.status(200).send({ 
            success: true,
            message: "User profile updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).send({ 
            message: "Error updating user profile", 
            success: false, 
            error 
        });
    }
});


router.post('/apply-doctor-account', authMiddleware , async (req, res) => {
    try {
        console.log(req.body.timings);
        const newdoctor = new Doctor({...req.body , status: "pending"});
        await newdoctor.save();
        const adminUser = await User.findOne({ isAdmin: true });

        const unseenNotifications = adminUser.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request",
            message : `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId : newdoctor._id,
                name : newdoctor.firstName + " " + newdoctor.lastName
            },
            onClickPath : "/admin/doctorslist"
        })
        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
        console.log(res.status);
        res.status(200).send({
           
            success: true,
            message: "Doctor account applied successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error applying doctor account" , success: false, error });
    }
});

router.post('/mark-all-notifications-as-seen', authMiddleware , async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        const unseenNotifications = user.unseenNotifications;
        user.seenNotifications = unseenNotifications;
        user.unseenNotifications = [];
        const updatedUser = await User.findByIdAndUpdate(user._id, user);
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "All notifications marked as seen",
            data: updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error applying doctor account" , success: false, error });
    }
});


router.post('/delete-all-notifications', authMiddleware , async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "All notifications cleared",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error deleting notifications" , success: false, error });
    }
});

router.get('/get-all-approved-doctors', authMiddleware , async (req, res) => {
    console.log("get all doctors")
    try {
        const doctors= await Doctor.find({status:"approved"});
        res
        .status(200)
        .send({
            message:"Doctor fetched successfully",
            success:true,
            data: doctors,
        });
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error applying doctor account" , 
            success: false,
             error,
         });
        }
    
});

router.post('/book-appointment', authMiddleware , async (req, res) => {
    //console.log("get all doctors")
    try { 
        req.body.status = "pending";
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
       // const date = moment(req.body.date,'DD-MM-YYYY');
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        //pushing notification to doctor based on his userid
        const user = await User.findOne({_id: req.body.doctorInfo.userId});
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `A new appointment request has been made by ${req.body.userInfo.name}`,
            onClickPath: '/doctor/appointments'
        })
        await user.save();
        res.status(200).send({
            message: "Appointment booked successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error in booking appointment" , 
            success: false,
             error,
         });
        }
    
});

router.post('/check-booking-availability', authMiddleware , async (req, res) => {
    //console.log("get all doctors")
    try { 
        console.log(req.body.date);
        const date = moment(req.body.date,'DD-MM-YYYY').toISOString();
        //const date = moment(req.body.date,'DD-MM-YYYY');
       // console.log(date);
        const fromTime = moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString();
        const toTime = moment(req.body.time,'HH:mm').add(1,'hours').toISOString();
        const doctorId = req.body.doctorId;
        console.log(fromTime);
        console.log(toTime);
        const appointments = await Appointment.find({
            doctorId,
            date,
            time: {$gte: fromTime, $lte: toTime},
            status: "approved"
        });
        for (const appointment of appointments) {
            console.log(appointment.date);
            console.log(appointment.doctorId);
        }
        if(appointments.length>0) {
            return res.status(200).send({
                message: "Appointment not available",
                success: false,
            })
        } else {
            return res.status(200).send({
                message: "Appointment available",
                success: true,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error in booking appointment" , 
            success: false,
             error,
         });
        }
    
});

router.get('/get-appointments-by-user-id', authMiddleware , async (req, res) => {
    console.log("get all doctors")
    try {
        const appointments= await Appointment.find({userId: req.body.userId});
        res
        .status(200)
        .send({
            message:"Appointments fetched successfully",
            success:true,
            data: appointments,
        });
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error fetching appointments" , 
            success: false,
             error,
         });
        }
    
});

module.exports = router;