"use server";
import db from "@/lib/db";

export async function POST(req) {
  console.log(req);
  try {
    console.log("Receiving quiz submission...");

    // Parse request body
    const { user_id, totalQuestions, attempted, correct, incorrect, skipped, answers } = await req.json();

    console.log("Parsed Data:", { user_id, totalQuestions, attempted, correct, incorrect, skipped, answers });

    if (!user_id) {
      console.error("User ID is missing");
      return new Response(JSON.stringify({ success: false, error: "User ID is required" }), { status: 400 });
    }

    // Insert into quiz_summary
    const [summaryResult] = await db.execute(
      `INSERT INTO quiz_summary (user_id, total_questions, correct_answers, incorrect_answers, skipped_questions, score_percentage)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, totalQuestions, correct, incorrect, skipped, (correct / totalQuestions) * 100]
    );

    const quizSummaryId = summaryResult.insertId;
    console.log(quizSummaryId);

    // Insert each question's response into quiz_attempts
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        console.log("Inserting answer:", answer);

        // Validate that the selected_answer exists in quiz_answers
        const [existingAnswer] = await db.execute(
          "SELECT id FROM quiz_answers WHERE id = ?",
          [answer.selected_answer_id]
        );

        if (existingAnswer.length === 0) {
          console.error(`Error: Selected answer ID ${answer.selected_answer_id} does not exist in quiz_answers.`);
          return new Response(
            JSON.stringify({ success: false, error: `Invalid answer: ${answer.selected_answer_id}` }),
            { status: 400 }
          );
        }

        // Insert only if the selected_answer is valid
        await db.execute(
          `INSERT INTO quiz_attempts (quiz_summary_id, question_id, selected_answer_id, is_correct)
       VALUES (?, ?, ?, ?)`,
          [quizSummaryId, answer.question_id, answer.selected_answer_id, answer.is_correct]
        );
      }
    }


    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to save quiz results" }), { status: 500 });
  }
}
