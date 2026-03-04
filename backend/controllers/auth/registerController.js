import User from '../../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { validateRegisterInput } from '../../validators/authValidators.js';

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const { isValid, errors } = validateRegisterInput({ name, email, password });
        if (!isValid) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default registerController;