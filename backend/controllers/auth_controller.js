import userModel from '../models/user.js';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'


export const register = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const existUser = await userModel.findOne({ email: email })

        if (existUser) {
            return res.status(401).json({ success: false, message: "user already Exist" })
        }

        const hashedpassword = await bcryptjs.hash(password, 10)
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedpassword,
        })

        await newUser.save()
        return res.status(200).json({ newUser })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }

}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email is Not Registered" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in prod
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 3600000,
        });



        // Exclude password from user object
        const { password: userPassword, ...safeUser } = user._doc;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });

    }

}
export const logout = async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in prod
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        // Send success response
        res.status(200).json({ message: "User Logged Out" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
