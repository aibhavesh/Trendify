import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import User from '../../models/UserModel.js';
import e from 'express';

const router = express.Router();

// Get user profile

router.get('/profile', authMiddleware, async (req , res)=> {
    try{
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: error.message
        }); 
    }
})

export default router;