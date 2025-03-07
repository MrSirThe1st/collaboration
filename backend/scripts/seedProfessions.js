import { Profession } from "../models/profession.model.js";
import { PROFESSIONS } from "../../client/src/data/professions.js";
import connectDB from "../../backend/utils/db.js";

const seedProfessions = async () => {
  try {
    await connectDB();

    await Profession.deleteMany({});
    console.log(`Cleared existing professions.`);

    const uniqueProfessions = [...new Set(PROFESSIONS)];
    console.log(`Total professions: ${PROFESSIONS.length}`);
    console.log(`Unique professions: ${uniqueProfessions.length}`);

    if (uniqueProfessions.length !== PROFESSIONS.length) {
      console.log(
        "Duplicate professions found! Proceeding with unique values only."
      );
    }

    const professionObjects = uniqueProfessions.map((profession) => ({
      name: profession,
    }));

    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < professionObjects.length; i += batchSize) {
      const batch = professionObjects.slice(i, i + batchSize);
      const result = await Profession.insertMany(batch, { ordered: false });
      insertedCount += result.length;
      console.log(
        `Inserted batch ${i / batchSize + 1}: ${result.length} professions`
      );
    }

    console.log(`Professions seeded successfully: ${insertedCount} inserted`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding professions:", error);
    process.exit(1);
  }
};

seedProfessions();
