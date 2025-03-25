import React from "react";

const QuizSummary = ({ summary, questions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-center">Quiz Summary</h2>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Question</th>
            <th className="border p-2">Selected Answer</th>
            <th className="border p-2">Correct Answer</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => {
            console.log(q);
            const selectedOption = q.options.find((opt) => opt.id === q.selected_answer);
            const correctOption = q.options.find((opt) => opt.text === q.correct_option);
            const isCorrect = selectedOption && correctOption && selectedOption.text === correctOption.text;

            return (
              <tr key={index} className="text-center">
                <td className="border p-2">{q.question}</td>
                <td className="border p-2">
                  {selectedOption ? (
                    selectedOption.image ? (
                      <img src={selectedOption.image} alt="Selected" className="w-16 h-16 mx-auto" />
                    ) : (
                      <span>{selectedOption.text}</span>
                    )
                  ) : (
                    <span className="text-red-500">❌ Skipped</span>
                  )}
                </td>
                <td className="border p-2">
                  {correctOption ? (
                    correctOption.image ? (
                      <img src={correctOption.image} alt="Correct" className="w-16 h-16 mx-auto" />
                    ) : (
                      <span>{correctOption.text}</span>
                    )
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
                <td className="border p-2">
                  {selectedOption ? (
                    isCorrect ? (
                      <span className="text-green-500 font-bold">✅</span>
                    ) : (
                      <span className="text-red-500 font-bold">❌</span>
                    )
                  ) : (
                    <span className="text-gray-500 font-bold">➖</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 p-4 bg-gray-100 text-center rounded-lg">
        <p><strong>Total Questions:</strong> {summary.total_questions}</p>
        <p><strong>Correct:</strong> {summary.correct_answers}</p>
        <p><strong>Incorrect:</strong> {summary.incorrect_answers}</p>
        <p><strong>Skipped:</strong> {summary.skipped_questions}</p>
        <p><strong>Score:</strong> {summary.score_percentage}%</p>
      </div>
    </div>
  );
};

export default QuizSummary;
