import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { countries } from "countries-list";
import { DirectMessage, Conversation } from "../models/directMessage.model.js";
import { Project } from "../models/project.model.js";
import { Request } from "../models/request.model.js";
import { Invitation } from "../models/invitation.model.js";
import { Notification } from "../models/notification.model.js";
import { Channel } from "../models/channel.model.js";
import { Group } from "../models/group.model.js";
import crypto from "crypto"; 
import mongoose from "mongoose";
import { randomBytes, createHash } from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { getCookieOptions } from "../utils/cookieConfig.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, profession, country } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "This username is already taken",
        success: false,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "email already in use",
        success: false,
      });
    }

    if (!username || !email || !password || !profession || !country) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Validate if the country code exists in our countries list
    if (!countries[country]) {
      return res.status(400).json({
        message: "Invalid country selection",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user object with basic info
    let userObject = {
      username,
      email,
      password: hashedPassword,
      profession,
      profile: {
        country: {
          code: country,
          name: countries[country]?.name,
        },
      },
    };

    // Handle optional profile photo
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      userObject.profile.profilePhoto = cloudResponse.secure_url;
    }

    // Create the user with all the data
    await User.create(userObject);

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `This ${field} is already taken`,
        success: false,
      });
    }
    return res.status(500).json({
      message: "Error creating account",
      success: false,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    // check role is correct or not
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    };

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      path: "/",
    };

   return res
     .status(200)
     .cookie("token", token, getCookieOptions())
     .json({
       message: `Welcome back ${user.username}`,
       user,
       success: true,
     });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      username,
      email,
      bio,
      github,
      linkedin,
      portfolio,
      skills,
      country,
      profession
    } = req.body;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Handle file upload if present
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profession) user.profession = profession;
    if (bio) user.profile.bio = bio;
    if (country) {
      user.profile.country = {
        code: country,
        name: countries[country]?.name,
      };
    }

    // Handle skills as simple array
    if (skills) {
      try {
        const parsedSkills = JSON.parse(skills);
        user.profile.skills = parsedSkills;
      } catch (error) {
        console.error("Skills parsing error:", error);
        return res.status(400).json({
          message: "Invalid skills format",
          success: false,
        });
      }
    }

    user.profile.socialLinks = {
      github: github || user.profile.socialLinks?.github || "",
      linkedin: linkedin || user.profile.socialLinks?.linkedin || "",
      portfolio: portfolio || user.profile.socialLinks?.portfolio || "",
    };

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        profession: user.profession,
      },
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Error updating profile: " + error.message,
      success: false,
    });
  }
};

export const addToGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    user.profile.groups.push(groupId);
    await user.save();

    return res.status(200).json({
      message: "Added to group successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.id;

    if (!["available", "busy", "away"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status.", success: false });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    return res
      .status(200)
      .json({ message: "Status updated successfully.", user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

export const getUsersByProfession = async (req, res) => {
  try {
    const { profession } = req.params;
    const userId = req.id;

    const users = await User.find({ profession, _id: { $ne: userId } });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found for this profession.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Users fetched successfully.",
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "username email profession profile status"
    );

    return res.status(200).json({
      message: "Users fetched successfully.",
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.id;

    // First, fetch the user to get their data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile photo from Cloudinary if it exists
    if (user.profile?.profilePhoto) {
      try {
        const publicIdMatch =
          user.profile.profilePhoto.match(/\/([^/]+)\.[^.]+$/);
        if (publicIdMatch) {
          const publicId = publicIdMatch[1];
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("Error deleting profile photo:", error);
      }
    }

    // Delete all user's messages and conversations
    await DirectMessage.deleteMany({
      $or: [{ sender: userId }, { recipient: userId }],
    });
    await Conversation.deleteMany({ participants: userId });

    // Delete user's groups (where they are the creator)
    await Group.deleteMany({ userId: userId }); 

    // Remove user from other groups' members
    await Group.updateMany({ members: userId }, { $pull: { members: userId } });

    // Delete user's projects (where they are the creator)
    await Project.deleteMany({ created_by: userId }); 

    // Remove user from other projects' members
    await Project.updateMany(
      { "members.user": userId },
      { $pull: { members: { user: userId } } }
    );

    await Channel.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    await Request.deleteMany({ requester: userId });

    await Invitation.deleteMany({
      $or: [{ inviter: userId }, { recipient: userId }],
    });

    await Notification.deleteMany({ recipient: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};

export const deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if user has a profile photo to delete
    if (!user.profile.profilePhoto) {
      return res.status(400).json({
        message: "No profile photo to delete.",
        success: false,
      });
    }

    // Extract public_id from Cloudinary URL
    const publicId = user.profile.profilePhoto
      .split("/")
      .slice(-1)[0]
      .split(".")[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove profile photo URL from user document
    user.profile.profilePhoto = "";
    await user.save();

    return res.status(200).json({
      message: "Profile photo deleted successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    return res.status(500).json({
      message: "Error deleting profile photo",
      success: false,
      error: error.message,
    });
  }
};


export const forgotPassword = async (req, res) => {
  let user;

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("Searching for user with email:", email);

    user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link will be sent.",
      });
    }

    // Generate random token
    const resetToken = randomBytes(32).toString("hex");

    // Store the hashed token in the database
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    console.log("Generated token:", resetToken);
    console.log("Hashed token for storage:", hashedToken);

    // Save the hashed token to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await user.save();

    // Send the unhashed token in the URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message: `You requested a password reset. Please click on this link to reset your password: ${resetUrl}\n\nThis link will expire in 30 minutes.`,
        actionButton: {
          text: "Reset Password",
          url: resetUrl,
        },
      });
      console.log("Email sent successfully with reset URL:", resetUrl);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error("Forgot password error details:", {
      error: error.message,
      stack: error.stack,
    });

    if (user) {
      try {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error sending reset email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    console.log("Received reset token:", token);

    // Hash the token from params the same way we did in forgotPassword
    const hashedToken = createHash("sha256").update(token).digest("hex");

    console.log("Hashed received token:", hashedToken);
    console.log("Looking for user with this hashed token");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found with matching token or token expired");
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    console.log("User found with ID:", user._id);

    // Set new password with proper hashing
    user.password = await bcrypt.hash(password, 10);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    console.log("Password reset successful for user:", user._id);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};