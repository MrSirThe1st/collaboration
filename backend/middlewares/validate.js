// import { validationResult } from "express-validator";

// export const validate = (validations) => {
//   return async (req, res, next) => {
//     // Run all validations
//     await Promise.all(validations.map((validation) => validation.run(req)));

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       return next();
//     }

//     return res.status(400).json({
//       success: false,
//       errors: errors.array(),
//     });
//   };
// };

// // Example validation schema
// export const projectValidation = {
//   create: [
//     body("title").trim().notEmpty().withMessage("Title is required"),
//     body("description")
//       .trim()
//       .notEmpty()
//       .withMessage("Description is required"),
//     body("maxTeamSize")
//       .isInt({ min: 1 })
//       .withMessage("Valid team size is required"),
//     // Add more validations...
//   ],
// };
