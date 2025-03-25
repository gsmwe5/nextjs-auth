import db from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const question = formData.get("question");
    const correctOptionIndex = parseInt(formData.get("correct_option")); // 1-based index

    let options = [
      formData.get("option1") || "",
      formData.get("option2") || "",
      formData.get("option3") || "",
      formData.get("option4") || "",
    ];

    let optionImages = [null, null, null, null];

    for (let i = 0; i < 4; i++) {
      const image = formData.get(`option${i + 1}_image`);
      if (image && image.name) {
        const imageName = `${Date.now()}-option${i + 1}-${image.name}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");

        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, imageName);
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(filePath, imageBuffer);

        optionImages[i] = `/uploads/${imageName}`;
      }
    }

    // **Step 1: Insert into quiz_questions**
    const [result] = await db.execute(
      "INSERT INTO quiz_questions (question) VALUES (?)",
      [question]
    );
    const questionId = result.insertId; // Get the newly inserted question ID

    // **Step 2: Insert options into quiz_answers (with images)**
    const insertAnswersQuery = `
      INSERT INTO quiz_answers (question_id, answer_text, answer_image, is_correct)
      VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
    `;

    await db.execute(insertAnswersQuery, [
      questionId, options[0], optionImages[0], correctOptionIndex === 1 ? 1 : 0,
      questionId, options[1], optionImages[1], correctOptionIndex === 2 ? 1 : 0,
      questionId, options[2], optionImages[2], correctOptionIndex === 3 ? 1 : 0,
      questionId, options[3], optionImages[3], correctOptionIndex === 4 ? 1 : 0,
    ]);

    return new Response(JSON.stringify({ success: true, questionId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error adding question:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to add question" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
