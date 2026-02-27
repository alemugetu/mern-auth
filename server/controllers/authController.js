import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";  
import userModels from "../models/userModels.js";
import transporter from "../config/nodemailer.js";



export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }

    try {
        const existingUser = await userModels.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModels({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        // Send welcome email (do not break registration if it fails)
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Welcome to our application",
                text: `Hello ${name},

Thank you for registering on our application.
We are excited to have you on board!

Best regards,
The Team`
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log("Email error:", emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in registering user"
        });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Please fill all the fields" });
    }
    try {
        const user = await userModels.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        }); 
       return res.json({ success: true, message: "User logged in successfully", token });
    } catch (error) {
        res.json({ success: false, message: "Error in logging in user" });
    }

}

 export const logout = (req, res) => {
    try{
        res.clearCookie("token" , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({ success: true, message: "User logged out successfully" });
    } catch (error) {
     return  res.json({ success: false, message: "Error in logging out user" });
    }
 }
   // Send OTP for account verification
 export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const user = await userModels.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account is already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyotp = otp;
        user.verifyotpExpiryAt = Date.now() + 60 * 60 * 1000;

        await user.save();

        // mail sending...
        console.log(`Generated OTP for ${user.email}: ${otp}`); // ← very helpful for debugging
           try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "verify your account",
                text: `your OTP for account verification is ${otp}. It will expire in 60 minutes.`
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log("Email error:", emailError.message);
        }

        return res.json({
            success: true,
            message: "Verification OTP sent on your email"
        });

    } catch (error) {
        console.error("sendVerifyOtp error:", error);   // ← very helpful
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

 //Verify Email OTP
 export const verifyEmail = async (req, res) => {
    const userId = req.userId;
    const { otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Please provide userId and otp" });
    }
    try {
        const user = await userModels.findById(userId);
        if(!user){
            return res.json({ success: false, message: "User not found" });
        }
        if(user.verifyotp === '' || user.verifyotp !== otp){
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if(user.verifyotpExpiryAt < Date.now()){
            return res.json({ success: false, message: "OTP has expired" });
        }
        user.isAccountVerified = true;
        user.verifyotp = '';
        user.verifyotpExpiryAt = 0;
        await user.save();
        return res.json({ success: true, message: "Email verified successfully" });
 }  catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
   // Check if user is authenticated
export const isAuthenticated = (req, res) => {
  try{
     return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
//send password reset OTP
export const sendResetotp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Please provide email" });
    }
    try {
       const user = await userModels.findOne({ email });
       if(!user){
        return res.json({ success: false, message: "User not found" });
       }
       const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyotp = otp;
        user.verifyotpExpiryAt = Date.now() + 60 * 60 * 1000;
        await user.save();

        // mail sending...
        console.log(`Generated OTP for ${user.email}: ${otp}`); // ← very helpful for debugging
           try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is ${otp}. It will expire in 60 minutes.`
            };
            await transporter.sendMail(mailOptions);
            return res.json({
                success: true,
                message: "Password reset OTP sent to your email"
            }); 
        } catch (emailError) {
            console.log("Email error:", emailError.message);
        }

        return res.json({
            success: true,
            message: "Password reset OTP sent to your email"
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Reset user passsword
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body; 
    
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Please provide email, otp and new password" });
    }
    try {
        const user = await userModels.findOne({ email });
        if(!user){
            return res.json({ success: false, message: "User not found" });
        } 
        if(user.resetotp === "" || user.resetotp !== otp){
            return res.json({ success: false, message: "Invalid OTP" });
        } 
        if(user.resetotpExpiryAt < Date.now()){
            return res.json({ success: false, message: "OTP has expired" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetotp = "";
        user.resetotpExpiryAt = 0;
        await user.save();
        return res.json({ success: true, message: "Password reset successfully" });
    }  catch (error) {
            return res.json({ success: false, message: error.message });
        }

}