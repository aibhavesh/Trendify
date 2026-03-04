import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import { updateProfileController } from '../../controllers/user/updateProfileController.js';

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req , res)=> {
    try{
        const user = req.user;

        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully',
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: error.message
        }); 
    }
});

// Update user profile
router.put('/profile', authMiddleware, updateProfileController);

export default router;