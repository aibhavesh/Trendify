import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/UserModel.js";
import { validateLoginInput } from "../../validators/authValidators.js";

const loginController = async (req, res) => {
    try {
        const {email , password } = req.body;
        const { isValid, errors } = validateLoginInput({ email, password });

        if(!isValid){
            return res.status(400).json({message : "Validation failed", errors});
        }

        const user = await User.findOne({ email: String(email).toLowerCase() });
        if(!user){
            return res.status(400).json({message : "Invalid Email or Password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid Email or Password"});
        }


        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {expiresIn : '7d'}
        );

        return res.status(200).json({
            message : "Login successful",
            token,
            user : {_id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
            },
        }); 
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}

export default loginController;
