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
        const {doctorId,status} = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId,{
            status,
        })
        const user = await User.findOne({_id: doctor.userId});
        const unseenNotifications = user.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            message : `Your doctor account has been ${status}`,
            onClickPath : "/notifications"
        })
        user.isDoctor = status === "approved" ? true : false;
        await user.save();
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

router.post('/change-user-status', async (req, res) => {
    const { userId, status } = req.body;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.status = status;
       
        await user.save();

        return res.status(200).json({ success: true, message: `User status updated to ${status}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error updating user status' });
    }
});

router.post('/clear-blocked-doctors', async (req, res) => {
    try {
      const result = await Doctor.deleteMany({ status: 'blocked' });
  
      if (result.deletedCount > 0) {
        return res.status(200).json({
          success: true,
          message: 'Blocked doctors cleared successfully.',
        });
      } else {
        return res.status(200).json({
          success: false,
          message: 'No blocked doctors found.',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error. Failed to clear blocked doctors.',
        error: error.message,
      });
    }
  });

  router.post('/clear-blocked-users', async (req, res) => {
    try {
      const result = await User.deleteMany({ status: 'blocked' });
  
      if (result.deletedCount > 0) {
        return res.status(200).json({
          success: true,
          message: 'Blocked users cleared successfully.',
        });
      } else {
        return res.status(200).json({
          success: false,
          message: 'No blocked users found.',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error. Failed to clear blocked users.',
        error: error.message,
      });
    }
  });
module.exports = router;


