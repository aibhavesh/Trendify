import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            required : [true, "Name is required"],
            trim : true,
        },
        email :{
            type : String,
            required : [true, "Email is required"],
            trim : true,
            unique : true,
            lowercase : true,
        },
        password :{
            type : String,
            required : [true, "Password is required"],
            minlength : [6, "Password must be at least 6 characters long"],
        },
        role :{
            type : String,
            enum : ['user', 'admin'],
            default : 'user',

        },
    },
    {
        timestamps : true
    }
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;