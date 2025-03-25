"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const Quiz = () => {
  const { loggedIn, user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(600); // 10-minute timer
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      handleSubmit();
    }
  }, [timer]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/quiz");
      const data = await response.json();

      if (!Array.isArray(data.questions)) {
        throw new Error("Invalid response format");
      }

      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questions[currentQuestionIndex].id]: answerId, // Store answer_id
    }));
  };

  const handleNext = () => {
    console.log(questions[currentQuestionIndex]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const totalQuestions = questions.length;
    const attempted = Object.keys(selectedAnswers).length;

    let correctAnswers = 0;
    let answersPayload = [];

    questions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.answers.find((answer) => answer.is_correct === 1);

      if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctAnswers++;
      }

      answersPayload.push({
        question_id: question.id,
        selected_answer_id: selectedAnswerId || null,
        correct_answer_id: correctAnswer ? correctAnswer.id : null,
        is_correct: selectedAnswerId === correctAnswer?.id,
      });
    });

    const incorrectAnswers = attempted - correctAnswers;
    const skippedQuestions = totalQuestions - attempted;

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.userId,
          totalQuestions,
          attempted,
          correct: correctAnswers,
          incorrect: incorrectAnswers,
          skipped: skippedQuestions,
          answers: answersPayload,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Quiz result saved successfully!");
      } else {
        console.error("Error saving quiz result:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }

    setQuizCompleted(true);
  };

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {quizCompleted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">Your quiz has been submitted successfully!</h2>
          <p className="mt-2">You can view your results by clicking the link below.</p>
          <a href="/admin/quiz/result" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg">
            View Results
          </a>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <div className="text-right text-red-500 font-bold">
            Time Left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </div>
          {questions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}:</h2>
              <p className="mb-4">{questions[currentQuestionIndex].question}</p>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestionIndex].answers.map((answer) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    className={`p-2 border rounded-lg transition-colors duration-200 ${
                      selectedAnswers[questions[currentQuestionIndex].id] === answer.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {answer.answer_image ? (
                      <img src={answer.answer_image} alt="Answer" className="w-20 h-20" />
                    ) : (
                      answer.text
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Next
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-center gap-2 mt-4">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full ${
                  index === currentQuestionIndex ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
