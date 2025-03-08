import { Notification } from "../models/notification.model.js";
import { io } from "../index.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking notification as read",
    });
  }
};


export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.id, read: false },
      { read: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking all notifications as read",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting notification",
    });
  }
};


export const clearAllNotifications = async (req, res) => {
  try {

    await Notification.deleteMany({ recipient: req.id });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Error clearing notifications",
    });
  }
};