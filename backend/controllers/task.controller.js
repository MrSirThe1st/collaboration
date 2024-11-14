import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { Milestone } from "../models/milestone.model.js";
import { User } from "../models/user.model.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      milestoneId,
      status = "todo",
      priority,
      assignedRole,
      dueDate,
    } = req.body;

    const userId = req.id;

    // Validate project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if milestone exists if provided
    if (milestoneId) {
      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: "Milestone not found",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      milestone: milestoneId,
      status,
      priority,
      assignedRole,
      dueDate,
      createdBy: userId,
    });

    // If milestone provided, update its progress
    if (milestoneId) {
      await Milestone.updateMilestoneProgress(milestoneId);
    }

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId })
      .populate("milestone", "title progress")
      .populate("assignees.user", "username email profile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = status;
    await task.save();

    // Update milestone progress if task is associated with one
    if (task.milestone) {
      await Milestone.updateMilestoneProgress(task.milestone);
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("milestone", "title progress")
      .populate("assignees.user", "username email profile")
      .populate("createdBy", "username");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = ({
      title,
      description,
      priority,
      dueDate,
      assignedRole,
    } = req.body);

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // If milestone is being changed, update progress for both old and new milestones
    if (
      req.body.milestoneId !== undefined &&
      task.milestone?.toString() !== req.body.milestoneId
    ) {
      const oldMilestoneId = task.milestone;
      task.milestone = req.body.milestoneId || null;

      if (oldMilestoneId) {
        await Milestone.updateMilestoneProgress(oldMilestoneId);
      }
      if (req.body.milestoneId) {
        await Milestone.updateMilestoneProgress(req.body.milestoneId);
      }
    }

    // Update other fields
    Object.assign(task, updateData);
    await task.save();

    const updatedTask = await Task.findById(id)
      .populate("milestone", "title progress")
      .populate("assignees.user", "username email profile");

    return res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const milestoneId = task.milestone;

    await Task.findByIdAndDelete(id);

    // Update milestone progress if task was part of a milestone
    if (milestoneId) {
      await Milestone.updateMilestoneProgress(milestoneId);
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already assigned
    const existingAssignee = task.assignees.find(
      (assignee) => assignee.user.toString() === userId
    );

    if (existingAssignee) {
      existingAssignee.role = role; // Update role if already assigned
    } else {
      task.assignees.push({ user: userId, role }); // Add new assignee
    }

    await task.save();

    const updatedTask = await Task.findById(id).populate(
      "assignees.user",
      "username email profile"
    );

    return res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
