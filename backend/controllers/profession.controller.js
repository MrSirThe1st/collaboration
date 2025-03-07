import { Profession } from "../models/profession.model.js";

export const searchProfessions = async (req, res) => {
  try {
    const { query } = req.query;

    let filter = {};
    if (query) {
      filter = { name: { $regex: query, $options: "i" } };
    }

    const professions = await Profession.find(filter).limit(20);

    return res.status(200).json({
      success: true,
      professions,
    });
  } catch (error) {
    console.error("Error searching professions:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching professions",
    });
  }
};
