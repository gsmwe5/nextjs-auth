import db from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch quiz questions
    const [questions] = await db.execute(
      "SELECT id, question, image, type FROM quiz_questions ORDER BY id ASC"
    );

    // Fetch all quiz answers
    const [answers] = await db.execute(
      "SELECT id, question_id, answer_text, answer_image, is_correct FROM quiz_answers ORDER BY question_id ASC"
    );

    // Group answers by question_id
    const answersMap = {};
    answers.forEach((answer) => {
      if (!answersMap[answer.question_id]) {
        answersMap[answer.question_id] = [];
      }
      answersMap[answer.question_id].push({
        id: answer.id,
        text: answer.answer_text,
        image: answer.answer_image,
        is_correct: answer.is_correct,
      });
    });

    // Format questions with corresponding answers
    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      question: question.question,
      image: question.image, // Question image (if any)
      type: question.type, // Text or image-based question
      answers: answersMap[question.id] || [],
    }));

    return new Response(
      JSON.stringify({ success: true, questions: formattedQuestions }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch quiz questions" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
