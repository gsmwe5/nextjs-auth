import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const SECRET_KEY = process.env.JWT_SECRET;
    const cookieStore = cookies();
    const userToken = cookieStore.get("authToken")?.value;

    if (!userToken) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    // Decode token to extract user ID
    const decoded = jwt.verify(userToken, SECRET_KEY);
    const userId = decoded.userId;

    console.log("Decoded userId:", userId);

    // Fetch latest quiz summary for the user
    const [quizSummary] = await db.execute(
      `SELECT
        id AS summary_id, total_questions, correct_answers,
        incorrect_answers, skipped_questions, score_percentage
       FROM quiz_summary
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (!quizSummary.length) {
      return new Response(JSON.stringify({ success: false, error: "No quiz results found." }), { status: 404 });
    }

    const summaryId = quizSummary[0].summary_id;

    // Fetch question-wise details
    const [questions] = await db.execute(
      `SELECT
        qq.id AS question_id,
        qq.question AS question_text,
        qq.image AS question_image,
        qa.selected_answer_id,
        ca.answer_text AS correct_answer,
        (qa.selected_answer_id IS NOT NULL) AS attempted,
        (qa.selected_answer_id = ca.id) AS is_correct
      FROM quiz_attempts qa
      JOIN quiz_questions qq ON qa.question_id = qq.id
      LEFT JOIN quiz_answers ca ON ca.question_id = qq.id AND ca.is_correct = 1
      WHERE qa.quiz_summary_id = ?`,
      [summaryId]
    );

    // Fetch all answer options for the questions
    const [options] = await db.execute(
      `SELECT
        question_id,
        id AS answer_id,
        answer_text,
        answer_image
      FROM quiz_answers
      WHERE question_id IN (SELECT question_id FROM quiz_attempts WHERE quiz_summary_id = ?)`,
      [summaryId]
    );

    // Group options by question_id
    const groupedOptions = {};
    options.forEach((opt) => {
      if (!groupedOptions[opt.question_id]) {
        groupedOptions[opt.question_id] = [];
      }
      groupedOptions[opt.question_id].push({
        text: opt.answer_text,
        image: opt.answer_image,
        id: opt.answer_id,
      });
    });

    // Format final response
    const formattedQuestions = questions.map((q) => ({
      id: q.question_id,
      question: q.question_text,
      options: groupedOptions[q.question_id] || [],
      selected_answer: q.selected_answer_id,
      correct_option: q.correct_answer,
      question_image: q.question_image,
      attempted: q.attempted,
      is_correct: q.is_correct,
    }));

    console.log("Formatted Questions:", formattedQuestions);

    return new Response(
      JSON.stringify({
        success: true,
        summary: quizSummary[0],
        questions: formattedQuestions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to fetch quiz results" }), { status: 500 });
  }
}
