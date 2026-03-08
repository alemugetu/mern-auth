import userModels from "../models/userModels.js";

export const getUserData = async (req, res) => {
    try {
        const  userId = req.userId;
        const user = await userModels.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ 
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
                email: user.email
            }
         });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}