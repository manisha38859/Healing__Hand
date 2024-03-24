const express
 = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const { model } = require('mongoose');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/get-all-doctors', authMiddleware , async (req, res) => {
    console.log("get all doctors")
    try {
        const doctors= await Doctor.find({});
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
router.get('/get-all-users', authMiddleware , async (req, res) => {
    try {
        const users= await User.find({});
        res
        .status(200)
        .send({
            message:"Users fetched successfully",
            success:true,
            data: users,



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

router.post('/change-doctor-account-status', authMiddleware , async (req, res) => {
    try {
        const {doctorId,status,userId} = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId,{
            status,
        })
        const user = await User.findOne({_id: userId});
        const unseenNotifications = user.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            message : `Your doctor account has been ${status}`,
            onClickPath : "/notifications"
        })
        await User.findByIdAndUpdate(user._id, { unseenNotifications });
        console.log(res.status);
        res.status(200).send({
            message: "Doctor status updated successfully",
            success: true,
            data:doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500)
            .send({ message: "Error applying doctor account" , 
            success: false,
             error,
         });
        }
    
});
module.exports = router;