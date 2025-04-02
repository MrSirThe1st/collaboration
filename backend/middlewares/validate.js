import { validationResult, check, body } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  };
};

export const projectValidation = {
  create: [
    check("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),

    check("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),

    check("requirements")
      .isArray({ min: 1 })
      .withMessage("Please add at least one team role requirement"),

    check("requirements.*")
      .isString()
      .withMessage("Please enter each team role as text")
      .trim()
      .notEmpty()
      .withMessage("Team role fields cannot be empty"),

    check("groupId").isMongoId().withMessage("Valid group ID is required"),

    check("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isIn([
        "Web Application",
        "Mobile Application",
        "Desktop Software",
        "Video Game",
        "AI/Machine Learning",
        "Data Analytics",
        "IoT & Embedded Systems",
        "AR/VR Experience",
        "Blockchain Solution",
        "E-Commerce Platform",
        "CRM/ERP System",
        "API/Backend Service",
        "Chatbot/Conversational AI",
        "Cybersecurity Tool",
        "DevOps Tool",
        "Educational Software",
        "Healthcare Solution",
        "FinTech Application",
        "Social Platform",
        "Content Management System",
        "Productivity Tool",
        "Multimedia/Entertainment",
        "SaaS Product",
        "Research Tool",
        "Other",
      ])
      .withMessage("Invalid category"),

    check("skills")
      .optional()
      .isArray()
      .withMessage("Please enter skills in the correct format"),

    check("countryRestriction")
      .optional()
      .isObject()
      .withMessage(
        "Country restriction information is not in the correct format"
      ),

    check("countryRestriction.isGlobal")
      .optional()
      .isBoolean()
      .withMessage(
        "Please specify whether the project is globally available with Yes or No"
      ),


    body("communication").custom((value) => {
      if (value) {
        if (typeof value !== "object") {
          throw new Error(
            "Communication details are not in the correct format"
          );
        }
        if (value.platform && typeof value.platform !== "string") {
          throw new Error("Please enter the communication platform as text");
        }
        if (value.link && typeof value.link !== "string") {
          throw new Error("Please enter the communication link as text");
        }
      }
      return true;
    }),

    // Custom validation for socialLinks object
    body("socialLinks").custom((value) => {
      if (value) {
        if (typeof value !== "object") {
          throw new Error("Social media links are not in the correct format");
        }
        const socialFields = [
          "instagram",
          "twitter",
          "linkedin",
          "github",
          "website",
        ];
        for (const field of socialFields) {
          if (value[field] && typeof value[field] !== "string") {
            throw new Error(`Please enter your ${field} link as text`);
          }
        }
      }
      return true;
    }),
  ],

  update: [
    check("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty if provided")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),

    check("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty if provided")
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),

    check("requirements")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one requirement is required if provided"),

    check("category")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Category cannot be empty if provided"),

    check("skills").optional().isArray().withMessage("Skills must be an array"),
  ],
};

// Additional validation sets
export const milestoneValidation = {
  create: [
    check("title").trim().notEmpty().withMessage("Title is required"),

    check("projectId").isMongoId().withMessage("Valid project ID is required"),

    check("dueDate").isISO8601().withMessage("Due date must be a valid date"),
  ],
};

export const taskValidation = {
  create: [
    check("title").trim().notEmpty().withMessage("Title is required"),

    check("projectId").isMongoId().withMessage("Valid project ID is required"),

    check("milestoneId")
      .optional()
      .isMongoId()
      .withMessage("Valid milestone ID is required if provided"),

    check("assignedRole")
      .trim()
      .notEmpty()
      .withMessage("Assigned role is required"),

      
    check("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
  ],
};
