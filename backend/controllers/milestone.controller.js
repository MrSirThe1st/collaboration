import { Milestone } from "../models/milestone.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

export const createMilestone = async (req, res) => {
  try {
    const { title, description, projectId, dueDate } = req.body;
    const userId = req.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const highestOrder = await Milestone.findOne({ projectId })
      .sort({ order: -1 })
      .select("order");
    const order = highestOrder ? highestOrder.order + 1 : 0;

    const milestone = await Milestone.create({
      title,
      description,
      projectId,
      dueDate,
      order,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      milestone,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;

    const milestones = await Milestone.find({ projectId }).populate({
      path: "tasks",
      select: "status title", // Only select fields you need
    });

    // Transform milestones to include task counts
    const transformedMilestones = milestones.map((milestone) => {
      const tasks = milestone.tasks || [];
      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;

      return {
        ...milestone.toObject(),
        tasks: {
          completed: completedTasks,
          total: tasks.length,
        },
      };
    });

    return res.status(200).json({
      success: true,
      milestones: transformedMilestones,
    });
  } catch (error) {
    console.error("Error in getMilestones:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const addTaskToMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.milestone = id;
    await task.save();
    await Milestone.updateMilestoneProgress(id);

    return res.status(200).json({
      success: true,
      message: "Task added to milestone",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Add these missing methods to your milestone.controller.js

export const getMilestoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id)
      .populate({
        path: "tasks",
        select: "title status priority assignees dueDate",
        populate: {
          path: "assignees.user",
          select: "username profile.profilePhoto"
        }
      });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    return res.status(200).json({
      success: true,
      milestone,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    milestone.title = title || milestone.title;
    milestone.description = description || milestone.description;
    milestone.dueDate = dueDate || milestone.dueDate;

    await milestone.save();
    await Milestone.updateMilestoneProgress(id); // Recalculate progress after update

    const updatedMilestone = await Milestone.findById(id).populate({
      path: "tasks",
      select: "title status"
    });

    return res.status(200).json({
      success: true,
      milestone: updatedMilestone,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    // First delete all tasks associated with this milestone
    await Task.deleteMany({ milestone: id });

    // Then delete the milestone itself
    await Milestone.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Milestone and associated tasks deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const removeTaskFromMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.milestone?.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "Task is not associated with this milestone",
      });
    }

    task.milestone = undefined;
    await task.save();
    await Milestone.updateMilestoneProgress(id);

    return res.status(200).json({
      success: true,
      message: "Task removed from milestone",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};